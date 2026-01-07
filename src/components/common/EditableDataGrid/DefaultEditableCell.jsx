import React from "react";
import ErrorWrapper from "./ErrorWrapper";
import { InfoTextField } from "@/components/global";

const DefaultEditableCell = ({ id, field, value, error, api }) => (
  <ErrorWrapper error={error}>
    <InfoTextField
      fullWidth
      size="small"
      value={value ?? ""}
      error={!!error}
      onChange={(e) =>
        api.setEditCellValue({ id, field, value: e.target.value })
      }
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: error ? "#FFF5F5" : "inherit",
        },
      }}
    />
  </ErrorWrapper>
);

export default DefaultEditableCell;
