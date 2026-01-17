import React, {} from "react";
import { Grid, Box, Stack } from "@mui/material";
import PageTitle from "@components/common/PageTitle";
import CenterCircularProgress from "@components/common/CenterCircularProgress";
import { dateToLocaleString } from "@utils/converter";
import { CloudinaryImage, InfoItem, SectionWrapper } from "@/components/common";
import Color from "@constants/Color";
import { useCrewProfile } from "@/hooks/services/crew";
import { useParams } from "react-router";

export default function CrewProfile() {
  const { crewId = "me" } = useParams();

  const { data: profile, isLoading } = useCrewProfile(crewId);

  if (isLoading) return <CenterCircularProgress />;

  return (
    <Box m={2}>
      {/* Header */}
      <PageTitle
        mb={3}
        title="Hồ Sơ Thuyền Viên"
        subtitle={`Mã thuyền viên: ${profile?.cardId || "-"}`}
      />

      {/* PERSONAL INFO */}
      <SectionWrapper title="Thông tin cá nhân">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <CloudinaryImage
              avatar
              src={profile?.avatarUrl}
              sx={{
                borderRadius: "50%",
                border: `2px solid primary`,
              }}
            />
          </Grid>
          <Grid container size={{ xs: 12, md: 9 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem label="Họ và tên" value={profile?.fullName} bold />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem
                label="Ngày sinh"
                type="date"
                value={profile?.birthDate}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem label="Giới tính" value={profile?.gender} highlight />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem label="Số điện thoại" value={profile?.phoneNumber} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem label="Email" value={profile?.email} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem label="Địa chỉ" value={profile?.address} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem
                label="Trình độ ngoại ngữ"
                value={profile?.languageSkills?.[0]}
              />
            </Grid>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* JOB INFO */}
      <SectionWrapper title="Thông tin công việc">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label="Vị trí chuyên môn"
              value={profile?.professionalPosition}
              bold
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label="Số năm kinh nghiệm"
              value={
                profile?.experience?.[0] ? `${profile?.experience[0]} năm` : "-"
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label="Bằng cấp chuyên môn"
              value={profile?.expertiseLevels?.[0]}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* INSURANCE INFO */}
      <SectionWrapper title="Thông tin bảo hiểm">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem label="Mã số BHXH" value={profile?.socialInsuranceCode} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label="Mã số BHTN"
              value={profile?.accidentInsuranceCode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem label="Mã số BHYT" value={profile?.healthInsuranceCode} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <InfoItem
              label="Nơi đăng ký khám chữa bệnh"
              value={profile?.healthInsHospital}
            />
          </Grid>
        </Grid>
      </SectionWrapper>
    </Box>
  );
}
