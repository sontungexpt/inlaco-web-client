import { useMemo, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { PageTitle, BaseTabBar } from "@components/common";
import { useNavigate, useLocation } from "react-router";

import Color from "@constants/Color";

import { useRecruitmentPosts, useCandidates } from "@/queries/post.query";

import RecruitmentList from "./RecruitmentList";
import CandidateTable from "./CandidateTable";

import { useAllowedRole } from "@/contexts/auth.context";
import { Post } from "@/types/api/post.api";

const TABS = {
  POSTS: 0,
  CANDIDATES: 1,
};

export default function CrewRecruitment(
  postPerPage = 10,
  candidatePerPage = 10,
) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isAdmin = useAllowedRole("ADMIN");

  const init = useMemo(
    () => ({
      tab: state?.tab
        ? state.tab === "CANDIDATE"
          ? TABS.CANDIDATES
          : TABS.POSTS
        : null,
      postPage: state?.post?.page ?? 0,
      candidateStatus: state?.candidate?.status ?? "APPLIED",
      candidatePostId: state?.candidate?.recruitmentPostId ?? null,
      candidatePage: state?.candidate?.page ?? 0,
    }),
    [state],
  );

  const [tab, setTab] = useState(init.tab || TABS.POSTS);
  const [postPage, setPostPage] = useState(init.postPage);
  const [filterStatus, setFilterStatus] = useState(init.candidateStatus);
  const [candidatePage, setCandidatePage] = useState(init.candidatePage);

  const { data: postData, isLoading: postsLoading } = useRecruitmentPosts({
    page: postPage,
    pageSize: postPerPage,
  });
  const posts = postData?.content || [];

  const {
    data: {
      content: candidates = [],
      totalPages: totalCandidatePages = 0,
    } = {},
    isLoading: candidateLoading,
  } = useCandidates({
    page: candidatePage,
    pageSize: 30,
    filter: {
      status: filterStatus,
      recruitmentPostId: init.candidatePostId,
    },
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
                navigate(`/recruitments/create?postType=${"RECRUITMENT"}`)
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
                value: TABS.POSTS,
                label: "Danh sách bài đăng",
              },
              {
                value: TABS.CANDIDATES,
                label: "Danh sách đơn ứng tuyển",
              },
            ]}
            value={tab}
            singleTab={Boolean(init.tab)}
            onChange={(e, tab) => setTab(tab)}
            color={Color.SecondaryBlue}
            sx={{
              backgroundColor: Color.SecondaryWhite,
              marginTop: 3,
            }}
          />
        )}
      </Box>

      {/* ===== TAB 1: BÀI ĐĂNG ===== */}
      {tab === TABS.POSTS && (
        <RecruitmentList
          loading={postsLoading}
          posts={posts}
          isAdmin={isAdmin}
          totalPages={postData?.totalPages || 1}
          page={postPage + 1}
          onPageChange={(e: any, value: number) => setPostPage(value - 1)}
          onPostClick={(post: Post) => navigate(`/recruitments/${post.id}`)}
          onViewDetail={(post: Post) => navigate(`/recruitments/${post.id}`)}
          onApplyNow={(post: Post) =>
            navigate(`/recruitments/apply/${post.id}`)
          }
        />
      )}

      {/* ===== TAB 2: ỨNG VIÊN ===== */}
      {tab === TABS.CANDIDATES && (
        <CandidateTable
          loading={candidateLoading}
          filterStatus={filterStatus}
          onDetailClick={(id: string) =>
            navigate(`/recruitments/candidates/${id}`)
          }
          onFilterStatusChange={setFilterStatus}
          candidates={candidates}
          pagination={{
            count: totalCandidatePages,
            page: candidatePage + 1,
            onChange: (e, page) => setCandidatePage(page - 1),
          }}
        />
      )}
    </Box>
  );
}
