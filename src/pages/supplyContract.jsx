import React, { useState, useEffect } from "react";
import { PageTitle, NoValuesOverlay, SearchBar } from "../components/global";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { mockSupplyContracts } from "../data/mockData";
import { COLOR } from "../assets/Color";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useNavigate } from "react-router";
import HttpStatusCodes from "../assets/constants/httpStatusCodes";
import { getSupplyContractsAPI } from "../services/contractServices";
import { isoStringToAppDateString } from "../utils/ValueConverter";

const SupplyContract = () => {
  const navigate = useNavigate();

  const [supplyContracts, setSupplyContracts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCrewContracts = async (signed) => {
    setLoading(true);
    try {
      const response = await getSupplyContractsAPI(0, 10, signed);
      await new Promise((resolve) => setTimeout(resolve, 200)); // delay UI for 200ms

      if (response.status === HttpStatusCodes.OK) {
        // console.log("Supply contracts: ", response.data.content);
        setSupplyContracts(response.data.content);
      }
    } catch (err) {
      console.log("Error when fetching supply contracts: ", err);
    } finally {
      setLoading(false);
    }
  };

  const statusFilters = [
    { label: "Hợp đồng chính thức", value: true },
    { label: "Đang chờ ký kết", value: false },
  ];

  const [isSignedContract, setIsSignedContract] = useState(true);
  useEffect(() => {
    fetchCrewContracts(isSignedContract);
  }, [isSignedContract]);

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
        return params ? isoStringToAppDateString(params) : "";
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
        return params ? isoStringToAppDateString(params) : "";
      },
    },
    {
      field: "detail",
      headerName: "Chi tiết",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            size="small"
            onClick={() => onContractDetailClick(params?.id)}
            sx={{
              backgroundColor: COLOR.primary_green,
              color: COLOR.primary_black,
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
    <div>
      <Box m="20px">
        <Box>
          <PageTitle
            title="HỢP ĐỒNG CUNG ỨNG"
            subtitle="Danh sách các hợp đồng cung ứng thuyền viên"
          />
        </Box>
        <Box
          m="40px 0 0 0"
          height="62vh"
          maxHeight={550}
          maxWidth={1600}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: COLOR.secondary_blue,
              color: COLOR.primary_white,
            },
            "& .MuiTablePagination-root": {
              backgroundColor: COLOR.secondary_blue,
              color: COLOR.primary_white,
            },
          }}
        >
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
              color={COLOR.primary_black}
              backgroundColor={COLOR.secondary_white}
              sx={{
                width: "40%",
              }}
            />
            <Select
              label="Trạng thái"
              value={isSignedContract}
              size="small"
              onChange={handleStatusChange}
              sx={{ marginTop: 1 }}
            >
              {statusFilters.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {!loading ? (
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
    </div>
  );
};

export default SupplyContract;
