import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export const downloadFile = async ({ url, initialData, dowloadFileName }) => {
  // 1 Fetch file docx
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Fetch template failed");
  }

  const content = await res.arrayBuffer();

  // 2 Load zip
  const zip = new PizZip(content);

  // 3 Init docxtemplater
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    parser(tag) {
      const splitted = tag.split(".");
      return {
        get(scope) {
          if (tag === ".") {
            return scope;
          }
          let s = scope;
          for (let i = 0, len = splitted.length; i < len; i++) {
            const key = splitted[i];
            s = s[key];
          }
          return s;
        },
      };
    },
  });

  // 4 Prepare data
  const data = typeof initialData === "function" ? initialData() : initialData;

  // 5 Render (API mới)
  doc.render(data);

  // 6 Generate file
  const out = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  // 7 Save
  saveAs(out, dowloadFileName);
};
