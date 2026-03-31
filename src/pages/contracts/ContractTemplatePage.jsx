import { useState } from "react";
import { PageTitle } from "@components/common";
import { Box, Button } from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import Color from "@constants/Color";
import toast from "react-hot-toast";

import TemplateContractList from "@/components/contract-templates/TemplateContractList";
import UploadTemplateDialog from "@/components/contract-templates/UploadTemplateDialog";
import TemplateContractCard from "@/components/contract-templates/TemplateContractCard";
import {
  useRemoveContractTemplate,
  useUploadContractTemplate,
} from "@/queries/contract-template.query";

const ContractTemplatePage = ({ PAGE_SIZE = 8 }) => {
  const [openUpload, setOpenUpload] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { mutate: uploadNewTemplate, isPending: isUploading } =
    useUploadContractTemplate({
      onSuccess: () => {
        toast.success("Upload template thành công");
        setOpenUpload(false);
      },
      onError: () => toast.error("Upload template thất bại"),
    });

  const { mutate: removeTemplate } = useRemoveContractTemplate({
    onInit: (id) => setDeletingId(id),
    onSuccess: () => toast.success("Xoá template thành công"),
    onError: () => toast.error("Xoá template thất bại"),
    onSettled: () => setDeletingId(null),
  });

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
          render={(item) => (
            <TemplateContractCard
              key={item.id}
              showDelete
              isDeleting={deletingId === item.id}
              url={item.metadata?.url}
              title={item.name}
              type={item.type}
              dowloadFileName={item.name}
              onDelete={() => removeTemplate(item.id)}
            />
          )}
        />
      </Box>

      {/* ===== Upload Dialog ===== */}
      <UploadTemplateDialog
        open={openUpload}
        isSubmitting={isUploading}
        onClose={() => setOpenUpload(false)}
        accept=".doc,.docx"
        onSubmit={(
          { name, description, file, contractType },
          { resetForm },
        ) => {
          uploadNewTemplate(
            { name, description, file, type: contractType },
            {
              onSuccess: resetForm,
            },
          );
        }}
      />
    </Box>
  );
};

export default ContractTemplatePage;
