import privateRequest from "../utils/privateRequest";
import CrewEndpoint from "../endpoints/CrewEndpoint";
import { dateStringToISOString } from "../utils/converter";
import { flattenFilter } from "@/utils/filter";

export const fetchCrewMembers = async ({ page, size, filter }) => {
  const response = await privateRequest.get(CrewEndpoint.GET_ALL_CREWS, {
    params: {
      page,
      size,
      ...flattenFilter(filter),
    },
  });
  return response.data;
};

export const searchCrewMembers = async ({
  query,
  page = 0,
  size = 10,
  filter,
}) => {
  const response = await privateRequest.get(CrewEndpoint.SEARCH, {
    params: {
      q: query,
      page,
      size,
      filter: filter && filter.toString(),
    },
  });
  return response.data;
};

export const fetchMyCrewProfile = async () => {
  const response = await privateRequest.get(CrewEndpoint.CURRENT_PROFILE);
  return response.data;
};

export const fetchSpecificCrewProfile = async (profileId) => {
  const response = await privateRequest.get(CrewEndpoint.GET_BY_ID(profileId));
  return response.data;
};

export const editCrewMemberProfileAPI = async (
  crewMemberID,
  crewMemberInfo,
) => {
  try {
    const response = await privateRequest.patch(
      `${CrewEndpoint.GENERAL}/${crewMemberID}`,
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
      `${CrewEndpoint.GENERAL}/${candidateID}`,
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
