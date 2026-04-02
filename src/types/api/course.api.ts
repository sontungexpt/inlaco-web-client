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

export enum CourseStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  UNKNOWN = "UNKNOWN",
}

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

  status: CourseStatus;

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

export type NewCourseRequest = {
  name: string;
  trainingProviderName?: string;
  trainingProviderLogo?: string;
  teacherName?: string;
  wallpaper?: string;
  archivedPosition?: string;

  certified: boolean;

  limitStudent: number;

  description: string;

  startRegistrationAt?: string; // ISO string
  endRegistrationAt?: string; // ISO string

  startDate: string; // ISO string
  endDate: string; // ISO string
};
