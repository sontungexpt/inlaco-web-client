import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router";

import Color from "@/constants/Color";
import UserRole from "@/constants/UserRole";

import { dateToLocaleString } from "@/utils/converter";

import ContractDetailLayout from "./ContractDetailLayout";
import PartySection from "./sections/PartySection";
import FilesSection from "./sections/FilesSection";
import { useCrewContractDetail } from "./hooks/use-contract-detail";
import {
  ConfirmButton,
  LoadErrorState,
  SectionWrapper,
} from "@/components/common";
import { useAllowedRole } from "@/contexts/auth.context";
import { AxiosError } from "axios";
import { useSignContract } from "./hooks/use-sign-contract";

const CrewContractDetailPage = () => {
  const navigate = useNavigate();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const {
    data: contract = {},
    isError,
    error,
    isLoading,
    refetch,
  } = useCrewContractDetail();

  const { mutate: signContract, isPending: isApproving } = useSignContract();

  if (
    isError &&
    error instanceof AxiosError &&
    error?.response?.status === 404
  ) {
    return (
      <LoadErrorState
        title="Không thể tải hợp đồng"
        subtitle="Hợp đồng không tồn tại hoặc đã bị xoa"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <ContractDetailLayout
      title="Chi tiết hợp đồng thuyền viên"
      contractId={contract.id}
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
                navigate(
                  `/crew-contracts/form?type=update&contractId=${contract.id}`,
                )
              }
            >
              {contract.freezed ? "Thêm phụ lục" : "Sửa hợp đồng"}
            </Button>

            {!contract.signed && (
              <ConfirmButton
                variant="contained"
                loading={isApproving}
                onConfirm={() => signContract(contract.id)}
                confirmTitle="XÁC NHẬN KÝ KẾT HỢP ĐỒNG"
                confirmDescription="Hợp đồng sẽ không thể chỉnh sửa sau khi ký"
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
            title="Tài liệu đính kèm"
            files={contract.attachments || []}
          />

          {(contract?.version?.num || 0) > 1 && (
            <Box
              sx={{
                mt: 4,
                backgroundColor: Color.PrimaryBlue,
                textAlign: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color={Color.PrimaryBlue}
                sx={{ mb: 1 }}
              >
                Hợp đồng này có nhiều phiên bản
              </Typography>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: Color.PrimaryBlue,
                  color: Color.PrimaryWhite,
                  ":hover": {
                    backgroundColor: Color.PrimaryHoverBlue,
                  },
                }}
                onClick={() =>
                  navigate(`/crew-contracts/${contract.id}/old-versions`)
                }
              >
                Xem các phiên bản cũ
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </ContractDetailLayout>
  );
};

export default CrewContractDetailPage;
