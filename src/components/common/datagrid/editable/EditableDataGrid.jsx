import { useEditableGridAdapter } from "@/hooks/useEditableGridAdapter";
import EditableDataGridCore from "./EditableDataGridCore";

const EditableDataGrid = ({ initialRows, validationSchema, ...props }) => {
  const adapter = useEditableGridAdapter(initialRows, validationSchema);
  return <EditableDataGridCore adapter={adapter} {...props} />;
};

export default EditableDataGrid;
