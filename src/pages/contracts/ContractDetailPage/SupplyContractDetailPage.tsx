import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { dateToLocaleString } from "@/utils/converter";
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
import Color from "@/constants/Color";
import { useContractDetail } from "./hooks/use-contract-detail";
import { useAllowedRole } from "@/contexts/auth.context";
import { useSignContract } from "./hooks/use-sign-contract";

const SupplyContractDetailPage = () => {
  const navigate = useNavigate();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const {
    data: contract = {} as any,
    isError,
    isLoading,
    refetch: refetchContract,
  } = useContractDetail();

  const { mutate: signContract, isPending: isApproving } = useSignContract();

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
      contractId={contract.id}
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
              onClick={() =>
                navigate(`/supply-contracts/${contract.id}/edit`, {})
              }
            >
              {contract.freezed ? "Thêm phụ lục" : "Sửa hợp đồng"}
            </Button>

            {!contract.signed && (
              <ConfirmButton
                variant="contained"
                loading={isApproving}
                onConfirm={() => signContract(contract.id)}
                confirmTitle="XÁC NHẬN KÝ KẾT"
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
            Từ {dateToLocaleString(contract.activationDate, "date")} đến{" "}
            {dateToLocaleString(contract.expiredDate, "date")}
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

          {contract.version > 1 && (
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
                  navigate(`/contracts/${contract.id}/old-versions`)
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

export default SupplyContractDetailPage;
