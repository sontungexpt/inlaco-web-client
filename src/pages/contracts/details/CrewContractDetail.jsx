import React from "react";
import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";

import { useApplicationContract, useContract } from "@/hooks/services/contract";
import { activeContract } from "@/services/contractServices";
import { dateToLocaleString } from "@/utils/converter";
import useAllowedRole from "@/hooks/useAllowedRole";
import UserRole from "@/constants/UserRole";

import ContractDetailLayout from "./ContractDetailLayout";
import PartySection from "./sections/PartySection";
import FilesSection from "./sections/FilesSection";
import {
  ConfirmButton,
  LoadErrorState,
  SectionWrapper,
} from "@/components/common";

/* ================= DETAIL ================= */
const CrewContractDetail = () => {
  const { id } = useParams();
  const { usedApplicationId } = useLocation().state || {};
  const navigate = useNavigate();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const isApplicationContract = Boolean(usedApplicationId);

  const contractQuery = useContract(id, {
    enabled: !isApplicationContract && !!id,
  });

  const applicationContractQuery = useApplicationContract(id, {
    enabled: isApplicationContract && !!id,
  });

  const {
    data: contract = {},
    isError,
    error,
    isLoading,
    refetch,
  } = isApplicationContract ? applicationContractQuery : contractQuery;

  if (isError && error?.response?.status === 404) {
    return (
      <LoadErrorState
        title="Không thể tải hợp đồng"
        subtitle="Hợp đồng không tồn tại hoặc đã bị xoa"
        onRetry={() => refetch()}
      />
    );
  }

  const approve = async () => {
    try {
      await activeContract(id);
      toast.success("Ký kết hợp đồng thành công");
      refetch();
    } catch {
      toast.error("Ký kết thất bại");
    }
  };

  return (
    <ContractDetailLayout
      title="Chi tiết hợp đồng thuyền viên"
      contractId={id}
      signed={contract.signed}
      loading={isLoading}
      footer={
        isAdmin && (
          <SectionWrapper
            sx={{ display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Button
              color="warning"
              variant="contained"
              onClick={() =>
                navigate("/crew-contracts/form", {
                  state: {
                    contractId: contract.id,
                    type: "update",
                  },
                })
              }
            >
              {contract.freezed ? "Thêm phụ lục" : "Sửa hợp đồng"}
            </Button>

            {!contract.signed && (
              <ConfirmButton
                variant="contained"
                onConfirm={approve}
                confirmTitle="XÁC NHẬN KÝ KẾT HỢP ĐỒNG"
                confirmContent="Hợp đồng sẽ không thể chỉnh sửa sau khi ký"
              >
                XÁC NHẬN KÝ KẾT
              </ConfirmButton>
            )}
          </SectionWrapper>
        )
      }
    >
      <Box display="flex" justifyContent="center">
        <Paper
          sx={{
            width: "210mm",
            minHeight: "297mm",
            p: 6,
            fontFamily: `"Times New Roman", serif`,
          }}
        >
          {/* ===== TITLE ===== */}
          <Typography align="center" fontWeight={700} fontSize={22}>
            HỢP ĐỒNG LAO ĐỘNG THUYỀN VIÊN
          </Typography>

          <Typography align="center" fontWeight={700} fontSize={18}>
            {contract.title}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* ===== PARTIES ===== */}
          <PartySection title="BÊN A" party={contract.initiator} />
          <PartySection title="BÊN B" party={contract.partners?.[0]} />

          <Divider sx={{ my: 3 }} />

          {/* ===== JOB INFO ===== */}
          <Typography fontWeight={700}>ĐIỀU 1. CÔNG VIỆC</Typography>
          <Typography>{contract.jobInfo?.jobDescription}</Typography>

          <Typography fontWeight={700} mt={2}>
            ĐIỀU 2. THỜI HẠN
          </Typography>
          <Typography>
            Từ{" "}
            {contract.activationDate &&
              dateToLocaleString(contract.activationDate, "date")}{" "}
            đến{" "}
            {contract.expiredDate &&
              dateToLocaleString(contract.expiredDate, "date")}
          </Typography>

          <Typography fontWeight={700} mt={2}>
            ĐIỀU 3. TIỀN LƯƠNG
          </Typography>
          <Typography>Lương cơ bản: {contract.basicSalary} VNĐ</Typography>
          <Typography>Phụ cấp: {contract.allowance}</Typography>
          <Typography>Hình thức: {contract.receiveMethod}</Typography>

          <Divider sx={{ my: 3 }} />

          {/* ===== FILES ===== */}
          <FilesSection
            title="Hợp đồng giấy chi tiết"
            files={contract.contractFile ? [contract.contractFile] : []}
          />

          <Divider sx={{ my: 3 }} />

          <FilesSection
            title="Phụ lục & tài liệu đính kèm"
            files={contract.attachments || []}
          />
        </Paper>
      </Box>
    </ContractDetailLayout>
  );
};

export default CrewContractDetail;
