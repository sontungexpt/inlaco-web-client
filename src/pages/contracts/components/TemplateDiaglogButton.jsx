import TemplateDialog from "./TemplateDialog";
import { DialogButton } from "@/components/common";

const TemplateDiaglogButton = ({
  title,
  type,
  initialData,
  render,
  children,
  ...props
}) => {
  return (
    <DialogButton
      {...props}
      dialog={({ open, onClose }) => (
        <TemplateDialog
          open={open}
          onClose={onClose}
          title={title}
          type={type}
          initialData={initialData}
          render={render}
        />
      )}
      children={children}
    />
  );
};

export default TemplateDiaglogButton;
