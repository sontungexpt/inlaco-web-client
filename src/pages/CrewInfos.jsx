import React, { useState, useMemo } from "react";
import {
  PageTitle,
  SearchBar,
  BaseTabBar,
  BaseDataGrid,
} from "@components/common";
import { Box, Button, Stack, Toolbar } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";

import { useNavigate } from "react-router";
import { useCrewMembers } from "@/hooks/services/crew";
import { isoToLocaleString } from "@/utils/converter";

import Color from "@constants/Color";
import CandidateStatus from "@/constants/CandidateStatus";

const DataGridToolbar = ({ onAdd, onSearch }) => {
  return (
    <Toolbar
      sx={
        {
          // display: "flex",
          // justifyContent: "space-between",
          // alignItems: "center",
        }
      }
    >
      <SearchBar placeholder="Tìm thuyền viên..." onChange={onSearch} />
      {/* <Button */}
      {/*   variant="contained" */}
      {/*   sx={{ */}
      {/*     backgroundColor: Color.PrimaryGold, */}
      {/*     color: Color.PrimaryBlack, */}
      {/*     borderRadius: 2, */}
      {/*   }} */}
      {/*   onClick={onAdd} */}
      {/*   startIcon={<AddCircleRoundedIcon />} */}
      {/* > */}
      {/*   Thêm thuyền viên */}
      {/* </Button> */}
    </Toolbar>
  );
};

export default function CrewInfos() {
  const navigate = useNavigate();
  const [official, setOfficial] = useState(true);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: { content: crewMembers = [], totalElements: totalCrews } = {},
    isLoading,
  } = useCrewMembers({
    page: paginationModel.page,
    size: paginationModel.pageSize,
    official: official,
  });

  const handleTabChange = (e, newValue) => {
    setOfficial(newValue === 0);
  };

  const columns = useMemo(
    () => [
      {
        field: "fullName",
        headerName: "Họ tên",
        flex: 2,
        align: "center",
      },
      {
        field: "gender",
        headerName: "Giới tính",
        flex: 1,
        align: "center",
        renderCell: ({ value }) =>
          value === "MALE" ? "Nam" : value === "FEMALE" ? "Nữ" : "Khác",
      },
      {
        field: "birthDate",
        headerName: "Ngày sinh",
        flex: 1.5,
        align: "center",
        renderCell: ({ value }) => isoToLocaleString(value, "date"),
      },
      {
        field: "email",
        headerName: "Email",
        flex: 2,
        align: "center",
      },
      {
        field: "phoneNumber",
        headerName: "SĐT",
        flex: 1,
        align: "center",
      },
      {
        field: "actions",
        headerName: "Chi tiết",
        flex: 1.5,
        align: "center",
        sortable: false,
        renderCell: ({ id }) => (
          <Stack direction="row" spacing={1}>
            {!official && (
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  navigate(`/crew-contracts/form/${id}`, {
                    state: {
                      type: "create",
                    },
                  });
                }}
              >
                <AssignmentIndOutlinedIcon fontSize="small" />
              </Button>
            )}
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                navigate(`/crews/${id}`, {
                  state: { official },
                });
              }}
            >
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </Button>
          </Stack>
        ),
      },
    ],
    [navigate, official],
  );

  return (
    <Box m="20px">
      <PageTitle
        title="THÔNG TIN THUYỀN VIÊN"
        subtitle="Danh sách Thuyền viên công ty"
      />
      <BaseTabBar
        tabs={[
          { label: "Thuyền viên chính thức" },
          { label: "Thuyền viên chưa chính thức" },
        ]}
        variant={"fullWidth"}
        onChange={handleTabChange}
        color={Color.SecondaryBlue}
        sx={{
          backgroundColor: Color.SecondaryWhite,
          marginTop: 4,
        }}
      />
      <BaseDataGrid
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnResize
        loading={isLoading}
        rows={crewMembers}
        columns={columns}
        rowCount={totalCrews}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        showToolbar
        slots={{ toolbar: DataGridToolbar }}
        slotProps={{
          toolbar: {
            onAdd: () =>
              navigate("/recruitment", {
                state: {
                  tab: 1,
                  candidate: {
                    status: CandidateStatus.WAIT_FOR_INTERVIEW,
                  },
                },
              }),
          },
        }}
      />
    </Box>
  );
}
