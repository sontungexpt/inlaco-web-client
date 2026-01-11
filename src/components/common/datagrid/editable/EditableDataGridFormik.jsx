import React from "react";
import EditableDataGridCore from "./EditableDataGridCore";
import { useFormikEditableGridAdapter } from "@/hooks/useEditableGridAdapter";

const EditableDataGridFormik = ({ name, ...props }) => {
  const adapter = useFormikEditableGridAdapter(name);

  return <EditableDataGridCore adapter={adapter} {...props} />;
};

export default EditableDataGridFormik;
