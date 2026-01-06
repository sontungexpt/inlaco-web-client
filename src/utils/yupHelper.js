import * as Yup from "yup";

/** ===== BASIC ===== */
export const requiredString = (msg = "Không được để trống") =>
  Yup.string().required(msg);

export const optionalString = () => Yup.string();

export const requiredNumber = (min, msg) => {
  let schema = Yup.number().required("Không được để trống");
  if (min !== undefined) {
    schema = schema.min(min, msg ?? `Giá trị tối thiểu là ${min}`);
  }
  return schema;
};

export const requiredDate = (msg = "Không được để trống") =>
  Yup.date().required(msg);

export const requiredFile = (msg = "Vui lòng tải lên file") =>
  Yup.mixed().required(msg);
