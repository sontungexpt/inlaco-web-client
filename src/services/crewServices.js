import privateRequest from "../utils/privateRequest";
import CrewEndpoints from "../endpoints/crewEndpoints";
import { dateStringToISOString } from "../utils/converter";

export const fetchCrewMembers = async ({ page, size, official }) => {
  try {
    const response = await privateRequest.get(CrewEndpoints.GENERAL, {
      params: {
        page,
        size,
        official,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const getCrewMemberByID_API = async (crewMemberID) => {
  try {
    const response = await privateRequest.get(
      `${CrewEndpoints.GENERAL}/${crewMemberID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getProfileCurrentCrewMemberAPI = async () => {
  try {
    const response = await privateRequest.get(
      `${CrewEndpoints.CURRENT_PROFILE}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const editCrewMemberProfileAPI = async (
  crewMemberID,
  crewMemberInfo,
) => {
  try {
    const response = await privateRequest.patch(
      `${CrewEndpoints.GENERAL}/${crewMemberID}`,
      {
        birthDate: dateStringToISOString(crewMemberInfo.dob),
        fullName: crewMemberInfo.fullName,
        email: crewMemberInfo.email,
        phoneNumber: crewMemberInfo.phoneNumber,
        address: crewMemberInfo.address,
        gender: crewMemberInfo.gender,
        languageSkills: [crewMemberInfo.languageSkills],
        professionalPosition: crewMemberInfo.jobInfo.position,
        expertiseLevels: [crewMemberInfo.jobInfo.expertiseLevels],
        experiences: [crewMemberInfo.jobInfo.experience],
        socialInsuranceCode: crewMemberInfo.insuranceInfo.socialInsID,
        // socialInsuranceImages: [
        //   {
        //     url: "string",
        //     name: "string",
        //     type: "string",
        //   },
        // ],
        accidentInsuranceCode: crewMemberInfo.insuranceInfo.accidentInsID,
        // accidentInsuranceImages: [
        //   {
        //     url: "string",
        //     name: "string",
        //     type: "string",
        //   },
        // ],
        // healthInsuranceCode: crewMemberInfo.insuranceInfo.healthInsID,
        // healthInsHospital: crewMemberInfo.insuranceInfo.healthInsHospital,
        // healthInsuranceImages: [
        //   {
        //     url: "string",
        //     name: "string",
        //     type: "string",
        //   },
        // ],
      },
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const createCrMemberFrCandidateAPI = async (
  candidateID,
  candidateInfo,
) => {
  try {
    const response = await privateRequest.post(
      `${CrewEndpoints.GENERAL}/${candidateID}`,
      {
        birthDate: candidateInfo?.birthDate,
        fullName: candidateInfo?.fullName,
        email: candidateInfo?.email,
        phoneNumber: candidateInfo?.phoneNumber,
        address: candidateInfo?.address,
        gender: candidateInfo?.gender,
        professionalPosition: "",
        expertiseLevels: [],
        languageSkills: [],
        experiences: [],
        socialInsuranceCode: candidateInfo?.socialInsuranceCode,
        //healthInsuranceCode: candidateInfo?.healthInsuranceCode,
        //healthInsHospital: candidateInfo?.healthInsHospital,
        accidentInsuranceCode: candidateInfo?.accidentInsuranceCode,

        //adjust here later when file upload feature is done
        socialInsuranceImages: [
          {
            url: "",
            name: "",
            type: "",
          },
        ],
        // healthInsuranceImages: [
        //   {
        //     url: "",
        //     name: "",
        //     type: "",
        //   },
        // ],
        accidentInsuranceImages: [
          {
            url: "",
            name: "",
            type: "",
          },
        ],
      },
    );
    return response;
  } catch (err) {
    return err.response;
  }
};
