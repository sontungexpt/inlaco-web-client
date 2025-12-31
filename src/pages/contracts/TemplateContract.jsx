import React, { useRef, useState } from "react";
import { PageTitle, SearchBar } from "@components/global";
import { Grid, Box, Button, Typography } from "@mui/material";
import { TemplateContractCard } from "@components/contract";
import { mockTemplateContracts } from "@/data/mockData";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import JSZipUtils from "jszip-utils";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import Color from "@constants/Color";

const TemplateContract = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      alert("Chỉ hỗ trợ file .docx");
      return;
    }

    setSelectedFile(file);
    console.log("Uploaded template:", file);

    // TODO: Upload lên backend / cloudinary
  };

  const generateDocument = () => {
    const loadFile = (url, callback) => {
      JSZipUtils.getBinaryContent(url, callback);
    };

    loadFile(
      require("@assets/templates/template-hop-dong-thuyen-vien.docx"),
      (error, content) => {
        if (error) throw error;

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        doc.setData({
          compName: "CONG TY TESTING",
          compAddress: "123 Đường ABC, Quận XYZ, TPHCM",
        });

        try {
          doc.render();

          const out = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          saveAs(out, "Generated_Contract.docx");
        } catch (err) {
          console.error("Error generating document:", err);
        }
      },
    );
  };

  return (
    <Box m="20px">
      {/* Title */}
      <PageTitle
        title="MẪU HỢP ĐỒNG"
        subtitle="Danh sách các template của các loại hợp đồng"
      />

      {/* Search + Upload */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 4,
          gap: 3,
        }}
      >
        <SearchBar
          placeholder="Nhập thông tin template hợp đồng (VD: Tên hợp đồng, Loại hợp đồng)"
          color={Color.PrimaryBlack}
          backgroundColor={Color.SecondaryWhite}
          sx={{ width: "40%" }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            hidden
            onChange={handleFileChange}
          />

          <Button
            variant="contained"
            startIcon={<UploadFileRoundedIcon />}
            sx={{
              backgroundColor: Color.SecondaryBlue,
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                backgroundColor: Color.SecondaryBlue,
                opacity: 0.9,
              },
            }}
            onClick={() => fileInputRef.current.click()}
          >
            Tải lên template
          </Button>

          {selectedFile && (
            <Typography
              sx={{
                fontSize: 14,
                maxWidth: 260,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={selectedFile.name}
            >
              {selectedFile.name}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Template list */}
      <Grid container spacing={4}>
        {mockTemplateContracts.map((item) => (
          <TemplateContractCard
            key={item.id}
            image={item.image}
            title={item.title}
            type={item.type}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default TemplateContract;
// import React from "react";
// import { PageTitle, SearchBar } from "@components/global";
// import { Grid, Box } from "@mui/material";
// import { TemplateContractCard } from "@components/contract";
// import { mockTemplateContracts } from "@/data/mockData";
// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import { saveAs } from "file-saver";
// import JSZipUtils from "jszip-utils";
// import Color from "@constants/Color";

// const TemplateContract = () => {
//   const generateDocument = async () => {
//     // Load the .docx template
//     const loadFile = (url, callback) => {
//       JSZipUtils.getBinaryContent(url, callback);
//     };

//     loadFile(
//       require("@assets/templates/template-hop-dong-thuyen-vien.docx"),
//       (error, content) => {
//         if (error) {
//           throw error;
//         }

//         // Initialize PizZip with the .docx content
//         const zip = new PizZip(content);

//         // Initialize docxtemplater
//         const doc = new Docxtemplater(zip, {
//           paragraphLoop: true,
//           linebreaks: true,
//         });

//         // Set dynamic values for placeholders
//         doc.setData({
//           compName: "CONG TY TESTING",
//           compAddress: "123 Đường ABC, Quận XYZ, TPHCM",
//         });

//         try {
//           // Render the document with dynamic data
//           doc.render();

//           // Generate the final document
//           const out = doc.getZip().generate({
//             type: "blob",
//             mimeType:
//               "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//           });

//           // Save the file locally
//           saveAs(out, "Generated_Contract.docx");
//         } catch (error) {
//           console.error("Error generating document:", error);
//         }
//       },
//     );

//     //If the template is stored on the internet, use the following code
//     // try {
//     //   // Fetch the .docx template from the URL
//     //   const response = await fetch(
//     //     "https://example.com/path/to/template-hop-dong-thuyen-vien.docx"
//     //   );
//     //   if (!response.ok) {
//     //     throw new Error("Failed to fetch the template");
//     //   }
//     //   const content = await response.arrayBuffer();

//     //   // Initialize PizZip with the .docx content
//     //   const zip = new PizZip(content);

//     //   // Initialize docxtemplater
//     //   const doc = new Docxtemplater(zip, {
//     //     paragraphLoop: true,
//     //     linebreaks: true,
//     //   });

//     //   // Set dynamic values for placeholders
//     //   doc.setData({
//     //     compName: "CONG TY TESTING",
//     //     compAddress: "123 Đường ABC, Quận XYZ, TPHCM",
//     //   });

//     //   // Render the document with dynamic data
//     //   doc.render();

//     //   // Generate the final document
//     //   const out = doc.getZip().generate({
//     //     type: "blob",
//     //     mimeType:
//     //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     //   });

//     //   // Save the file locally
//     //   saveAs(out, "Generated_Contract.docx");
//     // } catch (error) {
//     //   console.error("Error generating document:", error);
//     // }
//   };

//   return (
//     <Box m="20px">
//       <Box>
//         <PageTitle
//           title="MẪU HỢP ĐỒNG"
//           subtitle="Danh sách các template của các loại hợp đồng"
//         />
//       </Box>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           width: "100%",
//           paddingBottom: 4,
//           justifyContent: "space-between",
//         }}
//       >
//         <SearchBar
//           placeholder={
//             "Nhập thông tin template hợp đồng (VD: Tên hợp đồng, Loại hợp đồng)"
//           }
//           color={Color.PrimaryBlack}
//           backgroundColor={Color.SecondaryWhite}
//           sx={{
//             width: "40%",
//           }}
//         />
//         {/* <Button
//             variant="contained"
//             sx={{
//               backgroundColor: COLOR.primary_gold,
//               color: COLOR.primary_black,
//               borderRadius: 2,
//             }}
//             onClick={() => generateDocument()}
//           >
//             <AddCircleRoundedIcon />
//             <Typography
//               sx={{
//                 fontWeight: 700,
//                 marginLeft: "4px",
//                 textTransform: "capitalize",
//               }}
//             >
//               Tải lên template
//             </Typography>
//           </Button> */}
//       </Box>
//       <Grid container spacing={4}>
//         {mockTemplateContracts.map((item) => {
//           return (
//             <TemplateContractCard
//               key={item?.id}
//               image={item?.image}
//               title={item?.title}
//               type={item?.type}
//             />
//           );
//         })}
//       </Grid>
//     </Box>
//   );
// };

// export default TemplateContract;
