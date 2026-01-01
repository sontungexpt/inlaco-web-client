import React, { useState } from "react";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { PageTitle, DoubleTabBar } from "@components/global";
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

  const [tab, setTab] = useState(INITITAL_TAB || 0);

  // post state
  const [postPage, setPostPage] = useState(state?.post?.page || 0);

  const { data: postData, isLoading: postsLoading } = useRecruitmentPosts(
    postPage,
    NUMBER_POST_PER_PAGE,
  );

  const posts = postData?.content || [];

  // candidate state

  const [filterCandidateStatus, setFilterCandidateStatus] = useState(
    state?.candidate?.status || "APPLIED",
  );

  const [paginationModel, setPaginationModel] = useState({
    page: state?.candidate?.page || 0,
    pageSize: NUMBER_CANDIDATE_PER_PAGE,
  });

  const INITIAL_RECRUIMENT_POST_ID =
    state?.candidate?.recruitmentPostId || null;
  const { data: candidateData, isLoading: candidateLoading } = useCandidates({
    status: filterCandidateStatus,
    recruitmentPostId: INITIAL_RECRUIMENT_POST_ID,
    page: paginationModel.page,
    sizePerPage: paginationModel.pageSize,
  });

  const candidates = candidateData?.content || [];
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
              onClick={() => navigate("/recruitment/create")}
              sx={{
                backgroundColor: Color.PrimaryGold,
                color: Color.PrimaryBlack,
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
                py: 1.2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: Color.PrimaryGoldHover,
                },
              }}
            >
              Đăng bài tuyển dụng
            </Button>
          )}
        </Stack>
        {isAdmin && (
          <DoubleTabBar
            tabLabel1={"Danh sách bài đăng"}
            tabLabel2={"Danh sách đơn ứng tuyển"}
            variant={"fullWidth"}
            initialTab={tab}
            isSingleTab={Boolean(INITITAL_TAB)}
            onTabChange={setTab}
            color={Color.SecondaryBlue}
            sx={{
              backgroundColor: Color.SecondaryWhite,
              marginTop: 3,
            }}
          />
        )}
      </Box>

      {/* ===== TAB 1: BÀI ĐĂNG ===== */}
      {tab === 0 &&
        (postsLoading ? (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <RecruitmentList
            posts={posts}
            isAdmin={isAdmin}
            totalPages={postData?.totalPages || 1}
            page={postPage + 1}
            onPageChange={(e, value) => setPostPage(value - 1)}
            onPostClick={(post) => navigate(`/recruitment/${post.id}`)}
            onViewDetail={(post) => navigate(`/recruitment/${post.id}`)}
            onApplyNow={(post) => navigate(`/recruitment/apply/${post.id}`)}
          />
        ))}

      {/* ===== TAB 2: ỨNG VIÊN ===== */}
      {tab === 1 &&
        (candidateLoading ? (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CandidateTable
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
            totalCandidates={candidateData.totalElements}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              setPaginationModel({ ...model });
            }}
          />
        ))}
    </Box>
  );
}
