import React, { useState } from "react";
import { PageTitle, DetailActionCell, BaseDataGrid } from "@components/common";
import { Box, Button, Typography, Stack } from "@mui/material";
import { ShipInfoCell } from "@/components/mobilization";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useLocation, useNavigate } from "react-router";
import Color from "@constants/Color";
import { dateToLocaleString } from "@/utils/converter";
import { useMobilizations } from "@/hooks/services/mobilization";

const Mobilization = ({ pageSize = 10 }) => {
  const navigate = useNavigate();
  const { initialPage = 0 } = useLocation().state || {};
  const [paginationModel, setPaginationModel] = useState({
    page: initialPage || 0,
    pageSize: pageSize,
  });

  const { data: { content: mobilizations } = {}, isLoading } = useMobilizations(
    {
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      filter: {},
    },
  );

  const columns = [
    {
      field: "partnerInfo",
      headerName: "Thông tin Công ty",
      sortable: false,
      flex: 2,
      headerAlign: "center",
      renderCell: ({
        row: {
          partnerName,
          partnerPhone,
          partnerEmail,
          partnerAddress,
          startDate,
          estimatedEndDate,
        } = {},
      }) => (
        <Stack spacing={0.3} minWidth={0}>
          <Typography fontWeight={600} fontSize={14} noWrap>
            Công ty {partnerName}
          </Typography>

          {/* Representative */}
          <Typography ml={2} variant="body2" color="text.secondary" noWrap>
            Điện thoại: {partnerPhone}
          </Typography>
          <Typography ml={2} variant="body2" color="text.secondary" noWrap>
            Email: {partnerEmail}
          </Typography>
          <Typography ml={2} variant="body2" color="text.secondary" noWrap>
            Địa chỉ: {partnerAddress}
          </Typography>

          {/* Rental time */}
          <Typography fontWeight={600} fontSize={14} noWrap>
            Thời gian thuê
          </Typography>
          <Typography ml={2} variant="body2" color="text.secondary" noWrap>
            Bắt đầu: {dateToLocaleString(startDate)}
          </Typography>
          <Typography ml={2} variant="body2" color="text.secondary" noWrap>
            Kết thúc: {dateToLocaleString(estimatedEndDate)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "shipInfo",
      headerName: "Thông tin Tàu",
      sortable: false,
      flex: 3,
      headerAlign: "center",
      renderCell: ({
        row: {
          shipInfo: { imoNumber, name, countryISO, type, image } = {},
        } = {},
      }) => {
        return (
          <ShipInfoCell
            imoNumber={imoNumber}
            name={name}
            countryCode={countryISO}
            type={type}
            imagePublicId={image?.publicId}
            imageUrl={image?.url}
          />
        );
      },
    },
    {
      field: "detail",
      headerName: "Chi tiết",
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: ({ row: { id } }) => {
        return (
          <DetailActionCell onClick={() => navigate(`/mobilizations/${id}`)} />
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <PageTitle
        title="LỊCH ĐIỀU ĐỘNG"
        subtitle={"Thông tin các điều động đã tạo"}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          paddingBottom: 2,
          justifyContent: "end",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: Color.PrimaryGold,
            color: Color.PrimaryBlack,
            borderRadius: 2,
          }}
          startIcon={<AddCircleRoundedIcon />}
          onClick={() =>
            navigate("/mobilizations/form", {
              state: {
                type: "create",
              },
            })
          }
        >
          Tạo điều động
        </Button>
      </Box>
      <BaseDataGrid
        rows={mobilizations}
        loading={isLoading}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  );
};

export default Mobilization;
