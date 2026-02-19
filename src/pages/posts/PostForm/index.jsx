import React, { useMemo } from "react";
import { Formik } from "formik";
import { Box, Button, MenuItem, Grid, CircularProgress } from "@mui/material";
import {
  InfoTextFieldFormik,
  SectionWrapper,
  MarkdownPreviewFormik,
  ImageUploadFieldFormik,
  PageTitle,
  SimpleMarkdownEditor,
} from "@/components/common";
import { FORM_SCHEMA } from "./schema";
import { createPost, updatePost } from "@/services/postServices";
import { useLocation, useNavigate, useParams } from "react-router";
import { usePost } from "@/hooks/services/post";
import FormMode from "@/constants/FormMode";
import { buildInitialValues } from "./initial";
import { mapValuesToRequestBody } from "./mapper";
import toast from "react-hot-toast";
import LoadErrorState from "@/components/common/states/LoadErrorState";
import cloudinaryUpload from "@/services/cloudinaryServices";
import UploadStrategy from "@/constants/UploadStrategy";

export default function PostForm() {
  const navigate = useNavigate();
  const { fixedType } = useLocation().state || {};
  const { id: postId } = useParams();
  const mode = postId ? FormMode.EDIT : FormMode.CREATE;

  const {
    data: post,
    isError: isPostLoadError,
    isLoading: isPostLoading,
    refetch: refetchPost,
  } = usePost(postId);

  const initialValues = useMemo(
    () =>
      buildInitialValues({
        mode,
        post,
        fixedType,
      }),
    [fixedType, mode, post],
  );

  const viewPostDetail = ({ id, type }) => {
    if (type === "RECRUITMENT") {
      navigate(`/recruitments/${id}`);
    } else {
      navigate(`/posts/${id}`);
    }
  };

  const handleFormSubmission = async (values, { resetForm }) => {
    try {
      const [image] = await Promise.all([
        cloudinaryUpload(values.image, UploadStrategy.POST_IMAGE),
        // cloudinaryUpload(
        //   values.instituteLogo,
        //   UploadStrategy.TRAINING_PROVIDER_LOGO,
        // ),
      ]);

      const newPost =
        mode === FormMode.CREATE
          ? await createPost(
              mapValuesToRequestBody(values, {
                imageAssetId: image.assetId || image.asset_id,
                attachmentsAssetIds: [],
              }),
            )
          : await updatePost(postId, mapValuesToRequestBody(values));
      resetForm();
      viewPostDetail(newPost);
    } catch (error) {
      const msg = FormMode.CREATE
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

  if (mode === FormMode.EDIT && isPostLoadError) {
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
              title={mode === FormMode.EDIT ? "Cập nhật" : "ĐĂNG BÀI"}
              subtitle={
                mode === FormMode.EDIT
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
                ? mode === FormMode.EDIT
                  ? "Đang cập nhật bài viết..."
                  : "Đang tạo bài viết..."
                : mode === FormMode.EDIT
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
                  disabled={mode === FormMode.EDIT || fixedType}
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
            <SectionWrapper mt={3} title="Thông tin tuyển dụng*: ">
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
