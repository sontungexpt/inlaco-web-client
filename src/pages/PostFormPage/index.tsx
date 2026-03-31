import { useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import { Box, Button, MenuItem, Grid, CircularProgress } from "@mui/material";
import {
  InfoTextFieldFormik,
  SectionWrapper,
  MarkdownPreviewFormik,
  ImageUploadFieldFormik,
  PageTitle,
  SimpleMarkdownEditor,
  LoadErrorState,
} from "@/components/common";
import { FORM_SCHEMA, FormValues } from "./schema";
import { BASE_FORM_VALUES } from "./initial";
import { mapPostToFormValues, mapValuesToRequestBody } from "./mapper";

import { createPost, updatePost } from "@/services/post.service";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { usePost } from "@/queries/post.query";

import cloudinaryUpload from "@/services/cloudinary.service";
import UploadStrategy from "@/constants/UploadStrategy";
import toast from "react-hot-toast";
import { Post } from "@/types/api/post.api";

export const FormType = {
  CREATE: "CREATE",
  EDIT: "EDIT",
};

export type PostFormPageParams = {
  postId?: string;
  postType?: string;
  formType?: string;
};

const usePostFormPageParams = (): PostFormPageParams => {
  const { id: postId } = useParams();
  const [searchParams] = useSearchParams();
  const postType = searchParams.get("postType") || undefined;
  const formType = searchParams.get("formType") || FormType.CREATE;
  return { postId, postType, formType };
};

export default function PostFormPage() {
  const navigate = useNavigate();
  const { postId, postType: fixedPostType, formType } = usePostFormPageParams();

  const {
    data: post,
    isError: isPostLoadError,
    isLoading: isPostLoading,
    refetch: refetchPost,
  } = usePost(postId);

  const initialValues = useMemo(() => {
    if (formType === FormType.EDIT) {
      return mapPostToFormValues(BASE_FORM_VALUES, post as Post);
    }
    return {
      ...BASE_FORM_VALUES,
      type: fixedPostType,
    };
  }, [fixedPostType, formType, post]);

  const viewPostDetail = ({ id, type }: { id: string; type: string }) => {
    navigate(`/posts/${id}`);
  };

  const handleFormSubmission = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const [image] = await Promise.all([
        cloudinaryUpload(values.image, UploadStrategy.POST_IMAGE),
        // cloudinaryUpload(
        //   values.instituteLogo,
        //   UploadStrategy.TRAINING_PROVIDER_LOGO,
        // ),
      ]);

      const newPost =
        formType === FormType.CREATE
          ? await createPost(
              mapValuesToRequestBody(values, {
                imageAssetId: image.assetId || image.asset_id,
                attachmentsAssetIds: [],
              }),
            )
          : await updatePost(postId, mapValuesToRequestBody(values, {}));
      resetForm();
      viewPostDetail(newPost);
    } catch (error) {
      const msg = FormType.CREATE
        ? "Tạo bài đăng thất bại"
        : "Cập nhật bài đăng thất bại";
      toast.error(msg);
    }
  };

  const POST_TYPES = [
    { label: "Tin tức", value: "NEWS" },
    { label: "Tuyển dụng", value: "RECRUITMENT" },
    { label: "Sự kiện", value: "EVENT" },
  ];

  if (formType === FormType.EDIT && isPostLoadError) {
    return (
      <LoadErrorState
        title="Không thể tải bài đăng"
        subtitle="Bài đăng không tồn tại hoặc đã bị xóa"
        onBack={() => navigate(-1)}
        onRetry={() => refetchPost()}
      />
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FORM_SCHEMA}
      validateOnChange
      enableReinitialize
      onSubmit={handleFormSubmission}
    >
      {({ values, dirty, isValid, isSubmitting, handleSubmit }) => (
        <Box component="form" onSubmit={handleSubmit}>
          <SectionWrapper>
            <PageTitle
              title={formType === FormType.EDIT ? "Cập nhật" : "ĐĂNG BÀI"}
              subtitle={
                formType === FormType.EDIT
                  ? "Cập nhật bài đăng"
                  : "Tạo bài đăng mới"
              }
              mb={2}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || !dirty || isSubmitting || isPostLoading}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting
                ? formType === FormType.EDIT
                  ? "Đang cập nhật bài viết..."
                  : "Đang tạo bài viết..."
                : formType === FormType.EDIT
                  ? "Cập nhật bài viết"
                  : "Tạo bài viết"}
            </Button>
          </SectionWrapper>

          <SectionWrapper title="Thông tin bài đăng*: ">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <InfoTextFieldFormik
                  select
                  label="Chọn loại bài viết"
                  name="type"
                  disabled={formType === FormType.EDIT || fixedPostType}
                >
                  {POST_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </InfoTextFieldFormik>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <InfoTextFieldFormik name="title" label="Tiêu đề" />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <InfoTextFieldFormik
                  name="company"
                  label="Tên công ty liên quan"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <InfoTextFieldFormik
                  name="description"
                  label="Mô tả"
                  multiline
                  minRows={2}
                  sx={{ "& textarea": { lineHeight: "1.5" } }}
                />
              </Grid>

              <Grid size={12}>
                <ImageUploadFieldFormik
                  required
                  label="Hình ảnh"
                  name="image"
                />
              </Grid>
            </Grid>
          </SectionWrapper>
          {values.type === "RECRUITMENT" && (
            <SectionWrapper sx={{ mt: 3 }} title="Thông tin tuyển dụng*: ">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoTextFieldFormik name="position" label="Vị trí" />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoTextFieldFormik
                    name="workLocation"
                    label="Địa điểm làm việc"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoTextFieldFormik
                    name="expectedSalary"
                    label="Mức lương dự kiến"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoTextFieldFormik
                    name="recruitmentStartDate"
                    label="Ngày bắt đầu đăng ký tuyển dụng"
                    type="datetime-local"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoTextFieldFormik
                    name="recruitmentEndDate"
                    label="Ngày kết thúc đăng ký tuyển dụng"
                    type="datetime-local"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>
          )}

          <SectionWrapper title="Nội dung bài viết*: ">
            <SimpleMarkdownEditor
              name="content"
              input={InfoTextFieldFormik}
              markdown={MarkdownPreviewFormik}
            />
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
}
