import privateRequest from "../utils/privateRequest";
import publicRequest from "../utils/publicRequest";
import PostEndpoints from "../endpoints/postEndpoints";

export const getAllPostAPI = async (page, size) => {
  try {
    const response = await publicRequest.get(
      `${PostEndpoints.GET_ALL}?page=${page}&size=${size}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getPostByID_API = async (postID) => {
  try {
    const response = await publicRequest.get(
      `${PostEndpoints.GENERAL}/${postID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getAllCandidatesAPI = async (page, size, status) => {
  try {
    const response = await privateRequest.get(
      `${PostEndpoints.GET_ALL_CANDIDATES}?status=${status}&page=${page}&size=${size}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getCandidateByID_API = async (candidateID) => {
  try {
    const response = await privateRequest.get(
      `${PostEndpoints.CANDIDATE_GENERAL}/${candidateID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const createRecruitmentPostAPI = async (postInfo) => {
  try {
    const response = await privateRequest.post(`${PostEndpoints.GENERAL}`, {
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

export const applyRecruitmentAPI = async (postID, candidateInfo) => {
  try {
    const response = await privateRequest.post(
      `${PostEndpoints.CANDIDATE_APPLY}/${postID}`,
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
      `${PostEndpoints.CANDIDATE_APPLICATION}?`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const approveCandidateApplicationAPI = async (candidateID) => {
  try {
    const response = await privateRequest.post(
      `${PostEndpoints.REVIEW_CANDIDATE}/${candidateID}?autoEmail=true&status=WAIT_FOR_INTERVIEW`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const rejectCandidateApplicationAPI = async (candidateID) => {
  try {
    const response = await privateRequest.post(
      `${PostEndpoints.REVIEW_CANDIDATE}/${candidateID}?autoEmail=true&status=REJECTED`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

