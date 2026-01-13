import { datetimeToISO } from "@/utils/converter";

export const mapPostToFormValues = (post) => {
  return {
    ...post,
    recruitmentStartDate: post?.recruitmentStartDate || "",
    recruitmentEndDate: post?.recruitmentEndDate || "",
  };
};

export const mapValuesToRequestBody = (values) => ({
  ...values,
  recruitmentStartDate: datetimeToISO(values.recruitmentStartDate),
  recruitmentEndDate: datetimeToISO(values.recruitmentEndDate),
});
