import { CenterCircularProgress, LoadErrorState } from "@/components/common";

import { usePost } from "@/queries/post.query";
import { useParams } from "react-router";
import RecruitmentPostDetailPage from "./RecruitmentPostDetailPage";
import PostDetailPage from "./PostDetailPage";

export default function Index() {
  const { id } = useParams();
  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch: refetchPost,
  } = usePost(id);

  if (isLoading) {
    return <CenterCircularProgress />;
  }

  if (isError && error?.response?.status === 404) {
    return (
      <LoadErrorState
        title="Không thể tải hợp đồng"
        subtitle="Hợp đồng không tồn tại hoặc đã bị xoa"
        onRetry={() => refetchPost()}
      />
    );
  }

  switch (post?.type) {
    case "RECRUITMENT":
      return <RecruitmentPostDetailPage />;
    default:
      return <PostDetailPage />;
  }
}
