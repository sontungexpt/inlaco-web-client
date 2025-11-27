import PostEndpoint from "../endpoints/PostEndpoint";
import { privateRequest, publicRequest } from "@utils/request";

export const getAllPostAPI = async (page, size) => {
  try {
    const response = await publicRequest.get(
      `${PostEndpoint.GET_ALL}?page=${page}&size=${size}`,
    );
    return response;
  } catch (err) {
    return err.response;
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

export const getAllCandidatesAPI = async (page, size, status) => {
  try {
    const response = await privateRequest.get(
      `${PostEndpoint.GET_ALL_CANDIDATES}?status=${status}&page=${page}&size=${size}`,
    );
    return response;
  } catch (err) {
    return err.response;
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

export const applyRecruitmentAPI = async (postID, candidateInfo) => {
  try {
    const response = await privateRequest.post(
      `${PostEndpoint.CANDIDATE_APPLY}/${postID}`,
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
