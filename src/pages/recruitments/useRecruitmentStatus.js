import { useMemo } from "react";

export const useRecruitmentStatus = (post) => {
  return useMemo(() => {
    if (!post) return {};

    const now = new Date();
    const start = new Date(post?.recruitmentStartDate);
    const end = new Date(post?.recruitmentEndDate);

    const isNotStarted = now < start;
    const isExpired = now > end;
    const isActive = Boolean(post?.active);

    const isOpen = isActive && !isNotStarted && !isExpired;

    let label = "Đang tuyển";
    let color = "success";

    if (isNotStarted) {
      label = "Chưa tới thời gian đăng kí";
      color = "warning";
    } else if (!isActive || isExpired) {
      label = "Đã đóng";
      color = "error";
    }

    return {
      isNotStarted,
      isExpired,
      isActive,
      isOpen,
      label,
      color,
      isDisabled: !isOpen,
    };
  }, [post]);
};
