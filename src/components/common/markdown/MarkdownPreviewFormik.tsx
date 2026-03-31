import { MarkdownPreview } from ".";
import { useField } from "formik";
import { MarkdownPreviewProps } from "./MarkdownPreview";

export type MarkdownPreviewFormikProps = MarkdownPreviewProps & {
  name: string;
  required?: boolean;
};

export default function MarkdownPreviewFormik({
  required,
  name,
  ...props
}: MarkdownPreviewFormikProps) {
  const [field, meta] = useField(name);

  return <MarkdownPreview {...props} required={required} value={field.value} />;
}
