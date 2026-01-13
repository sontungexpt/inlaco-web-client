import { datetimeToISO } from "@/utils/converter";

// export const mapPostToFormValues = (post) => {
//   return {
//     ...post,
//     recruitmentStartDate: post?.recruitmentStartDate || "",
//     recruitmentEndDate: post?.recruitmentEndDate || "",
//   };
// };

export const mapValuesToRequestBody = (values) => ({
  // ...values,

  // insitive infos
  teacherName: values.instructorName,
  trainingProviderName: values.institute,

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
});
