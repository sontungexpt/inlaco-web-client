import React, { useMemo, useState } from "react";
import { Box, Button, Grid, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { useParams } from "react-router";

import Color from "@/constants/Color";
import { dateToLocaleString } from "@/utils/converter";
import { useMobilization } from "@/hooks/services/mobilization";
import useAllowedRole from "@/hooks/useAllowedRole";
import UserRole from "@/constants/UserRole";

import {
  SectionWrapper,
  PageTitle,
  CloudinaryImage,
  BaseDataGrid,
  InfoItem,
} from "@/components/common";
import CenterCircularProgress from "@/components/common/CenterCircularProgress";

export default function MobilizationDetail() {
  const { id } = useParams();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data: mobilization = {}, isLoading } = useMobilization(id);
  const shipInfo = mobilization.shipInfo || {};

  const columns = useMemo(
    () => [
      {
        field: "fullName",
        headerName: "Họ và tên",
        flex: 2,
        align: "left",
      },
      {
        field: "cardId",
        headerName: "Mã thẻ",
        flex: 1.2,
        align: "center",
      },
      {
        field: "phoneNumber",
        headerName: "SĐT",
        flex: 1.3,
        align: "center",
      },
      {
        field: "email",
        headerName: "Email",
        flex: 2,
        renderCell: (params) => params?.value ?? "—",
      },
      {
        field: "gender",
        headerName: "Giới tính",
        flex: 1,
        align: "center",
        renderCell: (params) => {
          if (!params?.value) return "—";
          return params.value === "MALE" ? "Nam" : "Nữ";
        },
      },
      {
        field: "professionalPosition",
        headerName: "Chức danh",
        flex: 1.5,
        renderCell: (params) => params?.value ?? "—",
      },
    ],
    [],
  );

  if (isLoading) {
    return <CenterCircularProgress />;
  }
  return (
    <Box m={3}>
      {/* ================= HEADER ================= */}
      <SectionWrapper
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
        mb={2}
      >
        <PageTitle
          title="CHI TIẾT ĐIỀU ĐỘNG"
          subtitle="Thông tin chi tiết của điều động"
        />

        {isAdmin && (
          <Stack mt={2} direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              sx={{
                backgroundColor: Color.PrimaryGold,
                color: Color.PrimaryBlack,
              }}
            >
              Chỉnh sửa
            </Button>

            <Button startIcon={<FileDownloadRoundedIcon />} variant="outlined">
              Excel
            </Button>
          </Stack>
        )}
      </SectionWrapper>

      {/* ================= THÔNG TIN CHUNG ================= */}
      <SectionWrapper title="Thông tin chung">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <InfoItem
              label="Công ty điều động đến"
              value={mobilization.partnerName}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem label="Email công ty" value={mobilization.partnerEmail} />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <InfoItem label="SĐT công ty" value={mobilization.partnerPhone} />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= LỊCH TRÌNH ================= */}
      <SectionWrapper title="Lịch trình dự kiến">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoItem
              label="Thời gian bắt đầu"
              value={dateToLocaleString(mobilization.startDate)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoItem
              label="Thời gian kết thúc"
              value={dateToLocaleString(mobilization.estimatedEndDate)}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= THÔNG TIN TÀU ================= */}
      <SectionWrapper title="Thông tin tàu">
        <Grid container spacing={3}>
          {/* Ship image */}
          <Grid size={{ xs: 12 }} display="flex" justifyContent="center">
            <CloudinaryImage
              publicId={shipInfo?.image?.publicId}
              src={shipInfo?.image?.url}
              alt="Ship"
              style={{
                width: "100%",
                maxWidth: 360,
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <InfoItem label="IMO" value={shipInfo.imoNumber} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <InfoItem label="Tên tàu" value={shipInfo.name} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <InfoItem label="Quốc tịch" value={shipInfo.countryISO} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <InfoItem label="Loại tàu" value={shipInfo.type} />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= CREW LIST ================= */}
      <SectionWrapper title="Danh sách thuyền viên được điều động">
        <BaseDataGrid
          rows={mobilization.crewMembers || []}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          autoHeight
        />
      </SectionWrapper>
    </Box>
  );
}
