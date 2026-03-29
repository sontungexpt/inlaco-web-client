import { Asset } from "./shared/asset.api";

/* ===================== Course ===================== */

export type CourseResponse = {
  /* ===== Core ===== */
  id: string;
  name: string;
  slug?: string;
  description?: string;

  /* ===== Media ===== */
  wallpaper?: Asset;
  trainingProviderLogo?: Asset;

  /* ===== Training info ===== */
  trainingProviderName?: string;
  teacherName?: string;

  /* ===== Certification ===== */
  certified?: boolean;
  certificate?: Asset;

  /* ===== Students ===== */
  limitStudent?: number;
  enrolledStudentCount?: number;
  full?: boolean;

  /* ===== Registration ===== */
  registrationEnabled?: boolean;
  manuallyRegistrationDisabled?: boolean;
  manuallyRegistrationDisabledAt?: string;
  startRegistrationAt?: string;
  endRegistrationAt?: string;

  /* ===== Learning status ===== */
  enrolled?: boolean;
  learnable?: boolean;
  completionProgress?: number;

  /* ===== Lifecycle ===== */
  startDate?: string;
  endDate?: string;
  expired?: boolean;
  canceled?: boolean;
  forciblyFinished?: boolean;

  /* ===== Audit ===== */
  createdDate?: string;
  updatedDate?: string;
};

export type CourseDetailResponse = {
  id: string;
  name: string;
  slug: string;

  description: string;
  note: string;

  trainingProviderName: string;
  trainingProviderLogo: Asset;

  wallpaper: Asset;

  teacherName: string;

  startDate: string; // ISO
  endDate: string; // ISO

  status:
    | "PENDING" // The course is pending to start
    | "IN_PROGRESS" // The course is currently in progress
    | "COMPLETED" // The course has been successfully completed
    | "EXPIRED" // The course has expired
    | "CANCELLED" // The course was cancelled
    | "UNKNOWN"; // The status is unknown

  limitStudent: number;
  completionProgress: number;

  certified: boolean;
  expired: boolean;
  enrolled: boolean;
  forciblyFinished: boolean;
  canceled: boolean;
  registrationEnabled: boolean;

  enrolledAt: string | null;
  expiredAt: string | null;
  cancelledAt: string | null;
  forciblyFinishedAt: string | null;

  certificate: {
    url: string;
  } | null;

  reopenedBasedOn: string | null;
  archivedPosition: number | null;

  createdAt: string;
  updatedAt: string;
};
