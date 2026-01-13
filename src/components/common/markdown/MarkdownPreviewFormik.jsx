import React from "react";
import { MarkdownPreview } from ".";
import { useField } from "formik";

export default function MarkdownPreviewFormik({ required, name, ...props }) {
  const [field, meta] = useField(name);

  return <MarkdownPreview {...props} required={required} value={field.value} />;
}
