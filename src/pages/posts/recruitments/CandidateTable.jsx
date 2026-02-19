import React from "react";
import { Box, Button, Select, MenuItem } from "@mui/material";
import { GridFooter, GridFooterContainer } from "@mui/x-data-grid";
import Color from "@constants/Color";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { isoStringToAppDateString } from "@/utils/converter";
import CandidateStatus from "@/constants/CandidateStatus";
import { BaseDataGrid } from "@/components/common";

const CustomFooter = ({ filterStatus, onFilterStatusChange }) => {
  const STATUS_FILTERS = [
    { label: "Đã nộp hồ sơ", value: CandidateStatus.APPLIED },
    { label: "Đang sàng lọc", value: CandidateStatus.SCREENING },
    {
      label: "Đã lên lịch phỏng vấn",
      value: CandidateStatus.INTERVIEW_SCHEDULED,
    },
    { label: "Đã phỏng vấn", value: CandidateStatus.INTERVIEWED },
    { label: "Đã gửi offer", value: CandidateStatus.OFFERED },
    { label: "Ứng viên xác nhận", value: CandidateStatus.CONFIRMED },
    {
      label: "Hợp đồng chưa kí",
      value: CandidateStatus.CONTRACT_PENDING_SIGNATURE,
    },
    { label: "Hợp đồng đã kí", value: CandidateStatus.CONTRACT_SIGNED },
    { label: "Hợp đồng có hiệu lực", value: CandidateStatus.HIRED },
    { label: "Từ chối", value: CandidateStatus.REJECTED },
    { label: "Ứng viên rút hồ sơ", value: CandidateStatus.WITHDRAWN },
  ];

  return (
    <GridFooterContainer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        padding: "4px 16px",
        backgroundColor: Color.SecondaryBlue,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Select
          size="small"
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
          sx={{
            color: Color.PrimaryWhite,

            //  XÓA VIỀN HOÀN TOÀN
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },

            "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },

            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "none",
              },
          }}
        >
          {STATUS_FILTERS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <GridFooter />
    </GridFooterContainer>
  );
};

const CandidateTable = ({
  candidates,
  totalCandidates,
  loading = false,
  filterStatus,
  onFilterStatusChange,
  candidateStatus = CandidateStatus.APPLIED,
  onAdminMemberDetailClick,
  onCreateCrewMemberClick,
  paginationModel,
  onPaginationModelChange,
}) => {
  const columns = [
    {
      field: "fullName",
      headerName: "Họ tên",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "gender",
      headerName: "Giới tính",
      sortable: false,
      flex: 0.75,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {params.value === "MALE"
              ? "Nam"
              : params.value === "FEMALE"
                ? "Nữ"
                : "Khác"}
          </Box>
        );
      },
    },
    {
      field: "birthDate",
      headerName: "Ngày sinh",
      sortable: false,
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {isoStringToAppDateString(params.value)}
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "SĐT",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "detail",
      headerName: "Thao tác",
      sortable: false,
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
              padding: 5,
            }}
          >
            {candidateStatus === "WAIT_FOR_INTERVIEW" && (
              <Button
                variant="contained"
                size="small"
                onClick={() => onCreateCrewMemberClick(params?.id, params?.row)}
                sx={{
                  backgroundColor: Color.PrimaryGold,
                  color: Color.PrimaryBlack,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  marginRight: "8px",
                }}
              >
                <PersonAddAltRoundedIcon
                  sx={{
                    width: 18,
                    height: 18,
                    marginTop: "3px",
                    marginBottom: "3px",
                  }}
                />
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              onClick={() => onAdminMemberDetailClick(params?.id)}
              sx={{
                backgroundColor: Color.PrimaryGreen,
                color: Color.PrimaryBlack,
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              <ArrowForwardIosRoundedIcon
                sx={{
                  width: 15,
                  height: 15,
                  marginTop: "4px",
                  marginBottom: "4px",
                }}
              />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <BaseDataGrid
      loading={loading}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      rowCount={totalCandidates}
      rows={candidates}
      columns={columns}
      slots={{
        footer: () => (
          <CustomFooter
            filterStatus={filterStatus}
            onFilterStatusChange={onFilterStatusChange}
          />
        ),
      }}
    />
  );
};

export default CandidateTable;
