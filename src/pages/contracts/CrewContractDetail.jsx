import React, { useState } from "react";
import {
  SectionWrapper,
  PageTitle,
  SectionDivider,
  InfoTextField,
  ViewTextField,
} from "@components/common";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Dialog,
  Button,
  Grid,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import Color from "@constants/Color";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import { useNavigate, useParams, useLocation } from "react-router";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import JSZipUtils from "jszip-utils";
import { formatDateString } from "@utils/converter";
import { useContract } from "@/hooks/services/contract";
import { HandshakeRounded } from "@mui/icons-material";
import { activeContract as activeContract } from "@/services/contractServices";
import toast from "react-hot-toast";

/* ==== FORCE DOWNLOAD ==== */
const forceDownload = (url, filename) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const ContractFileList = ({ files = [] }) => {
  const [previewFile, setPreviewFile] = useState(null);

  return (
    <>
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: Color.SecondaryWhite,
        }}
      >
        <Typography fontWeight={700} mb={1}>
          File đính kèm
        </Typography>

        <Stack spacing={1}>
          {files.map((file) => (
            <Box
              key={file.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "#fff",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={() => setPreviewFile(file)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DescriptionRoundedIcon color="primary" />
                <Typography
                  sx={{
                    maxWidth: 280,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {file.name}
                </Typography>
              </Box>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  forceDownload(file.url, file.name);
                }}
              >
                <DownloadForOfflineRoundedIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* ==== PREVIEW ==== */}
      <Dialog
        open={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        fullWidth
        maxWidth="lg"
      >
        {previewFile && (
          <iframe
            title="contract-preview"
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              previewFile.url,
            )}&embedded=true`}
            style={{ width: "100%", height: "80vh", border: "none" }}
          />
        )}
      </Dialog>
    </>
  );
};

const CrewContractDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: contractInfo = {}, isLoading } = useContract(id);
  const isFrozen = contractInfo?.freezed;
  const partyA = contractInfo?.initiator;
  const partyB = contractInfo?.partners?.[0];

  const handleAddContractAddendum = (id) => {
    navigate(`/crew-contracts/${id}/create-addendum`);
  };

  const approveContract = async () => {
    try {
      const response = await activeContract(id);
      navigate("/supply-contracts");
    } catch (err) {
      toast.error("Kí thất bại");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const sectionPaperSx = {
    p: 3,
    mb: 3,
    borderRadius: 2,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  };

  return (
    <Box onSubmit={(e) => e.preventDefault()} p={2} sx={{ pb: 6 }}>
      {/* ================= HEADER ================= */}
      <SectionWrapper
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "background.paper",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 2,
          mb: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <PageTitle
            title="CHI TIẾT HỢP ĐỒNG THUYỀN VIÊN"
            subtitle={
              isFrozen ? `Mã hợp đồng: ${id}` : "Hợp đồng đang chờ ký kết"
            }
          />

          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="warning"
              // onClick={() => handleAddContractAddendum(id)}
            >
              {isFrozen ? `Thêm Phụ lục` : "Chỉnh sửa hợp đồng"}
            </Button>
            <Button
              variant="contained"
              sx={{
                color: Color.PrimaryWhite,
                backgroundColor: Color.PrimaryGreen,
              }}
              onClick={approveContract}
            >
              Xác nhận ký kết
            </Button>
          </Box>
        </Box>
      </SectionWrapper>

      {/* ================= FILE ================= */}
      <Box px={3} mb={3}>
        <ContractFileList />
      </Box>

      {/* ================= BASIC INFO ================= */}
      <SectionWrapper sx={sectionPaperSx}>
        <Grid>
          <ViewTextField
            label="Tiêu đề hợp đồng"
            value={contractInfo?.title ?? ""}
          />
        </Grid>
      </SectionWrapper>

      {/* ================= PARTY A ================= */}
      <SectionWrapper title="Người sử dụng lao động (Bên A)">
        <Grid container spacing={2}>
          <Grid size={4}>
            <ViewTextField label="Tên công ty" value={partyA?.partyName} />
          </Grid>

          <Grid size={6}>
            <ViewTextField value={partyA?.address} label="Địa chỉ" />
          </Grid>

          <Grid size={2}>
            <ViewTextField value={partyA?.phone} label="Số điện thoại" />
          </Grid>

          <Grid size={4}>
            <ViewTextField label="Người đại diện" value={partyA?.representer} />
          </Grid>

          <Grid size={3}>
            <InfoTextField
              label="Chức vụ"
              value={partyA?.representerPosition}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= PARTY B ================= */}
      <SectionWrapper title="Người lao động (Bên B)">
        <Grid container spacing={2}>
          <Grid size={6}>
            <ViewTextField label="Họ và tên" value={partyB?.fullName} />
          </Grid>

          <Grid size={3}>
            <ViewTextField label="Ngày sinh" value={partyB?.birthDate} />
          </Grid>
          <Grid size={3}>
            <ViewTextField label="Nơi sinh" value={partyB?.birthPlace} />
          </Grid>

          <Grid size={2}>
            <ViewTextField label="Quốc tịch" value={partyB?.nationality} />
          </Grid>

          <Grid size={5}>
            <ViewTextField
              label="Địa chỉ thường trú"
              value={partyB?.permanentAddress}
            />
          </Grid>
          <Grid size={5}>
            <ViewTextField
              label="Địa chỉ tạm trú"
              value={partyB?.temporaryAddress}
            />
          </Grid>
          <Grid size={12}>
            <SectionWrapper
              variant="outlined"
              title="Thông tin Căn cước công dân"
              sx={{
                background:
                  "linear-gradient(135deg, rgba(255,215,0,0.15), transparent)",
              }}
            >
              <Grid container spacing={2}>
                <Grid size={4}>
                  <ViewTextField
                    label="Số Căn cước công dân"
                    value={partyB?.identificationCardId}
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextField
                    label="Ngày cấp căn cước"
                    value={partyB?.identificationCardIssuedDate}
                  />
                </Grid>

                <Grid size={5}>
                  <InfoTextField
                    label="Nơi cấp căn cước"
                    value={partyB?.identificationCardIssuedPlace}
                  />
                </Grid>
              </Grid>
            </SectionWrapper>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= JOB INFO ================= */}
      <SectionWrapper title="Thông tin công việc">
        <Grid container spacing={2}>
          <Grid size={3}>
            <ViewTextField
              label="Ngày bắt đầu"
              value={contractInfo?.activationDate}
            />
          </Grid>

          <Grid size={3}>
            <ViewTextField
              label="Ngày kết thúc"
              value={contractInfo?.expiredDate}
            />
          </Grid>

          <Grid size={12}>
            <ViewTextField
              label="Mô tả công việc"
              value={contractInfo?.jobInfo?.jobDescription ?? ""}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ===== Salary ===== */}
      <SectionWrapper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background:
            "linear-gradient(135deg, rgba(255,215,0,0.15), transparent)",
        }}
        title="Thông tin lương"
      >
        <Grid container spacing={2} mt={1}>
          <Grid size={3}>
            <ViewTextField
              label="Lương cơ bản"
              value={contractInfo?.basicSalary}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">vnđ</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={3}>
            <ViewTextField label="Phụ cấp" value={contractInfo?.allowance} />
          </Grid>

          <Grid size={3}>
            <ViewTextField
              label="Hình thức trả lương"
              value={contractInfo?.receiveMethod}
            />
          </Grid>

          <Grid size={3}>
            <ViewTextField
              label="Thời hạn trả lương"
              value={contractInfo?.payday}
            />
          </Grid>
          <Grid size={4}>
            <ViewTextField
              label="Thời hạn được xét nâng lương"
              value={contractInfo?.salaryReviewPeriod}
            />
          </Grid>
        </Grid>
      </SectionWrapper>
    </Box>
  );
};

export default CrewContractDetail;
