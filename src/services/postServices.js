import { flattenFilter } from "@/utils/filter";
import PostEndpoint from "@endpoints/PostEndpoint";
import { privateRequest, publicRequest } from "@utils/request";

export const fetchPosts = async ({
  page = 0,
  pageSize = 20,
  sort = null,
  filter = {
    type: "NEWS",
  },
}) => {
  const response = await publicRequest.get(PostEndpoint.GET_POSTS, {
    params: {
      page,
      size: pageSize,
      sort,
      ...flattenFilter(filter),
    },
  });
  return response.data;
};

export const createPost = async (postInfo) => {
  const response = await privateRequest.post(
    PostEndpoint.CREATE_POST,
    postInfo,
  );
  return response.data;
};

export const updatePost = async (id, update_data) => {
  const response = await privateRequest.patch(
    PostEndpoint.UPDATE_POST(id),
    update_data,
  );
  return response.data;
};

export const fetchUniquePost = async (postID) => {
  const response = await publicRequest.get(PostEndpoint.GET_POST_BY_ID(postID));
  return response.data;
};

export const fetchCandidates = async ({
  page,
  pageSize = 10,
  sort = null,
  filter,
}) => {
  const response = await privateRequest.get(PostEndpoint.GET_ALL_CANDIDATES, {
    params: {
      page,
      size: pageSize,
      sort,
      ...flattenFilter(filter),
    },
  });
  return response.data;
};

export const fetchUniqueCandidate = async (candidateId) => {
  const response = await privateRequest.get(
    PostEndpoint.GET_CANDIDATE_BY_ID(candidateId),
  );
  return response.data;
};

export const applyRecruitment = async (postID, data, resumeAssetId) => {
  const response = await privateRequest.post(
    PostEndpoint.APPLY_CANDIDATE(postID),
    data,
    {
      params: {
        resumeAssetId: resumeAssetId,
      },
    },
  );
  return response.data;
};

export const changeRegistrationRecruitmentPostStatus = async (
  id,
  active,
  reopenUntil,
) => {
  const response = await privateRequest.post(
    PostEndpoint.CHANGE_REGISTRATION_RECRUIMENT_POST_STATUS(id),
    null,
    {
      params: {
        active,
        reopenUntil,
      },
    },
  );
  return response.data;
};

export const reviewCandidateApplication = async (
  candidateID,
  status,
  autoEmail = true,
) => {
  const response = await privateRequest.post(
    PostEndpoint.REVIEW_CANDIDATE(candidateID),
    null,
    {
      params: {
        autoEmail,
        status,
      },
    },
  );
  return response;
};
