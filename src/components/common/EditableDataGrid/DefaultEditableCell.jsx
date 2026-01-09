import React from "react";
import ErrorWrapper from "./ErrorWrapper";
import { InfoTextField, SearchBar } from "@/components/global";
import { TextField } from "@mui/material";

const DefaultEditableCell = ({ id, field, value, error, api }) => (
  <ErrorWrapper error={error}>
    <TextField
      fullWidth
      size="small"
      value={value ?? ""}
      error={!!error}
      onChange={(e) =>
        api.setEditCellValue({ id, field, value: e.target.value })
      }
    />
  </ErrorWrapper>
);

export default DefaultEditableCell;
