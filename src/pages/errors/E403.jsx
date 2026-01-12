import { Box, Button, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router";

export default function E403() {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="70vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={2}
    >
      <LockOutlinedIcon sx={{ fontSize: 72, color: "error.main", mb: 2 }} />

      <Typography variant="h4" fontWeight={600} gutterBottom>
        Access Denied
      </Typography>

      <Typography variant="body1" color="text.secondary" maxWidth={420} mb={4}>
        You don’t have permission to access this page. Please contact your
        administrator or return to a safe page.
      </Typography>

      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go Home
        </Button>

        <Button variant="outlined" color="error" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    </Box>
  );
}
