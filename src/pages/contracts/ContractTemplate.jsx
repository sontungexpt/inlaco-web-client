import React, { useRef, useState } from "react";
import { PageTitle, SearchBar } from "@components/global";
import { Box, Button } from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import Color from "@constants/Color";
import toast from "react-hot-toast";

import TemplateContractList from "./components/TemplateContractList";
import UploadTemplateDialog from "./components/UploadTemplateDialog";
import TemplateContractCard from "./components/TemplateContractCard";
import cloudinaryUpload from "@/services/cloudinaryServices";
import UploadStrategy from "@/constants/UploadStrategy";
import {
  removeTemplate,
  uploadTemplate,
} from "@/services/contractTemplateServices";

const ContractTemplate = () => {
  const PAGE_SIZE = 8;
  const [openUpload, setOpenUpload] = useState(false);
  const templateListRef = useRef(null);
  const [deletingId, setDeletingId] = useState(null);

  const uploadNewTemplate = async (
    { name, description, file, contractType },
    { resetForm },
  ) => {
    try {
      const cldResponse = await cloudinaryUpload(
        file,
        UploadStrategy.CONTRACT_TEMPLATE,
        { name },
      );

      await uploadTemplate(
        {
          name,
          description,
          type: contractType,
        },
        cldResponse.public_id,
      );

      toast.success("Upload template thành công");
      templateListRef.current?.refetch();
      resetForm();
      setOpenUpload(false);
    } catch {
      toast.error("Upload template thất bại");
    }
  };

  const removeContractTemplate = async (id) => {
    setDeletingId(id);
    try {
      await removeTemplate(id);
      templateListRef.current?.refetch();
      toast.success("Xoá template thành công");
    } catch {
      toast.error("Xoá template thất bại");
    }
    setDeletingId(null);
  };

  return (
    <Box px={3} py={2}>
      {/* ===== Sticky Header ===== */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#F5F9FC",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <PageTitle
            title="MẪU HỢP ĐỒNG"
            subtitle="Danh sách các template của các loại hợp đồng"
          />

          <Button
            variant="contained"
            startIcon={<UploadFileRoundedIcon />}
            onClick={() => setOpenUpload(true)}
            sx={{
              height: 42,
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: Color.SecondaryBlue,
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: Color.SecondaryBlue,
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              },
            }}
          >
            Tải lên template
          </Button>
        </Box>
      </Box>

      {/* ===== Template List ===== */}
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <TemplateContractList
          pageSize={PAGE_SIZE}
          ref={templateListRef}
          render={(item) => (
            <TemplateContractCard
              key={item.id}
              showDelete
              isDeleting={deletingId === item.id}
              url={item.metadata?.url}
              title={item.name}
              type={item.type}
              dowloadFileName={item.name}
              onDelete={() => removeContractTemplate(item.id)}
            />
          )}
        />
      </Box>

      {/* ===== Upload Dialog ===== */}
      <UploadTemplateDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        accept=".doc,.docx"
        onSubmit={uploadNewTemplate}
      />
    </Box>
  );
};

export default ContractTemplate;
