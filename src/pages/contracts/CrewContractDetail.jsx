import React, { useState } from "react";
import { PageTitle, SectionDivider, InfoTextField } from "@components/global";
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
import SubSegmentWrapper from "./components/SubSegmentWrapper";
import SectionWrapper from "@components/global/SectionWrapper";

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
  const location = useLocation();

  const isOfficialContract = location.state?.signed;
  const { data: contractInfo, isLoading } = useContract(id);

  //   const [createContractLoading, setCreateContractLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const handleAddContractAddendum = (id) => {
    navigate(`/crew-contracts/${id}/create-addendum`);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const handleDownloadPaperContractClick = (values) => {
    const loadFile = (url, callback) => {
      JSZipUtils.getBinaryContent(url, callback);
    };

    loadFile(
      require("@assets/templates/template-hop-dong-thuyen-vien.docx"),
      (error, content) => {
        if (error) {
          throw error;
        }

        // Initialize PizZip with the .docx content
        const zip = new PizZip(content);

        // Initialize docxtemplater
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        // Set dynamic values for placeholders
        doc.setData({
          title: values.title,
          compName: values.partyA.compName,
          compAddress: values.partyA.compAddress,
          compPhoneNumber: values.partyA.compPhoneNumber,
          representative: values.partyA.representative,
          representativePos: values.partyA.representativePos,

          fullName: values.partyB.fullName,
          dob: formatDateString(values.partyB.dob),
          birthplace: values.partyB.birthplace,
          nationality: values.partyB.nationality,
          permanentAddr: values.partyB.permanentAddr,
          temporaryAddr: values.partyB.temporaryAddr,
          ciNumber: values.partyB.ciNumber,
          ciIssueDate: formatDateString(values.partyB.ciIssueDate),
          ciIssuePlace: values.partyB.ciIssuePlace,

          startDate: formatDateString(values.jobInfo.startDate),
          endDate: formatDateString(values.jobInfo.endDate),
          workingLocation: values.jobInfo.workingLocation,
          position: values.jobInfo.position,
          jobDescription: values.jobInfo.jobDescription,

          basicSalary: values.salaryInfo.basicSalary,
          allowance: values.salaryInfo.allowance,
          receiveMethod: values.salaryInfo.receiveMethod,
          payday: values.salaryInfo.payday,
          salaryReviewPeriod: values.salaryInfo.salaryReviewPeriod,
        });

        try {
          // Render the document with dynamic data
          doc.render();

          // Generate the final document
          const out = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          // Save the file locally
          saveAs(out, "hop-dong-thuyen-vien.docx");
        } catch (error) {
          console.error("Error generating document:", error);
        }
      },
    );
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

  const disabledReadableSx = {
    "& .MuiInputBase-input.Mui-disabled": {
      color: "#111",
      WebkitTextFillColor: "#111",
    },
    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
      borderColor: "#ccc",
    },
  };

  return (
    <Box onSubmit={(e) => e.preventDefault()} p={2} sx={{ pb: 6 }}>
      {/* ================= HEADER ================= */}
      <Box
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
              isOfficialContract
                ? `Mã hợp đồng: ${id}`
                : "Hợp đồng đang chờ ký kết"
            }
          />

          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleAddContractAddendum(id)}
            >
              Thêm Phụ lục
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ================= FILE ================= */}
      <Box px={3} mb={3}>
        <ContractFileList />
      </Box>

      {/* ================= BASIC INFO ================= */}
      <SectionWrapper sx={sectionPaperSx}>
        <Grid>
          <InfoTextField
            label="Tiêu đề hợp đồng"
            value={contractInfo?.title ?? ""}
            disabled
            fullWidth
            sx={disabledReadableSx}
          />
        </Grid>
      </SectionWrapper>

      {/* ================= PARTY A ================= */}
      <SectionWrapper sx={sectionPaperSx}>
        <SectionDivider sectionName="Người sử dụng lao động (Bên A)" />
        <Grid container spacing={2}>
          <Grid size={4}>
            <InfoTextField
              label="Tên công ty"
              disabled
              required
              fullWidth
              name="partyA.compName"
              // value={values.partyA?.compName}
            />
          </Grid>

          <Grid size={6}>
            <InfoTextField
              label="Địa chỉ"
              disabled
              required
              fullWidth
              name="partyA.compAddress"
              // value={values.partyA?.compAddress}
            />
          </Grid>

          <Grid size={2}>
            <InfoTextField
              label="Số điện thoại"
              required
              fullWidth
              name="partyA.compPhoneNumber"
              // value={values.partyA?.compPhoneNumber}
            />
          </Grid>

          <Grid size={4}>
            <InfoTextField
              label="Người đại diện"
              required
              fullWidth
              name="partyA.representative"
              // value={values.partyA?.representative}
            />
          </Grid>

          <Grid size={3}>
            <InfoTextField
              label="Chức vụ"
              required
              fullWidth
              name="partyA.representativePos"
              // value={values.partyA?.representativePos}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= PARTY B ================= */}
      <SectionWrapper sx={sectionPaperSx}>
        <SectionDivider sectionName="Người lao động (Bên B)" />
        <Grid container spacing={2}>
          <Grid size={6}>
            <InfoTextField
              label="Họ và tên"
              required
              fullWidth
              name="partyB.fullName"
              // value={values.partyB?.fullName}
            />
          </Grid>

          <Grid size={3}>
            <InfoTextField
              type="date"
              label="Ngày sinh"
              required
              fullWidth
              name="partyB.dob"
              // value={values.partyB?.dob}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={3}>
            <InfoTextField
              id="birthplace"
              label="Nơi sinh"
              margin="none"
              required
              fullWidth
              name="partyB.birthplace"
              // value={values.partyB?.birthplace}
            />
          </Grid>

          <Grid size={2}>
            <InfoTextField
              label="Quốc tịch"
              required
              fullWidth
              name="partyB.nationality"
              // value={values.partyB?.nationality}
            />
          </Grid>

          <Grid size={5}>
            <InfoTextField
              label="Địa chỉ thường trú"
              required
              fullWidth
              name="partyB.permanentAddr"
              // value={values.partyB?.permanentAddr}
            />
          </Grid>
          <Grid size={5}>
            <InfoTextField
              id="temporary-address"
              label="Địa chỉ tạm trú"
              margin="none"
              required
              fullWidth
              name="partyB.temporaryAddr"
              // value={values.partyB?.temporaryAddr}
            />
          </Grid>
          <Grid size={12}>
            <SubSegmentWrapper title="Thông tin Căn cước công dân">
              <Grid container spacing={2}>
                <Grid size={4}>
                  <InfoTextField
                    id="ci-number"
                    label="Số Căn cước công dân"
                    required
                    fullWidth
                    name="partyB.ciNumber"
                    // value={values.partyB?.ciNumber}
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextField
                    id="ci-issue-date"
                    type="date"
                    label="Ngày cấp"
                    required
                    fullWidth
                    name="partyB.ciIssueDate"
                    // value={values.partyB?.ciIssueDate}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Grid>

                <Grid size={5}>
                  <InfoTextField
                    id="ci-issue-place"
                    label="Nơi cấp"
                    required
                    fullWidth
                    name="partyB.ciIssuePlace"
                    // value={values.partyB?.ciIssuePlace}
                  />
                </Grid>
              </Grid>
            </SubSegmentWrapper>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= JOB INFO ================= */}
      <SectionWrapper sx={sectionPaperSx}>
        <SectionDivider sectionName="Thông tin công việc" />
        <Grid container spacing={2}>
          <Grid size={3}>
            <InfoTextField
              type="date"
              label="Ngày bắt đầu"
              value={contractInfo?.jobInfo?.startDate ?? ""}
              disabled
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={disabledReadableSx}
            />
          </Grid>

          <Grid size={3}>
            <InfoTextField
              type="date"
              label="Ngày kết thúc"
              value={contractInfo?.jobInfo?.endDate ?? ""}
              disabled
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={disabledReadableSx}
            />
          </Grid>

          <Grid size={12}>
            <InfoTextField
              label="Mô tả công việc"
              value={contractInfo?.jobInfo?.jobDescription ?? ""}
              disabled
              fullWidth
              multiline
              rows={5}
              sx={disabledReadableSx}
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
      >
        <SectionDivider sectionName="Thông tin lương" />
        <Grid container spacing={2} mt={1}>
          <Grid size={3}>
            <InfoTextField
              type="number"
              label="Lương cơ bản"
              required
              fullWidth
              name="salaryInfo.basicSalary"
              // value={values.salaryInfo?.basicSalary}
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
            <InfoTextField
              type="number"
              label="Phụ cấp"
              required
              fullWidth
              name="salaryInfo.allowance"
              // value={values.salaryInfo?.allowance}
            />
          </Grid>

          <Grid size={3}>
            <InfoTextField
              select
              label="Hình thức trả lương"
              required
              fullWidth
              name="salaryInfo.receiveMethod"
              // value={values.salaryInfo?.receiveMethod}
            ></InfoTextField>
          </Grid>

          <Grid size={3}>
            <InfoTextField
              label="Thời hạn trả lương"
              required
              fullWidth
              name="salaryInfo.payday"
              // value={values.salaryInfo?.payday}
            />
          </Grid>
          <Grid size={4}>
            <InfoTextField
              id="salary-review-period"
              label="Thời hạn được xét nâng lương"
              margin="none"
              required
              fullWidth
              name="salaryInfo.salaryReviewPeriod"
              // value={values.salaryInfo?.salaryReviewPeriod}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* {isOfficialContract && ( */}
      {/*   <Paper sx={sectionPaperSx}> */}
      {/*     <SectionDivider sectionName="Phụ lục đính kèm" /> */}
      {/*     <MultilineFileUploadField */}
      {/*       label="Tải lên phụ lục" */}
      {/*       name="addendum" */}
      {/*       disabled */}
      {/*     /> */}
      {/*   </Paper> */}
      {/* )} */}
    </Box>
  );
};

export default CrewContractDetail;
