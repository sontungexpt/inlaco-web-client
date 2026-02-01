import Regex from "@/constants/Regex";
import * as Yup from "yup";

/** ===== BASIC ===== */
export const requiredString = (msg = "Không được để trống") =>
  Yup.string().required(msg);

export const optionalString = () => Yup.string();
export const optionalNumber = (min = 0, minMsg = "Giá trị không hợp lệ") =>
  Yup.number().min(min, minMsg);

export const requiredNumber = (
  msg = "Không được để trống",
  min = 1,
  minMsg = `Giá trị phải >= ${min}`,
) => {
  const schema = Yup.number().required(msg);
  if (min) schema.min(min, minMsg);
  return schema;
};
export const requiredVnPhoneNumber = (
  msg = "Vui lòng nhập số điện thoải",
  invalidMsg = "Số điện thoại không hợp lệ",
) => Yup.string().matches(Regex.VN_PHONE, invalidMsg).required(msg);

export const requiredEmail = (
  msg = "Vui lòng nhập email",
  invalidMsg = "Email không hợp lệ",
) => Yup.string().email(invalidMsg).required(msg);

export const requiredFile = (msg = "Vui lòng tải lên file") =>
  Yup.mixed()
    .required(msg)
    .test("file-or-object", "Giá trị không hợp lệ", (value) => {
      if (!value) return false;
      if (value instanceof File) return true;
      if (typeof value === "object") {
        if (value.file) {
          return true;
        }
      }
      return false;
    });

/* ========= DATE HELPERS ========= */
export const dateMax = (maxDate, msg) =>
  Yup.date().max(maxDate, msg).required();

export const dateMin = (minDate, msg) =>
  Yup.date().min(minDate, msg).required();

export const requiredDate = (msg = "Không được để trống") =>
  Yup.date().required(msg);

/**
 * Date must be BEFORE another date field
 */
export const dateBefore = (refField, msg = "Ngày phải trước ngày kết thúc") =>
  Yup.date().max(Yup.ref(refField), msg);

/**
 * Date must be AFTER another date field
 */
export const dateAfter = (refField, msg = "Ngày phải sau ngày bắt đầu") =>
  Yup.date().min(Yup.ref(refField), msg);
