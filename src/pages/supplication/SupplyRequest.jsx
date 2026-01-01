import React, { useMemo, useState } from "react";
import { PageTitle, NoValuesOverlay } from "@components/global";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
  Link,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { ShipInfoCell } from "@components/mobilization";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useNavigate } from "react-router";
import { isoToLocalDatetime } from "@/utils/converter";
import Color from "@constants/Color";
import useAllowedRole from "@/hooks/useAllowedRole";
import { useSupplyRequests } from "@/hooks/services/supplyRequest";

const SupplyRequest = () => {
  const navigate = useNavigate();
  const isAdmin = useAllowedRole("ADMIN");
  const PAGE_SIZE = 10;

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const {
    data: { content, totalElements: totalRequests = 0 } = {},
    isLoading,
  } = useSupplyRequests({
    page: paginationModel.page,
    sizePerPage: paginationModel.pageSize,
  });

  const supplyRequests = useMemo(
    () =>
      content?.map((r) => ({
        id: r.id,
        company: {
          name: r.companyName,
          representor: {
            name: r.companyRepresentor,
            email: r.companyEmail,
            phone: r.companyPhone,
          },
        },
        shipInfo: {
          IMONumber: r.shipInfo.IMONumber,
          name: r.shipInfo.name,
          countryCode: r.shipInfo.countryISO,
          imageUrl: r.shipInfo.image?.url,
          type: r.shipInfo.type,
          description: r.shipInfo.description,
        },
        detail: {
          rentalStartDate: r.rentalStartDate,
          rentalEndDate: r.rentalEndDate,
          detailFileUrl: r.detailFile?.url,
        },
      })),
    [content],
  );

  const onRequestDetailClick = (id) => {
    const type = isAdmin ? "admin" : "user";
    navigate(`/supply-requests/${id}/${type}`);
  };

  const columns = useMemo(
    () => [
      {
        field: "company",
        headerName: "Công ty",
        flex: 2,
        headerAlign: "center",
        sortable: false,
        renderCell: ({ value: company }) => (
          <Box>
            <Typography fontWeight={600} noWrap>
              Công ty: {company.name}
            </Typography>

            <Typography variant="body2" color="text.secondary" noWrap>
              Người đại diện: {company.representor.name}
            </Typography>

            <Typography variant="body2" color="text.secondary" noWrap>
              Email: {company.representor.email}
            </Typography>

            <Typography variant="body2" color="text.secondary" noWrap>
              SĐT: {company.representor.phone}
            </Typography>
          </Box>
        ),
      },
      {
        field: "shipInfo",
        headerName: "Thông tin Tàu",
        flex: 3,
        headerAlign: "center",
        sortable: false,
        renderCell: ({ value: shipInfo }) => (
          <ShipInfoCell
            name={shipInfo.name}
            countryCode={shipInfo.countryCode}
            type={shipInfo.type}
            imageUrl={shipInfo.imageUrl}
            description={shipInfo.description}
            IMONumber={shipInfo.IMONumber}
          />
        ),
      },
      {
        field: "detail",
        headerName: "Thông tin thuê",
        flex: 2,
        headerAlign: "center",
        sortable: false,
        renderCell: ({
          value: { rentalStartDate, rentalEndDate, detailFileUrl },
        }) => (
          <Box sx={{ py: 0.5, minWidth: 0 }}>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary" noWrap>
                Từ: {isoToLocalDatetime(rentalStartDate)}
              </Typography>

              <Typography variant="body2" color="text.secondary" noWrap>
                Đến: {isoToLocalDatetime(rentalEndDate)}
              </Typography>

              <Typography variant="body2" color="text.secondary" noWrap>
                Chi tiết:{" "}
                <Link
                  href={detailFileUrl}
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                  variant="body2"
                  noWrap
                >
                  Detail file
                </Link>
              </Typography>
            </Stack>
          </Box>
        ),
      },
      {
        field: "view",
        headerName: "Chi tiết",
        headerAlign: "center",
        align: "center",
        sortable: false,
        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => onRequestDetailClick(params.id)}
              sx={{
                backgroundColor: Color.PrimaryGreen,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: Color.PrimaryBlack,
                borderRadius: "6px",
                minWidth: "36px",
              }}
            >
              <ArrowForwardIosRoundedIcon sx={{ width: 16, height: 16 }} />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p="20px">
      <PageTitle
        title="YÊU CẦU CUNG ỨNG"
        subtitle="Danh sách các yêu cầu cung ứng thuyền viên"
      />

      {!isAdmin && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: Color.PrimaryGold,
              color: Color.PrimaryBlack,
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
            onClick={() => navigate("/supply-requests/user/create")}
          >
            <AddCircleRoundedIcon sx={{ mr: 1 }} />
            Gửi yêu cầu cung ứng
          </Button>
        </Box>
      )}

      <Box
        mt={3}
        sx={{
          height: isAdmin ? "72vh" : "65vh",
          maxWidth: 1600,
          bgcolor: "#FFF",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",
        }}
      >
        <DataGrid
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnResize
          getRowHeight={() => "auto"}
          columns={columns}
          paginationMode="server" // QUAN TRỌNG!
          rowCount={totalRequests}
          rows={supplyRequests}
          slots={{ noRowsOverlay: NoValuesOverlay }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: Color.SecondaryBlue,
              color: Color.PrimaryWhite,
              fontWeight: 700,
            },
            "& .MuiTablePagination-root": {
              backgroundColor: Color.SecondaryBlue,
              color: Color.PrimaryWhite,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SupplyRequest;
