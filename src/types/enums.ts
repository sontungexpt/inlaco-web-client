// Centralized runtime-safe enums with derived TypeScript types

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const PartyType = { STATIC: "STATIC", LABOR: "LABOR" } as const;
export type PartyType = (typeof PartyType)[keyof typeof PartyType];

export const ContractStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  SIGNED: "SIGNED",
} as const;
export type ContractStatus =
  (typeof ContractStatus)[keyof typeof ContractStatus];

export const ContractType = {
  LABOR_CONTRACT: "LABOR_CONTRACT",
  SUPPLY_CONTRACT: "SUPPLY_CONTRACT",
} as const;
export type ContractType = (typeof ContractType)[keyof typeof ContractType];

export const PostType = {
  NEWS: "NEWS",
  RECRUITMENT: "RECRUITMENT",
  COURSE: "COURSE",
} as const;
export type PostType = (typeof PostType)[keyof typeof PostType];
