import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  instructorName: "",
  institute: "",
  instituteLogo: null,
  courseName: "",
  courseWallpaper: null,
  description: "",
  startDate: new Date(),
  endDate: undefined,
  startRegistrationAt: undefined,
  endRegistrationAt: undefined,
  isCertificatedCourse: "",
  limitStudent: 50,
  archivedPosition: "",
};

export const CERTIFICATED_COURSE_OPTIONS = ["Có", "Không"];
