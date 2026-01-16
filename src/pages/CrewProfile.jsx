import React, { useEffect, useState } from "react";
import { Grid, Box, Avatar, Stack } from "@mui/material";
import PageTitle from "@components/common/PageTitle";
import CenterCircularProgress from "@components/common/CenterCircularProgress";
import HttpStatusCode from "../constants/HttpStatusCode";
import { getProfileCurrentCrewMemberAPI } from "../services/crewServices";
import { isoToLocaleString } from "../utils/converter";
import { CloudinaryImage, InfoItem, SectionWrapper } from "@/components/common";
import Color from "@constants/Color";

export default function CrewProfile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getProfileCurrentCrewMemberAPI();
        if (res.status === HttpStatusCode.OK) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <CenterCircularProgress />;

  return (
    <Box m={2}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle
          title="HỒ SƠ THUYỀN VIÊN"
          subtitle={`Mã thuyền viên: ${profile?.cardId || "-"}`}
        />

        <CloudinaryImage
          avatar
          src={profile?.avatarUrl}
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: `2px solid ${Color.Primary}`,
          }}
        />
      </Stack>

      {/* PERSONAL INFO */}
      <SectionWrapper title="Thông tin cá nhân">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem label="Họ và tên" value={profile?.fullName} bold />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label="Ngày sinh"
              value={
                profile?.birthDate ?? isoToLocaleString(profile?.birthDate)
              }
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
