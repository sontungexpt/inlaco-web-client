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

export const getPostByID_API = async (postID) => {
  try {
    const response = await publicRequest.get(
      `${PostEndpoint.GENERAL}/${postID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const fetchCandidates = async ({
  page,
  size = 10,
  status,
  sort = null,
}) => {
  try {
    const response = await privateRequest.get(PostEndpoint.GET_ALL_CANDIDATES, {
      params: {
        page,
        size,
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

export const getCandidateByID_API = async (candidateID) => {
  try {
    const response = await privateRequest.get(
      `${PostEndpoint.CANDIDATE_GENERAL}/${candidateID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const createRecruitmentPostAPI = async (postInfo) => {
  try {
    const response = await privateRequest.post(`${PostEndpoint.GENERAL}`, {
      title: postInfo.title,
      content: postInfo.content,
      recruitmentStartDate: postInfo.recruitmentStartDate,
      recruitmentEndDate: postInfo.recruitmentEndDate,
      position: postInfo.position,
      expectedSalary: postInfo.expectedSalary,
      workLocation: postInfo.workLocation,
      type: "RECRUITMENT",
    });
    return response;
  } catch (err) {
    return err.response;
  }
};

export const applyRecruitment = async (postID, candidateInfo) => {
  try {
    const response = await privateRequest.post(
      PostEndpoint.APPLY_CANDIDATE(postID),
      {
        birthDate: candidateInfo.birthDate,
        fullName: candidateInfo.fullName,
        email: candidateInfo.email,
        phoneNumber: candidateInfo.phoneNumber,
        gender: candidateInfo.gender,
        address: candidateInfo.address,
        languageSkills: candidateInfo.languageSkills,
        resume: candidateInfo.resume,
      },
    );
    return response;
  } catch (err) {
    return err.response;
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

export const approveCandidateApplicationAPI = async (candidateID) => {
  try {
    const response = await privateRequest.post(
      `${PostEndpoint.REVIEW_CANDIDATE}/${candidateID}?autoEmail=true&status=WAIT_FOR_INTERVIEW`,
    );
    return response;
  } catch (err) {
    return err.response;
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
