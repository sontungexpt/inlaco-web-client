import React from "react";
import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { useContract } from "@/hooks/services/contract";
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
  const navigate = useNavigate();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const {
    data: contract = {},
    isError,
    error,
    isLoading,
    refetch,
  } = useContract(id);

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
                  state: { contractId: id, type: "update" },
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
// import React, {} from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   Stack,
//   CircularProgress,
//   Divider,
//   Chip,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router";
// import { useContract } from "@/hooks/services/contract";
// import { activeContract } from "@/services/contractServices";
// import toast from "react-hot-toast";
// import { isoToLocaleString } from "@/utils/converter";
// import useAllowedRole from "@/hooks/useAllowedRole";
// import UserRole from "@/constants/UserRole";
// import {
//   ConfirmButton,
//   FilePreviewCard,
//   SectionWrapper,
// } from "@/components/common";

// /* ================= MAIN ================= */
// const CrewContractDetail = () => {
//   const navigate = useNavigate();
//   const isAdmin = useAllowedRole(UserRole.ADMIN) || false;
//   const { id } = useParams();
//   const {
//     data: contractInfo = {},
//     isLoading,
//     refetch: refetchContractInfo,
//   } = useContract(id);

//   const partyA = contractInfo?.initiator;
//   const partyB = contractInfo?.partners?.[0];
//   const attachments = contractInfo?.attachments;
//   const signed = contractInfo?.signed;

//   const approveContract = async () => {
//     try {
//       await activeContract(id);
//       toast.success("Ký kết hợp đồng thành công");
//       refetchContractInfo();
//     } catch {
//       toast.error("Ký kết thất bại");
//     }
//   };

//   const handleUpdate = async () => {
//     navigate(`/crew-contracts/form`, {
//       state: {
//         contractId: contractInfo.id,
//         type: "update",
//       },
//     });
//   };

//   if (isLoading) {
//     return (
//       <Box
//         height="100vh"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {/* ===== STICKY HEADER ===== */}
//       <Box position="sticky" top={0} zIndex={10}>
//         <SectionWrapper
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Box>
//             <Typography fontWeight={700} fontSize={18}>
//               Chi tiết hợp đồng thuyền viên
//             </Typography>
//             <Typography fontSize={13} color="text.secondary">
//               Mã hợp đồng: {id}
//             </Typography>
//           </Box>

//           <Chip
//             label={signed ? "Đã kí" : "Chưa kí kết"}
//             color={signed ? "success" : "warning"}
//           />
//         </SectionWrapper>
//       </Box>

//       {/* ===== CONTRACT BODY ===== */}
//       <Box display="flex" justifyContent="center">
//         <Paper
//           sx={{
//             width: "210mm",
//             minHeight: "297mm",
//             p: 6,
//             borderRadius: 2,
//             boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
//             fontFamily: `"Times New Roman", serif`,
//           }}
//         >
//           <Typography
//             align="center"
//             fontWeight={700}
//             fontSize={22}
//             gutterBottom
//           >
//             HỢP ĐỒNG LAO ĐỘNG THUYỀN VIÊN
//           </Typography>
//           <Typography
//             align="center"
//             fontWeight={700}
//             fontSize={18}
//             gutterBottom
//           >
//             {contractInfo?.title}
//           </Typography>

//           <Divider sx={{ my: 3 }} />

//           {/* ===== PARTIES ===== */}
//           <Typography fontWeight={700}>BÊN A</Typography>
//           <Typography>
//             Tên đơn vị: <b>{partyA?.partyName}</b>
//           </Typography>
//           <Typography>Địa chỉ: {partyA?.address}</Typography>
//           <Typography>
//             Đại diện: {partyA?.representer} – {partyA?.representerPosition}
//           </Typography>
//           <Typography>Email: {partyA?.email}</Typography>
//           <Typography>Điện thoại: {partyA?.phone}</Typography>

//           <Divider sx={{ my: 2 }} />

//           <Typography fontWeight={700}>BÊN B</Typography>
//           <Typography>Họ và tên: {partyB?.partyName}</Typography>
//           <Typography>Email: {partyB?.email}</Typography>
//           <Typography>Điện thoại: {partyB?.phone}</Typography>
//           <Typography>
//             Ngày sinh:{" "}
//             {partyB?.birthDate && isoToLocaleString(partyB?.birthDate, "date")}
//           </Typography>
//           <Typography>Quốc tịch: {partyB?.nationality}</Typography>
//           <Typography>
//             Số căn cuớc công dân: {partyB?.identificationCardId}
//           </Typography>
//           <Typography>
//             Ngày cấp căn cuớc công dân:{" "}
//             {partyB?.identificationCardIssuedDate &&
//               isoToLocaleString(partyB?.identificationCardIssuedDate)}
//           </Typography>
//           <Typography>
//             Nơi cấp căn cuớc công dân: {partyB?.identificationCardIssuedPlace}
//           </Typography>

//           <Divider sx={{ my: 3 }} />

//           {/* ===== TERMS ===== */}
//           <Typography fontWeight={700}>ĐIỀU 1. CÔNG VIỆC</Typography>
//           <Typography>{contractInfo?.jobInfo?.jobDescription}</Typography>

//           <Typography fontWeight={700}>ĐIỀU 2. THỜI HẠN</Typography>
//           <Typography>
//             Từ ngày{" "}
//             {contractInfo?.activationDate &&
//               isoToLocaleString(contractInfo?.activationDate, "date")}
//             đến ngày{" "}
//             {contractInfo?.expiredDate &&
//               isoToLocaleString(contractInfo?.expiredDate, "date")}
//           </Typography>

//           <Typography fontWeight={700}>ĐIỀU 3. TIỀN LƯƠNG</Typography>
//           <Typography>Lương cơ bản: {contractInfo?.basicSalary} VNĐ</Typography>
//           <Typography>Phụ cấp: {contractInfo?.allowance}</Typography>
//           <Typography>Hình thức: {contractInfo?.receiveMethod}</Typography>

//           <Divider sx={{ my: 3 }} />

//           <Typography fontWeight={600} mb={1}>
//             Hợp đồng giấy chi tiết
//           </Typography>
//           <FilePreviewCard
//             url={contractInfo?.contractFile?.url}
//             label="Hợp đồng"
//             name="Hợp đồng"
//           />

//           <Divider sx={{ my: 3 }} />

//           <Typography fontWeight={600} mb={1}>
//             Phụ lục & Tài liệu đính kèm
//           </Typography>

//           {attachments.lenght > 0 && (
//             <Stack spacing={1}>
//               {attachments.map((file) => (
//                 <FilePreviewCard />
//               ))}
//             </Stack>
//           )}
//         </Paper>
//       </Box>

//       {/* ===== STICKY FOOTER ===== */}
//       {/* ===== STICKY FOOTER ===== */}
//       {isAdmin && (
//         <Box position="sticky" bottom={0}>
//           <SectionWrapper
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: 2,
//             }}
//           >
//             <Button color="warning" variant="contained" onClick={handleUpdate}>
//               {contractInfo?.freezed ? "Thêm phụ lục" : "Sửa hợp đồng"}
//             </Button>
//             {!signed && (
//               <ConfirmButton
//                 variant="contained"
//                 onConfirm={approveContract}
//                 confirmTitle="XÁC NHẬN KÝ KẾT HỢP ĐỒNG"
//                 confirmContent="Hợp đồng sẽ không thể sữa khi kí"
//               >
//                 XÁC NHẬN KÝ KẾT HỢP ĐỒNG
//               </ConfirmButton>
//             )}
//           </SectionWrapper>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default CrewContractDetail;
