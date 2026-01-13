import React from "react";
import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { useContract } from "@/hooks/services/contract";
import { activeContract } from "@/services/contractServices";
import { isoToLocaleString } from "@/utils/converter";
import useAllowedRole from "@/hooks/useAllowedRole";
import UserRole from "@/constants/UserRole";

import ContractDetailLayout from "./ContractDetailLayout";
import PartySection from "./sections/PartySection";
import ShipInfoSection from "./sections/ShipInfoSection";
import FilesSection from "./sections/FilesSection";
import {
  ConfirmButton,
  LoadErrorState,
  SectionWrapper,
} from "@/components/common";

const SupplyContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const {
    data: contract = {},
    isError,
    isLoading,
    refetch: refetchContract,
  } = useContract(id);

  const approve = async () => {
    try {
      await activeContract(id);
      toast.success("Ký kết thành công");
      refetchContract();
    } catch {
      toast.error("Ký kết thất bại");
    }
  };

  if (isError) {
    return (
      <LoadErrorState
        title="Không thể tải hợp đồng"
        subtitle="Hợp đồng không tồn tại hoặc đã bị xóa"
        onRetry={() => refetchContract()}
      />
    );
  }

  return (
    <ContractDetailLayout
      title="Chi tiết hợp đồng cung ứng thuyền viên"
      contractId={id}
      signed={contract.signed}
      loading={isLoading}
      footer={
        isAdmin && (
          <SectionWrapper
            sx={{ display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate(`/supply-contracts/${id}/edit`, {})}
            >
              {contract.freezed ? "Thêm phụ lục" : "Sửa hợp đồng"}
            </Button>

            {!contract.signed && (
              <ConfirmButton
                variant="contained"
                onConfirm={approve}
                confirmTitle="XÁC NHẬN KÝ KẾT"
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
          <Typography align="center" fontWeight={700} fontSize={22}>
            HỢP ĐỒNG CUNG ỨNG THUYỀN VIÊN
          </Typography>

          <Typography align="center" fontWeight={700} fontSize={18}>
            {contract.title}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <PartySection title="BÊN A" party={contract.initiator} />
          <PartySection title="BÊN B" party={contract.partners?.[0]} />

          <Typography fontWeight={700}>ĐIỀU 1. NỘI DUNG</Typography>
          <Typography>
            Cung ứng <b>{contract.numOfCrews}</b> thuyền viên theo yêu cầu.
          </Typography>

          <Typography fontWeight={700} mt={2}>
            ĐIỀU 2. THỜI HẠN
          </Typography>
          <Typography>
            Từ {isoToLocaleString(contract.activationDate, "date")} đến{" "}
            {isoToLocaleString(contract.expiredDate, "date")}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <ShipInfoSection shipInfo={contract.shipInfo} />

          <FilesSection
            title="Hợp đồng giấy"
            files={contract.contractFile ? [contract.contractFile] : []}
          />

          <Divider sx={{ my: 3 }} />

          <FilesSection
            title="Phụ lục & tài liệu"
            files={contract.attachments || []}
          />
        </Paper>
      </Box>
    </ContractDetailLayout>
  );
};

export default SupplyContractDetail;
