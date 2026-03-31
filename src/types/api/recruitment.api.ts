export interface ApplyRecruitmentRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  cvFile: string;
  address?: string;
  languageSkills?: string;
  experiences?: string;
}
