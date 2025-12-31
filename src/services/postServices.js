import PostEndpoint from "@endpoints/PostEndpoint";
import { privateRequest, publicRequest } from "@utils/request";

export const fetchPosts = async ({
  page = 0,
  size = 20,
  type = "NEWS",
  sort = null,
}) => {
  try {
    const response = await publicRequest.get(PostEndpoint.GET_POSTS, {
      params: {
        page,
        type,
        size,
        sort,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

/**
 * @typedef {Object} CreatePostPayload
 * @property {string} type
 * @property {string} title
 * @property {string} content
 * @property {string} company
 * @property {string} description
 * @property {string} recruitmentStartDate
 * @property {string} recruitmentEndDate
 * @property {string} position
 * @property {number[]} expectedSalary
 * @property {string} workLocation
 *
 * @param {CreatePostPayload} postInfo
 */
export const createPost = async (postInfo) => {
  try {
    const response = await privateRequest.post(
      PostEndpoint.CREATE_POST,
      postInfo,
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const updatePost = async (id, update_data) => {
  try {
    const response = await privateRequest.patch(
      PostEndpoint.UPDATE_POST(id),
      update_data,
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const fetchUniquePost = async (postID) => {
  try {
    const response = await publicRequest.get(
      PostEndpoint.GET_POST_BY_ID(postID),
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const fetchCandidates = async ({
  page,
  sizePerPage = 10,
  status,
  recruitmentPostId,
  sort = null,
}) => {
  try {
    const response = await privateRequest.get(PostEndpoint.GET_ALL_CANDIDATES, {
      params: {
        page,
        recruitmentPostId,
        size: sizePerPage,
        status,
        sort,
      },
    });
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const fetchUniqueCandidate = async (candidateID) => {
  try {
    const response = await privateRequest.get(
      PostEndpoint.GET_CANDIDATE_BY_ID(candidateID),
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const applyRecruitment = async (postID, data, resumePublicId) => {
  try {
    const response = await privateRequest.post(
      PostEndpoint.APPLY_CANDIDATE(postID),
      data,
      {
        params: {
          resumePublicId: resumePublicId,
        },
      },
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const changeRegistrationRecruitmentPostStatus = async (id, active) => {
  try {
    const response = await privateRequest.post(
      PostEndpoint.CHANGE_REGISTRATION_RECRUIMENT_POST_STATUS(id),
      null,
      {
        params: {
          active,
        },
      },
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const candidate_GetApplicationAPI = async () => {
  try {
    const response = await privateRequest.get(
      `${PostEndpoint.CANDIDATE_APPLICATION}?`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const reviewCandidateApplication = async (candidateID, status) => {
  try {
    const response = await privateRequest.post(
      PostEndpoint.REVIEW_CANDIDATE(candidateID),
      null,
      {
        params: {
          autoEmail: true,
          status,
        },
      },
    );
    return response;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const rejectCandidateApplicationAPI = async (candidateID) => {
  try {
    const response = await privateRequest.post(
      `${PostEndpoint.REVIEW_CANDIDATE}/${candidateID}?autoEmail=true&status=REJECTED`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};
