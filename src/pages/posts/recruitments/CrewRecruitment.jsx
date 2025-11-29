import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { PageTitle, DoubleTabBar } from "@components/global";
import { useNavigate, useLocation } from "react-router";
import Color from "@constants/Color";

import { useRecruitmentPosts, useCandidates } from "@hooks/services/posts";

import RecruitmentList from "./RecruitmentList";
import CandidateTable from "./CandidateTable";
import useAllowedRole from "@/hooks/useAllowedRole";

const NUMBER_POST_PER_PAGE = 10;
const NUMBER_CANDIDATE_PER_PAGE = 10;

export default function CrewRecruitment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isAdmin = useAllowedRole("ADMIN");

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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle title="TUYỂN DỤNG" />

        {tab === 0 && isAdmin && (
          <Button
            variant="contained"
            onClick={() => navigate("/recruitment/create")}
            sx={{
              backgroundColor: Color.PrimaryGold,
              color: Color.PrimaryBlack,
              padding: "10px 20px",
              borderRadius: 4,
              height: "fit-content",
            }}
          >
            <AddCircleRoundedIcon />
            <Typography
              sx={{
                fontWeight: 700,
                marginLeft: "4px",
                textTransform: "capitalize",
              }}
            >
              Đăng Bài tuyển dụng
            </Typography>
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
            marginTop: 4,
            marginBottom: 2,
          }}
        />
      )}

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
            onPostClick={(id) => navigate(`/recruitment/${id}`)}
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
              navigate(`/recruitment/candidates/${id}/admin`)
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
