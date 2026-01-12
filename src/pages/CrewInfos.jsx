import React, { useState, useMemo } from "react";
import {
  PageTitle,
  SearchBar,
  BaseTabBar,
  BaseDataGrid,
} from "@components/common";
import { Box, Toolbar } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

import { useNavigate } from "react-router";
import { useCrewMembers } from "@/hooks/services/crew";
import { isoToLocaleString } from "@/utils/converter";

import Color from "@constants/Color";
import CandidateStatus from "@/constants/CandidateStatus";
import { GridActionsCellItem } from "@mui/x-data-grid";

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
    filter: {
      official,
    },
  });

  const handleTabChange = (e, newValue) => {
    setOfficial(newValue === 0);
  };

  const columns = useMemo(
    () => [
      {
        field: "fullName",
        flex: 2.5,
        headerName: "Họ tên",
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
        flex: 1,
        headerName: "Ngày sinh",
        align: "center",
        renderCell: ({ value }) => isoToLocaleString(value, "date"),
      },
      {
        flex: 2.5,
        field: "email",
        headerName: "Email",
        align: "center",
      },
      {
        flex: 1,
        field: "phoneNumber",
        headerName: "SĐT",
        align: "center",
      },
      {
        flex: 1,
        field: "actions",
        type: "actions",
        headerName: "Chi tiết",
        sortable: false,
        getActions: ({ row: { id } }) =>
          [
            <GridActionsCellItem
              icon={<MoreVertRoundedIcon />}
              label="Actions"
              showInMenu
            />,
            !official && (
              <GridActionsCellItem
                icon={<AssignmentIndOutlinedIcon fontSize="small" />}
                label="Chi tiết hợp đồng"
                showInMenu
                onClick={() =>
                  navigate(`/crew-contracts/form/${id}`, {
                    state: { type: "create" },
                  })
                }
              />
            ),

            <GridActionsCellItem
              icon={<ArrowForwardIosRoundedIcon fontSize="small" />}
              label="Chi tiết thuyền viên"
              showInMenu
              onClick={() =>
                navigate(`/crews/${id}`, {
                  state: { official },
                })
              }
            />,
          ].filter(Boolean),
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
