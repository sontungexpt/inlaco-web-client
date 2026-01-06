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
