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

// export const downloadBlobFile = (blob: Blob, fileName: string) => {
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = fileName;

//   document.body.appendChild(a);
//   a.click();
//   a.remove();

//   URL.revokeObjectURL(url);
// };

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

// type DownloadFileParams<T = Record<string, any>> = {
//   url: string;
//   initialData: T | (() => T);
//   dowloadFileName: string;
// };

// export const downloadFile = async <T = Record<string, any>>({
//   url,
//   initialData,
//   dowloadFileName,
// }: DownloadFileParams<T>): Promise<void> => {
//   // 1. Fetch file docx
//   const res = await fetch(url);
//   if (!res.ok) {
//     throw new Error("Fetch template failed");
//   }

//   const content = await res.arrayBuffer();

//   // 2. Load zip
//   const zip = new PizZip(content);

//   // 3. Init docxtemplater
//   const doc = new Docxtemplater(zip, {
//     paragraphLoop: true,
//     linebreaks: true,
//     parser(tag: string) {
//       const splitted = tag.split(".");
//       return {
//         get(scope: any) {
//           if (tag === ".") return scope;

//           let s = scope;
//           for (let i = 0; i < splitted.length; i++) {
//             const key = splitted[i];
//             s = s?.[key];
//           }
//           return s;
//         },
//       };
//     },
//   });

//   // 4. Prepare data
//   const data: T =
//     typeof initialData === "function"
//       ? (initialData as () => T)()
//       : initialData;

//   // 5. Render
//   doc.render(data);

//   // 6. Generate file
//   const out: Blob = doc.getZip().generate({
//     type: "blob",
//     mimeType:
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   });

//   // 7. Save
//   saveAs(out, dowloadFileName);
// };

// const handleDownloadExcel = (values) => {
//   // Define the headers in Vietnamese
//   const columnHeaders = [
//     { header: "Mã thuyền viên", key: "cardId" },
//     { header: "Họ và tên", key: "fullName" },
//     { header: "Ngày sinh", key: "birthDate" },
//     { header: "Số điện thoại", key: "phoneNumber" },
//     { header: "Chức vụ", key: "professionalPosition" },
//   ];

//   // Map the data to include only the keys defined in headers
//   const crewMembers = values.mobilizedCrewMembers.map((member) => ({
//     cardId: member.cardId,
//     fullName: member.fullName,
//     birthDate: formatDate(member.birthDate),
//     phoneNumber: member.phoneNumber,
//     professionalPosition: member.professionalPosition,
//   }));

//   // Create an array with the headers and data
//   const data = [
//     columnHeaders.map((columnHeader) => columnHeader.header), // Add headers as the first row
//     ...crewMembers.map((member) =>
//       columnHeaders.map((columnHeader) => member[columnHeader.key]),
//     ), // Add data rows
//   ];

//   // Convert the array to a worksheet
//   const worksheet = XLSX.utils.aoa_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách thuyền viên");

//   // Write the workbook to a file
//   XLSX.writeFile(workbook, "danh-sach-thuyen-vien-duoc-dieu-dong.xlsx");
//   console.log("Download excel file successfully");
// };
