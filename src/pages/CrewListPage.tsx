import { useState, useMemo, useCallback } from "react";
import { PageTitle, SearchBar, BaseTabBar } from "@components/common";
import { Box } from "@mui/material";

import { useNavigate } from "react-router";

import Color from "@constants/Color";
import { useCrewProfiles } from "@/queries/crew-profile.query";
import BaseDataGrid, {
  BaseDataGridColumn,
} from "@/components/common/datagrid/BaseDataGrid";

import { CrewProfile } from "@/types/api/crew-profile";

import {
  BaseDataGridBar,
  BaseDataGridFooter,
} from "@/components/common/datagrid/components";

export default function CrewListPage({ pageSize = 10 }) {
  const navigate = useNavigate();
  const [official, setOfficial] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const OFFICIAL_TAB_INDEX = 0;

  const { data: { content: crewProfiles = [], totalPages } = {}, isLoading } =
    useCrewProfiles({
      page: page,
      pageSize: pageSize,
      filter: {
        keyword: query,
        official,
      },
    });

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setOfficial(newValue === OFFICIAL_TAB_INDEX);
    },
    [],
  );

  const columns: BaseDataGridColumn<CrewProfile>[] = useMemo(
    () => [
      {
        key: "employeeCardId",
        name: "Mã nhân viên",
      },
      {
        key: "fullName",
        name: "Họ tên",
      },
      {
        key: "gender",
        name: "Giới tính",
        renderCell: ({ row }) =>
          row.gender === "MALE"
            ? "Nam"
            : row.gender === "FEMALE"
              ? "Nữ"
              : "Khác",
      },
      {
        key: "birthDate",
        name: "Ngày sinh",
        type: "date",
      },
      {
        key: "email",
        name: "Email",
      },
      {
        key: "phoneNumber",
        name: "SĐT",
      },
    ],
    [],
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
        variant="fullWidth"
        onChange={handleTabChange}
        color={Color.SecondaryBlue}
        sx={{
          backgroundColor: "inherit",
          marginTop: 4,
        }}
      />
      <BaseDataGrid
        globalTooltip="Click hai lần để xem chi tiết"
        onCellDoubleClick={({ row }) => {
          navigate(`/crews/${row.id}/profile`);
        }}
        footer={
          <BaseDataGridFooter
            pagination={{
              page: page + 1,
              count: totalPages,
              onChange: (_, page) => setPage(page - 1),
            }}
          />
        }
        toolbar={
          <BaseDataGridBar
            sx={{
              backgroundColor: Color.PrimaryWhite,
              my: 2,
            }}
          >
            <SearchBar placeholder="Tìm thuyền viên..." onSearch={setQuery} />
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
          </BaseDataGridBar>
        }
        loading={isLoading}
        rows={crewProfiles}
        columns={columns}
      />
    </Box>
  );
}
