import { FileRequest } from "@/services/cloudinary.service";
import Regex from "@/utils/validation/Regex";
import * as Yup from "yup";

export const string = () =>
  Yup.string().transform((v) => (v === "" ? undefined : v));

export const requiredString = (msg = "Không được để trống") =>
  string().required(msg);

export const optionalString = () => string().notRequired();

export const requiredVnPhoneNumber = (
  msg = "Vui lòng nhập số điện thoại",
  invalidMsg = "Số điện thoại không hợp lệ",
) => string().matches(Regex.VN_PHONE, invalidMsg).required(msg);

export const requiredEmail = (
  msg = "Vui lòng nhập email",
  invalidMsg = "Email không hợp lệ",
) => string().email(invalidMsg).required(msg);

export const number = () =>
  Yup.number()
    .transform((v, raw) => (raw === "" ? undefined : v))
    .typeError("Phải là số");

export const optionalNumber = ({
  min,
  minMsg,
}: {
  min?: number;
  minMsg?: string;
} = {}) => {
  let schema = number().notRequired();
  if (min !== undefined) {
    schema = schema.min(min, minMsg || `Giá trị phải >= ${min}`);
  }
  return schema;
};

export const requiredNumber = ({
  requiredMsg = "Không được để trống",
  min,
  minMsg,
}: {
  requiredMsg?: string;
  min?: number;
  minMsg?: string;
} = {}) => {
  let schema = number().required(requiredMsg);

  if (min !== undefined) {
    schema = schema.min(min, minMsg || `Giá trị phải >= ${min}`);
  }

  return schema;
};

const isValidFile = (value: unknown) => {
  if (!value) return false;
  if (value instanceof File) return true;
  if (typeof value === "object" && (value as any)?.file) return true;
  return false;
};

export const optionalFiles = (msg = "File không hợp lệ") =>
  Yup.array()
    .of(
      Yup.mixed<null | any>().test(
        "file",
        msg,
        (value) => !value || isValidFile(value),
      ),
    )
    .notRequired();

export const requiredFile = (msg = "Vui lòng tải lên file") =>
  Yup.mixed<null | any>()
    .required(msg)
    .test("file", "File không hợp lệ", isValidFile);

export const optionalFile = () =>
  Yup.mixed<null | any>()
    .test("file", "File không hợp lệ", (value) => {
      return !value || isValidFile(value);
    })
    .notRequired();

/* ========= DATE HELPERS ========= */

export const date = () =>
  Yup.date().transform((v, raw) => (raw === "" ? undefined : v));

/**
 * Date must be BEFORE another field
 */
export const dateBefore = (
  refField: string,
  msg = "Ngày phải trước ngày kết thúc",
) => date().max(Yup.ref(refField), msg);

/**
 * Date must be AFTER another field
 */
export const dateAfter = (
  refField: string,
  msg = "Ngày phải sau ngày bắt đầu",
) => date().min(Yup.ref(refField), msg);

export const requiredDate = (msg = "Không được để trống") =>
  date().required(msg);

export const dateMin = (min: Date, msg: string) => date().min(min, msg);

export const dateMax = (max: Date, msg: string) => date().max(max, msg);

/** ================= CONDITIONAL ================= */
export const requiredIf = <T = any>(
  dep: string,
  condition: (val: T) => boolean,
  schema: Yup.AnySchema,
) =>
  schema.when(dep, {
    is: condition,
    then: (s) => s.required(),
    otherwise: (s) => s.notRequired(),
  });
