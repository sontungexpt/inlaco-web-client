import React from "react";
import { Formik } from "formik";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  InfoTextFieldFormik,
  PageTitle,
  SectionWrapper,
  ImageUploadFieldFormik,
} from "@/components/common";

export default function AccountProfile() {
  const initialValues = {
    username: "Admin",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
    avatar: null,
  };

  const handleFormSubmission = async (values) => {
    console.log("Submit profile:", values);
    // call update profile API here
  };

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={PROFILE_SCHEMA}
      validateOnChange
      onSubmit={handleFormSubmission}
    >
      {({ handleSubmit, isSubmitting, dirty, isValid }) => (
        <Box component="form" onSubmit={handleSubmit} sx={{ px: 5, py: 4 }}>
          {/* Page Header */}
          <PageTitle
            title="Account Profile"
            subtitle="Manage your account information and password"
            mb={3}
          />

          {/* Avatar Section */}
          <SectionWrapper>
            <Grid container spacing={4} alignItems="center">
              <Grid>
                <Avatar
                  sx={{
                    width: 110,
                    height: 110,
                    bgcolor: "grey.400",
                  }}
                />
              </Grid>

              <Grid>
                <ImageUploadFieldFormik
                  name="avatar"
                  label="Change avatar"
                  startIcon={<PhotoCameraIcon />}
                />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  JPG, PNG up to 2MB
                </Typography>
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* Account Information */}
          <SectionWrapper title="Account information">
            <Grid container spacing={3} maxWidth={600}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoTextFieldFormik name="username" label="Username" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoTextFieldFormik name="email" label="Email" type="email" />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* Password Section */}
          <SectionWrapper title="Change password">
            <Grid container spacing={3} maxWidth={600}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoTextFieldFormik
                  name="password"
                  label="New password"
                  type="password"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoTextFieldFormik
                  name="confirmPassword"
                  label="Confirm password"
                  type="password"
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* Actions */}
          <Box mt={4}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ minWidth: 200 }}
              disabled={!dirty || !isValid || isSubmitting}
            >
              Update profile
            </Button>
          </Box>
        </Box>
      )}
    </Formik>
  );
}
