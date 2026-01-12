import React, { useMemo, useState } from "react";
import { Box, Button, Typography, Link, Stack } from "@mui/material";
import { ShipInfoCell } from "@components/mobilization";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useNavigate } from "react-router";
import { isoToLocalDatetime } from "@/utils/converter";
import Color from "@constants/Color";
import useAllowedRole from "@/hooks/useAllowedRole";
import { useSupplyRequests } from "@/hooks/services/supplyRequest";
import { PageTitle, BaseDataGrid, DetailActionCell } from "@/components/common";

const SupplyRequest = ({ PAGE_SIZE = 6 }) => {
  const navigate = useNavigate();
  const isAdmin = useAllowedRole("ADMIN");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const {
    data: { content: supplyRequests = [], totalElements: totalRequests } = {},
    isLoading,
  } = useSupplyRequests({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
  });

  const columns = useMemo(
    () => [
      {
        field: "detail",
        headerName: "Thông tin thuê",
        flex: 2,
        headerAlign: "center",
        sortable: false,
        renderCell: ({
          row: {
            companyName,
            companyRepresentor,
            companyEmail,
            companyPhone,
            rentalStartDate,
            rentalEndDate,
            detailFile,
          },
        }) => (
          <Stack spacing={0.3}>
            <Typography fontWeight={600} fontSize={14} noWrap>
              Công ty {companyName}
            </Typography>

            {/* Representative */}
            <Typography ml={2} variant="body2" color="text.secondary" noWrap>
              Đại diện {companyRepresentor}
            </Typography>
            <Typography ml={2} variant="body2" color="text.secondary" noWrap>
              Điện thoại: {companyPhone}
            </Typography>
            {/* Email */}
            <Typography ml={2} variant="body2" color="text.secondary" noWrap>
              Email: {companyEmail}
            </Typography>

            {/* Rental time */}
            <Typography fontWeight={600} fontSize={14} noWrap>
              Thời gian thuê
            </Typography>
            <Typography ml={2} variant="body2" color="text.secondary" noWrap>
              Bắt đầu: {isoToLocalDatetime(rentalStartDate)}
            </Typography>
            <Typography ml={2} variant="body2" color="text.secondary" noWrap>
              Kết thúc: {isoToLocalDatetime(rentalEndDate)}
            </Typography>

            {/* Detail link */}
            <Link
              ml={2}
              href={detailFile?.url}
              target="_blank"
              rel="noopener"
              underline="hover"
              variant="caption"
              sx={{ display: "inline-block" }}
            >
              Attach
            </Link>
          </Stack>
        ),
      },
      {
        field: "shipInfo",
        headerName: "Thông tin Tàu",
        flex: 2.5,
        headerAlign: "center",
        sortable: false,
        renderCell: ({ row: { shipInfo = {} } }) => (
          <ShipInfoCell
            imagePublicId={shipInfo.image?.publicId}
            name={shipInfo.name}
            countryCode={shipInfo.countryCode}
            type={shipInfo.type}
            imageUrl={shipInfo.imageUrl}
            description={shipInfo.description}
            IMONumber={shipInfo.imoNumber}
          />
        ),
      },
      {
        field: "view",
        headerName: "Chi tiết",
        headerAlign: "center",
        align: "center",
        sortable: false,
        renderCell: ({ row: { id: requestId } }) => (
          <DetailActionCell
            onClick={() => navigate(`/supply-requests/${requestId}`)}
          />
        ),
      },
    ],
    [], // eslint-disable-line
  );

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
            startIcon={<AddCircleRoundedIcon />}
            onClick={() =>
              navigate("/supply-requests/form", {
                state: {
                  type: "create",
                },
              })
            }
          >
            Tạo yêu cầu cung ứng
          </Button>
        </Box>
      )}

      <BaseDataGrid
        loading={isLoading}
        columns={columns}
        rowCount={totalRequests}
        rows={supplyRequests}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  );
};

export default SupplyRequest;
