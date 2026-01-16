import { useField, useFormikContext } from "formik";

import { useMemo, useState, useCallback } from "react";

export const useEditableGridAdapter = (initialRows = [], validationSchema) => {
  const [rows, setRows] = useState(initialRows);
  const [rowErrors, setRowErrors] = useState({});

  const validateRows = useCallback(
    async (rows) => {
      if (!validationSchema) return true;

      const errors = {};

      for (const row of rows) {
        if (row.isNew) continue; // key point

        try {
          await validationSchema.validate(row, {
            abortEarly: false,
          });
        } catch (e) {
          e.inner.forEach((err) => {
            if (!errors[row.id]) errors[row.id] = {};
            errors[row.id][err.path] = err.message;
          });
        }
      }

      setRowErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [validationSchema],
  );

  return { rows, setRows, rowErrors, setRowErrors, validateRows };
};

export const useFormikEditableGridAdapter = (name) => {
  const { setFieldValue, validateForm, setErrors, setFieldTouched } =
    useFormikContext();
  const [field, meta] = useField(name);
  const rows = field.value;

  const rowErrors = useMemo(() => {
    if (!Array.isArray(meta.error)) return {};
    const map = {};
    rows.forEach((row, i) => {
      if (meta.error[i]) map[row.id] = meta.error[i];
    });
    return map;
  }, [meta.error, rows]);

  const validateRows = useCallback(async () => {
    setFieldTouched(name, true, false);
    const errors = await validateForm();
    return !errors?.[name];
  }, [name, setFieldTouched, validateForm]);

  // format like setFunction in React
  const setRows = useCallback(
    (value) => {
      const newRows = typeof value === "function" ? value(rows) : value;
      setFieldValue(name, newRows, false);
    },
    [name, rows, setFieldValue],
  );

  // format like setFunction in React
  const setRowErrors = useCallback(
    (value) => {
      const newValue = typeof value === "function" ? value(rowErrors) : value;
      setErrors((prev) => ({
        ...prev,
        [name]: rows.map((row) => {
          return newValue[row.id] || undefined;
        }),
      }));
    },
    [name, rowErrors, rows, setErrors],
  );

  return {
    rows,
    setRows,
    rowErrors,
    setRowErrors,
    validateRows,
  };
};
