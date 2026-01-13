import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { PageTitle, BaseTabBar } from "@components/common";
import { useNavigate, useLocation } from "react-router";
import Color from "@constants/Color";

import { useRecruitmentPosts, useCandidates } from "@/hooks/services/post";

import RecruitmentList from "./RecruitmentList";
import CandidateTable from "./CandidateTable";
import useAllowedRole from "@/hooks/useAllowedRole";

export default function CrewRecruitment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isAdmin = useAllowedRole("ADMIN");
  const NUMBER_POST_PER_PAGE = 10;
  const NUMBER_CANDIDATE_PER_PAGE = 10;

  // If had initital tab then only show one bar
  const INITITAL_TAB = state?.tab === "CANDIDATE" ? 1 : state?.tab;
  const INITIAL_RECRUIMENT_POST_ID =
    state?.candidate?.recruitmentPostId || null;
  const INITIAL_STATUS = state?.candidate?.status || "APPLIED";
  const INITIAL_POST_PAGE = state?.post?.page || 0;

  const [tab, setTab] = useState(INITITAL_TAB || 0);
  const [postPage, setPostPage] = useState(INITIAL_POST_PAGE);

  const { data: postData, isLoading: postsLoading } = useRecruitmentPosts(
    postPage,
    NUMBER_POST_PER_PAGE,
  );

  const posts = postData?.content || [];

  // candidate state

  const [filterCandidateStatus, setFilterCandidateStatus] =
    useState(INITIAL_STATUS);

  const [paginationModel, setPaginationModel] = useState({
    page: state?.candidate?.page || 0,
    pageSize: NUMBER_CANDIDATE_PER_PAGE,
  });

  const {
    data: { content: candidates = [], totalElements: totalCandidates = 0 } = {},
    isLoading: candidateLoading,
  } = useCandidates({
    status: filterCandidateStatus,
    recruitmentPostId: INITIAL_RECRUIMENT_POST_ID,
    page: paginationModel.page,
    sizePerPage: paginationModel.pageSize,
  });

  return (
    <Box m="20px">
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          py: 2,
          backgroundColor: Color.PrimaryWhite,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <PageTitle title="TUYỂN DỤNG" />

          {tab === 0 && isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddCircleRoundedIcon />}
              onClick={() =>
                navigate("/recruitments/create", {
                  state: { fixedType: "RECRUITMENT" },
                })
              }
              sx={{
                backgroundColor: Color.PrimaryGold,
                color: Color.PrimaryBlack,
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
                py: 1.2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: Color.PrimaryLightGold,
                },
              }}
            >
              Đăng bài tuyển dụng
            </Button>
          )}
        </Stack>
        {isAdmin && (
          <BaseTabBar
            tabs={[
              {
                label: "Danh sách bài đăng",
              },
              {
                label: "Danh sách đơn ứng tuyển",
              },
            ]}
            variant={"fullWidth"}
            value={tab}
            singleTab={Boolean(INITITAL_TAB)}
            onChange={setTab}
            color={Color.SecondaryBlue}
            sx={{
              backgroundColor: Color.SecondaryWhite,
              marginTop: 3,
            }}
          />
        )}
      </Box>

      {/* ===== TAB 1: BÀI ĐĂNG ===== */}
      {tab === 0 && (
        <RecruitmentList
          loading={postsLoading}
          posts={posts}
          isAdmin={isAdmin}
          totalPages={postData?.totalPages || 1}
          page={postPage + 1}
          onPageChange={(e, value) => setPostPage(value - 1)}
          onPostClick={(post) => navigate(`/recruitments/${post.id}`)}
          onViewDetail={(post) => navigate(`/recruitments/${post.id}`)}
          onApplyNow={(post) => navigate(`/recruitments/apply/${post.id}`)}
        />
      )}

      {/* ===== TAB 2: ỨNG VIÊN ===== */}
      {tab === 1 && (
        <CandidateTable
          loading={candidateLoading}
          filterStatus={filterCandidateStatus}
          onAdminMemberDetailClick={(id) =>
            navigate(`/recruitment/candidates/${id}`)
          }
          onCreateCrewMemberClick={(candidateId) =>
            navigate(`/crews/add/${candidateId}`, {
              state: { candidateInfo: candidateId },
            })
          }
          onFilterStatusChange={setFilterCandidateStatus}
          candidates={candidates}
          totalCandidates={totalCandidates}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      )}
    </Box>
  );
}
