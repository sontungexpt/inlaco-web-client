import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useState } from "react";

export default function AccountProfile() {
  const [form, setForm] = useState({
    username: "Admin",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ px: 5, py: 4 }}>
      {/* Page Header */}
      <Typography variant="h4" fontWeight={600} mb={1}>
        Account Profile
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Manage your account information and password
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {/* Avatar Section */}
      <Grid container spacing={4} alignItems="center" mb={5}>
        <Grid item>
          <Avatar
            sx={{
              width: 110,
              height: 110,
              bgcolor: "grey.400",
            }}
          />
        </Grid>

        <Grid item>
          <Button startIcon={<PhotoCameraIcon />} variant="outlined">
            Change avatar
          </Button>
          <Typography variant="body2" color="text.secondary" mt={1}>
            JPG, PNG up to 2MB
          </Typography>
        </Grid>
      </Grid>

      {/* Account Info */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        Account information
      </Typography>

      <Grid container spacing={3} maxWidth={600}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* Password Section */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        Change password
      </Typography>

      <Grid container spacing={3} maxWidth={600}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="New password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Confirm password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Action */}
      <Box mt={5}>
        <Button variant="contained" size="large" sx={{ minWidth: 200 }}>
          Update profile
        </Button>
      </Box>
    </Box>
  );
}
