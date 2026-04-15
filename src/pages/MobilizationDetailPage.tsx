import { useNavigate, useParams } from "react-router";
import { useMemo } from "react";

import { Box, Button, Grid, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";

import Color from "@/constants/Color";
import { useMobilization } from "@/queries/mobilization.query";

import UserRole from "@/constants/UserRole";

import {
  SectionWrapper,
  PageTitle,
  CloudinaryImage,
  InfoItem,
  BaseDataGrid,
} from "@/components/common";
import { useAllowedRole } from "@/contexts/auth.context";

export default function MobilizationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const { data: mobilization, isLoading } = useMobilization(id);
  const shipInfo = mobilization?.shipInfo;

  const columns = useMemo(
    () => [
      // {
      //   key: "id",
      //   name: "ID",
      // },
      {
        key: "employeeCardId",
        name: "Mã nhân viên",
      },
      {
        key: "fullName",
        name: "Họ và tên",
      },
      {
        key: "rankOnBoard",
        name: "Chức danh",
      },
      {
        key: "phoneNumber",
        name: "SĐT",
      },
      {
        key: "email",
        name: "Email",
      },
      {
        key: "gender",
        name: "Giới tính",
      },
    ],
    [],
  );

  return (
    <Box m={3}>
      {/* ================= HEADER ================= */}
      <SectionWrapper>
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
              onClick={() => {
                console.warn("Not implemented yet");
              }}
            >
              Chỉnh sửa
            </Button>

            <Button
              onClick={() => {
                console.warn("Not implemented yet");
              }}
              startIcon={<FileDownloadRoundedIcon />}
              variant="outlined"
            >
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
              value={mobilization?.partnerName}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label="Email công ty"
              value={mobilization?.partnerEmail}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <InfoItem label="SĐT công ty" value={mobilization?.partnerPhone} />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= LỊCH TRÌNH ================= */}
      <SectionWrapper title="Lịch trình dự kiến">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoItem
              label="Thời gian bắt đầu"
              type="datetime-local"
              value={mobilization?.startDate}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoItem
              label="Thời gian kết thúc"
              type="datetime-local"
              value={mobilization?.endDate}
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
            <InfoItem label="IMO" value={shipInfo?.imoNumber} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <InfoItem label="Tên tàu" value={shipInfo?.name} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <InfoItem label="Quốc tịch" value={shipInfo?.countryISO} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <InfoItem label="Loại tàu" value={shipInfo?.type} />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= CREW LIST ================= */}
      <SectionWrapper title="Danh sách thuyền viên được điều động">
        <BaseDataGrid
          loading={isLoading}
          rows={mobilization?.crews || []}
          columns={columns}
          globalTooltip="Click hai lần để xem chi tiết"
          onCellDoubleClick={({ row }) => {
            navigate(`/crews/${row.id}/profile`);
          }}
        />
      </SectionWrapper>
    </Box>
  );
}
