import { FileRequest } from "@/services/cloudinary.service";

export interface ApplyRecruitmentRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  cvFile: FileRequest;

  address?: string;
  languageSkills?: string;
  experiences?: string;
}
