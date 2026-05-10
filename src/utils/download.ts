import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export const downloadBlobFile = async (blob: Blob, fileName: string) => {
  // try use file-saver if available
  try {
    const mod = await import("file-saver");
    mod.saveAs(blob, fileName);
    return;
  } catch (e) {
    // fallback
  }

  // fallback native browser
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

const getValueByPath = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  if (path === ".") return obj;

  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const nestedDataParser = (tag: string) => ({
  get(scope: any) {
    return getValueByPath(scope, tag);
  },
});

export const downloadDocxFromTemplate = async <T>({
  url,
  data,
  fileName = `${Date.now()}.docx`,
  allowedNestedData = true,
}: {
  url: string;
  data: T | (() => T);
  fileName: string;
  allowedNestedData?: boolean;
}) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch template failed");

  const content = await res.arrayBuffer();
  const zip = new PizZip(content);
  const parser = allowedNestedData ? nestedDataParser : undefined;

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    parser: parser,
  });

  const finalData = typeof data === "function" ? (data as () => T)() : data;

  doc.render(finalData);

  const blob = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  downloadBlobFile(blob, fileName);
};

