import React, { useState } from "react";
import {
  PageTitle,
  NoValuesOverlay,
  SearchBar,
  InfoTextField,
} from "@components/global";
import { Box, Button, MenuItem, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Color from "@constants/Color";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useNavigate } from "react-router";
import { useContracts } from "@/hooks/services/contracts";
import { isoToLocalDatetime } from "@/utils/converter";

const SupplyContract = () => {
  const navigate = useNavigate();

  const [isSignedContract, setIsSignedContract] = useState(true);
  const { data: supplyContractsResponse, isLoading } = useContracts({
    type: "SUPPLY_CONTRACT",
    signed: isSignedContract,
  });
  const supplyContracts = supplyContractsResponse?.content || [];

  const STATUS_FILTERS = [
    { label: "Hợp đồng chính thức", value: true },
    { label: "Đang chờ ký kết", value: false },
  ];

  const handleStatusChange = (event) => {
    setIsSignedContract(event.target.value);
  };

  const onContractDetailClick = (id) => {
    navigate(`/supply-contracts/${id}`, {
      state: { signed: isSignedContract },
    });
  };

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
        return params ? isoToLocalDatetime(params) : "";
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
        return params ? isoToLocalDatetime(params) : "";
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
          title="HỢP ĐỒNG CUNG ỨNG"
          subtitle="Danh sách các hợp đồng cung ứng thuyền viên"
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
            label="Trạng thái"
            select
            value={isSignedContract}
            size="small"
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
            rows={supplyContracts}
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

export default SupplyContract;
