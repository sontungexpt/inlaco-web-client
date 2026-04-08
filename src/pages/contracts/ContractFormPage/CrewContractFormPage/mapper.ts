import {
  LaborContract,
  LaborParty,
  NewLaborContract,
  PartyType,
} from "@/types/api/contract.api";

import { datetimeToISO } from "@utils/converter";
import { FormValues } from "./schema";

const v = (val: any, fallback = "") => val ?? fallback;

export const mapCandidateInfoToFormValues = (
  currentFormValues: FormValues,
  candidateInfo: {
    fullName: string;
    phoneNumber: string;
    address: string;
  },
): FormValues => {
  if (!candidateInfo) {
    return currentFormValues;
  }

  return {
    ...currentFormValues,
    employee: {
      ...currentFormValues.employee,
      fullName: candidateInfo?.fullName,
      phoneNumber: candidateInfo?.phoneNumber,
      permanentAddress: candidateInfo?.address,
      temporaryAddress: candidateInfo?.address,
    },
  };
};

export const mapContractToFormValues = (
  currentFormValues: FormValues,
  contract: LaborContract,
): FormValues => {
  if (!contract) return currentFormValues;

  const employer = contract.initiator;
  const employee = contract.partners?.[0] as LaborParty;

  return {
    ...currentFormValues,

    title: v(contract.title),
    contractFile: null,
    attachmentFiles: [],

    employer: {
      companyName: v(employer?.name),
      companyAddress: v(employer?.address),
      companyPhone: v(employer?.phone),
      representativeName: v(employer?.representer),
      representativePosition: v(employer?.representerPosition),
    },

    employee: {
      fullName: v(employee?.name),
      birthDate: v(employee?.birthDate),
      birthPlace: v(employee?.birthPlace),
      phoneNumber: v(employee?.phone),
      nationality: v(employee?.nationality),
      permanentAddress: v(employee?.address),
      temporaryAddress: v(employee?.temporaryAddress),

      idCardNumber: v(employee?.identificationCardId),
      idCardIssueDate: v(employee?.identificationCardIssuedDate),
      idCardIssuePlace: v(employee?.identificationCardIssuedPlace),
    },

    jobInfo: {
      startDate: v(contract.activationDate),
      endDate: v(contract.expiredDate),
      workLocation: v(contract.workingLocation),
      position: v(contract.position),
      jobDescription: v(contract.customAttributes?.[0]?.value),
    },

    salaryInfo: {
      baseSalary: v(contract.basicSalary),
      allowance: v(contract.allowance),
      paymentMethod: v(contract.receiveMethod),
      payday: v(contract.payday),
      salaryReviewCycle: v(contract.salaryReviewPeriod),

      bankAccountNumber: v(employee?.bankAccount),
      bankName: v(employee?.bankName),
    },
  };
};

export const mapValuesToRequestBody = (
  values: FormValues,
  {
    contractFile,
    attachments,
  }: {
    contractFile?: string;
    attachments?: string[];
  },
): NewLaborContract => {
  const employer = values.employer;
  const employee = values.employee;
  const job = values.jobInfo;
  const salary = values.salaryInfo;

  return {
    title: v(values.title),
    type: "LABOR_CONTRACT",
    contractFile: contractFile as string,
    attachments: attachments,

    initiator: {
      type: "STATIC",
      name: v(employer.companyName),
      address: v(employer.companyAddress),
      phone: v(employer.companyPhone),
      representer: v(employer.representativeName),
      representerPosition: v(employer.representativePosition),
      email: "inlacoad@gmail.com",
    },

    partners: [
      {
        type: "LABOR",

        name: v(employee.fullName),
        representer: v(employee.fullName),
        representerPosition: v(job.position),

        address: v(employee.permanentAddress),
        phone: v(employee.phoneNumber),

        birthPlace: v(employee.birthPlace),
        birthDate: datetimeToISO(employee.birthDate) as string,

        nationality: v(employee.nationality),
        temporaryAddress: v(employee.temporaryAddress),

        identificationCardId: v(employee.idCardNumber),
        identificationCardIssuedDate: datetimeToISO(
          employee.idCardIssueDate,
        ) as string,
        identificationCardIssuedPlace: v(employee.idCardIssuePlace),

        bankAccount: v(salary.bankAccountNumber),
        bankName: v(salary.bankName),
      },
    ],

    activationDate: datetimeToISO(job.startDate as Date) as string,
    expiredDate: datetimeToISO(job.endDate as Date) as string,

    position: v(job.position),
    workingLocation: v(job.workLocation),

    basicSalary: v(salary.baseSalary),
    allowance: v(salary.allowance),

    receiveMethod: v(salary.paymentMethod),
    payday: v(salary.payday),
    salaryReviewPeriod: v(salary.salaryReviewCycle),

    customAttributes: [
      {
        key: "jobDescription",
        value: v(job.jobDescription),
      },
    ],
  };
};
