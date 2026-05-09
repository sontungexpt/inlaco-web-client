import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import { GridColDef } from "@mui/x-data-grid";
import SearchBar from "@/components/common/SearchBar";
import PageTitle from "@/components/common/PageTitle";
import BaseDataGridOld from "@/components/common/datagrid/mui/BaseDataGridOld";

interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const USERS: UserRow[] = [
  {
    id: 1,
    name: "Trần Văn A",
    email: "trv.a@inlaco.vn",
    phone: "0901 234 567",
    role: "Thuyền viên",
  },
  {
    id: 2,
    name: "Nguyễn Thị B",
    email: "nt.b@inlaco.vn",
    phone: "0912 345 678",
    role: "Nhân viên",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "lvc@inlaco.vn",
    phone: "0923 456 789",
    role: "Quản lý",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "pt.d@inlaco.vn",
    phone: "0934 567 890",
    role: "Thuyền viên",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hve@inlaco.vn",
    phone: "0945 678 901",
    role: "Kỹ thuật",
  },
];

const UserKioskPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [selectedAction, setSelectedAction] = useState<"checkin" | "checkout">(
    "checkin",
  );

  const filteredUsers = useMemo(() => {
    if (!searchValue.trim()) {
      return USERS;
    }

    const term = searchValue.trim().toLowerCase();
    return USERS.filter((user) =>
      [user.name, user.email, user.phone, user.role]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [searchValue]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
      return;
    }

    await document.documentElement.requestFullscreen?.();
  };

  const handleOpenQr = (
    user: UserRow,
    action: "checkin" | "checkout",
  ) => {
    setSelectedUser(user);
    setSelectedAction(action);
    setQrOpen(true);
  };

  const handleCloseQr = () => {
    setQrOpen(false);
    setSelectedUser(null);
  };

  const qrValue = selectedUser
    ? `user:${selectedUser.id}|action:${selectedAction}|name:${selectedUser.name}`
    : "";

  const columns = [
    {
      field: "name",
      headerName: "Họ tên",
      flex: 1.3,
      minWidth: 200,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.6,
      minWidth: 220,
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "role",
      headerName: "Vai trò",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "actions",
      headerName: "Hành động",
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1.4,
      minWidth: 240,
      renderCell: ({ row }: any) => (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => handleOpenQr(row, "checkin")}
          >
            Check in
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleOpenQr(row, "checkout")}
          >
            Check out
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <PageTitle
        title="Danh sách người dùng"
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          mt: 3,
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 260, flex: 1 }}>
          <SearchBar
            value={searchValue}
            onChange={(_, value) => setSearchValue(value)}
            placeholder="Tìm kiếm người dùng..."
            size="small"
          />
        </Box>

       
      </Box>

      <Box mt={3} sx={{ width: "100%", minHeight: 520 }}>
        <BaseDataGridOld
          rows={filteredUsers}
          columns={columns as GridColDef[]}
          pageSizeOptions={[5, 10, 20] as const}
          loading={false}
          autoHeight
        />
      </Box>

      <Dialog open={qrOpen} onClose={handleCloseQr} fullWidth maxWidth="xs">
        <DialogTitle>
          {selectedAction === "checkin" ? "Check in" : "Check out"} - {selectedUser?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box
                component="img"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
                  qrValue,
                )}`}
                alt="QR code"
                sx={{ width: 280, height: 280, maxWidth: "100%" }}
              />
            </Box>
            <Typography variant="body2" color="textSecondary">
              Quét mã QR để hoàn tất {selectedAction === "checkin" ? "check in" : "check out"}.
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              {selectedUser?.email} • {selectedUser?.phone}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQr} variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserKioskPage;
