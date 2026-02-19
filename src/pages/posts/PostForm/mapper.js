import { datetimeToISO } from "@/utils/converter";

export const mapPostToFormValues = (post) => {
  return {
    ...post,
    recruitmentStartDate: post?.recruitmentStartDate || "",
    recruitmentEndDate: post?.recruitmentEndDate || "",
  };
};

export const mapValuesToRequestBody = (
  values,
  { imageAssetId, attachmentsAssetIds },
) => ({
  ...values,
  image: imageAssetId,
  attachments: attachmentsAssetIds,
  recruitmentStartDate: datetimeToISO(values.recruitmentStartDate),
  recruitmentEndDate: datetimeToISO(values.recruitmentEndDate),
});
