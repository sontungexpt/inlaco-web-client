import React, { useState } from "react";
import {
  BaseDataGrid,
  PageTitle,
  SearchBar,
  InfoTextField,
  DetailActionCell,
} from "@components/common";
import { Box, MenuItem } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { isoToLocalDatetime } from "@utils/converter";
import { useContracts } from "@/hooks/services/contract";

const CrewContract = ({ pageSize = 10 }) => {
  const navigate = useNavigate();
  const { initialPage = 0 } = useLocation().state || {};

  const [isSignedContract, setIsSignedContract] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: initialPage || 0,
    pageSize: pageSize,
  });

  const {
    data: { content: crewContracts, totalElements: totalContracts } = {},
    isLoading,
  } = useContracts({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    signed: isSignedContract,
  });

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
    },
    {
      field: "freezedAt",
      headerName: "Ngày có hiệu lực",
      sortable: false,
      flex: 1,
      align: "center",
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
      valueFormatter: (params) => {
        return params ? isoToLocalDatetime(params, "dd/mm/yyyy HH:MM") : "";
      },
    },
    {
      field: "detail",
      headerName: "Chi tiết",
      sortable: false,
      align: "center",
      renderCell: (params) => {
        return (
          <DetailActionCell onClick={() => onContractDetailClick(params?.id)} />
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <PageTitle
        title="HỢP ĐỒNG THUYỀN VIÊN"
        subtitle="Danh sách các hợp đồng của Thuyền viên"
      />
      <Box mt="40px" maxWidth={1600}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <SearchBar
            size="small"
            placeholder={
              "Nhập tên hoặc mã thuyền viên cần tìm kiếm (VD: Nguyễn Văn A,...)"
            }
          />

          <InfoTextField
            select
            size="small"
            margin="none"
            required
            label="Trạng thái"
            value={isSignedContract}
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
          rows={crewContracts}
        />
      </Box>
    </Box>
  );
};

export default CrewContract;
