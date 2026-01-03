import React, { useState } from "react";
import {
  BaseDataGrid,
  PageTitle,
  SearchBar,
  InfoTextField,
  DetailCell,
} from "@components/common";
import { Box, Button, MenuItem } from "@mui/material";
import Color from "@constants/Color";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useLocation, useNavigate } from "react-router";
import { useContracts } from "@/hooks/services/contract";
import { isoToLocalDatetime } from "@/utils/converter";
import ContractType from "@/constants/ContractTemplateType";

const SupplyContract = ({ pageSize = 10 }) => {
  const navigate = useNavigate();
  const { initialPage = 0 } = useLocation().state || {};

  const [isSignedContract, setIsSignedContract] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: initialPage || 0,
    pageSize: pageSize,
  });

  const {
    data: { content: supplyContracts, totalElements: totalContracts } = {},
    isLoading,
  } = useContracts({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    type: ContractType.SUPPLY_CONTRACT,
    signed: isSignedContract,
  });

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
        return <DetailCell onClick={() => onContractDetailClick(params?.id)} />;
      },
    },
  ];

  return (
    <Box m="20px">
      <PageTitle
        title="HỢP ĐỒNG CUNG ỨNG"
        subtitle="Danh sách các hợp đồng cung ứng thuyền viên"
      />
      <Box mt="40px" maxWidth={1600}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 2,
          }}
        >
          <SearchBar
            placeholder={
              "Nhập tên hoặc mã thuyền viên cần tìm kiếm (VD: Nguyễn Văn A,...)"
            }
            size="small"
          />
          <InfoTextField
            label="Trạng thái"
            select
            value={isSignedContract}
            size="small"
            onChange={handleStatusChange}
          >
            {STATUS_FILTERS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </InfoTextField>
        </Box>
        <BaseDataGrid
          loading={isLoading}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalContracts}
          rows={supplyContracts}
        />
      </Box>
    </Box>
  );
};

export default SupplyContract;
