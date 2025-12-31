import React, { useRef, useState } from "react";
import { PageTitle, SearchBar } from "@components/global";
import { Grid, Box, Button, Typography } from "@mui/material";
import { mockTemplateContracts } from "@/data/mockData";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import Color from "@constants/Color";
import toast from "react-hot-toast";
import TemplateContractList from "./components/TemplateContractList";

const TemplateContract = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      toast.error("Chỉ hỗ trợ file .docx");
      return;
    }

    setSelectedFile(file);
    // TODO: Upload lên backend / cloudinary
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
        <TemplateContractList data={mockTemplateContracts} />
      </Grid>
    </Box>
  );
};

export default TemplateContract;
