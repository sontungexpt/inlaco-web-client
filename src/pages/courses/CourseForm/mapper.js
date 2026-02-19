import { datetimeToISO } from "@/utils/converter";

export const mapValuesToRequestBody = (
  values,
  { trainingProviderLogoAssetId, wallpaperAssetId },
) => ({
  // insitive infos
  teacherName: values.instructorName,
  trainingProviderName: values.institute,
  trainingProviderLogo: trainingProviderLogoAssetId,

  // course infos
  name: values.courseName,
  limitStudent: values.limitStudent,
  description: values.description,
  certified: values.isCertificatedCourse === "Có",
  startDate: datetimeToISO(values.startDate),
  endDate: datetimeToISO(values.endDate),
  startRegistrationAt: datetimeToISO(values.startRegistrationAt),
  endRegistrationAt: datetimeToISO(values.endRegistrationAt),
  achievedPosition: values.achievedPosition,
  wallpaper: wallpaperAssetId,
});
