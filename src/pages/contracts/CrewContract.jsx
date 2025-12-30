import React, { useState } from "react";
import {
  PageTitle,
  NoValuesOverlay,
  SearchBar,
  InfoTextField,
} from "@components/global";
import { Box, Button, CircularProgress, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useNavigate } from "react-router";
import { isoStringToAppDateString, isoToLocalDatetime } from "@utils/converter";
import Color from "@constants/Color";
import { useContracts } from "@/hooks/services/contracts";

const CrewContract = () => {
  const navigate = useNavigate();

  const [isSignedContract, setIsSignedContract] = useState(true);
  const { data: crewContractsResponse, isLoading } = useContracts({
    signed: isSignedContract,
  });
  const crewContracts = crewContractsResponse?.content;

  const handleStatusChange = (event) => {
    setIsSignedContract(event.target.value);
  };

  const onContractDetailClick = (id) => {
    navigate(`/crew-contracts/${id}`, { state: { signed: isSignedContract } });
  };

  const STATUS_FILTERS = [
    { label: "Hợp đồng chính thức", value: true },
    { label: "Đang chờ ký kết", value: false },
  ];

  const columns = [
    {
      field: "title",
      headerName: "Tiêu đề",
      sortable: false,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "freezedAt",
      headerName: "Ngày có hiệu lực",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => {
        return params ? isoToLocalDatetime(params, "dd/mm/yyyy HH:MM") : "";
      },
    },
    {
      field: "expiredDate",
      headerName: "Ngày hết hạn",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => {
        return params ? isoToLocalDatetime(params, "dd/mm/yyyy HH:MM") : "";
      },
    },
    {
      field: "detail",
      headerName: "Chi tiết",
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            size="small"
            onClick={() => onContractDetailClick(params?.id)}
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
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Box>
        <PageTitle
          title="HỢP ĐỒNG THUYỀN VIÊN"
          subtitle="Danh sách các hợp đồng của Thuyền viên"
        />
      </Box>
      <Box m="40px 0 0 0" height="62vh" maxHeight={550} maxWidth={1600}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            paddingBottom: 2,
            justifyContent: "space-between",
          }}
        >
          <SearchBar
            placeholder={
              "Nhập tên hoặc mã thuyền viên cần tìm kiếm (VD: Nguyễn Văn A,...)"
            }
            color={Color.PrimaryBlack}
            backgroundColor={Color.SecondaryWhite}
            sx={{
              width: "50%",
            }}
          />

          <InfoTextField
            select
            size="small"
            margin="none"
            required
            label="Trạng thái"
            value={isSignedContract}
            onChange={handleStatusChange}
            sx={{ marginTop: 1 }}
          >
            {STATUS_FILTERS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </InfoTextField>
        </Box>
        {!isLoading ? (
          <DataGrid
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnResize
            rows={crewContracts}
            columns={columns}
            slots={{ noRowsOverlay: NoValuesOverlay }}
            pageSizeOptions={[5, 10, { value: -1, label: "All" }]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            sx={{
              backgroundColor: "#FFF",
              headerAlign: "center",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: 16,
                fontWeight: 700,
              },

              "& .MuiDataGrid-columnHeader": {
                backgroundColor: Color.SecondaryBlue,
                color: Color.PrimaryWhite,
              },
              "& .MuiTablePagination-root": {
                backgroundColor: Color.SecondaryBlue,
                color: Color.PrimaryWhite,
              },
            }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "62vh",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CrewContract;
