import { useState, useMemo, useCallback } from "react";
import { PageTitle, SearchBar, BaseTabBar } from "@components/common";
import { Box } from "@mui/material";

import { useNavigate } from "react-router";

import Color from "@constants/Color";
import {
  useCrewProfiles,
  useMyMobilizedCrewProfiles,
} from "@/queries/crew-profile.query";
import BaseDataGrid, {
  BaseDataGridColumn,
} from "@/components/common/datagrid/BaseDataGrid";

import { CrewProfile, CrewProfileFetchParams } from "@/types/api/crew-profile";

import {
  BaseDataGridBar,
  BaseDataGridFooter,
} from "@/components/common/datagrid/components";
import UserRole from "@/constants/UserRole";
import { useAuthContext } from "@/contexts/auth.context";

export default function CrewListPage({ pageSize = 10 }) {
  const navigate = useNavigate();
  const [official, setOfficial] = useState(true);
  const [searchQuery, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const OFFICIAL_TAB_INDEX = 0;

  const { includesRole } = useAuthContext();
  const isAdmin = includesRole(UserRole.ADMIN);

  const baseQueryOptions = {
    page: page,
    pageSize: pageSize,
    filter: {
      keyword: searchQuery,
      official,
    },
  } as CrewProfileFetchParams;

  const adminQuery = useCrewProfiles({
    ...baseQueryOptions,
    enabled: isAdmin,
  });

  const myQuery = useMyMobilizedCrewProfiles({
    ...baseQueryOptions,
    filter: {
      ...baseQueryOptions.filter,
      official: true,
    },
    enabled: !isAdmin,
  });

  const activeQuery = isAdmin ? adminQuery : myQuery;

  const { data: { content: crewProfiles = [], totalPages } = {}, isLoading } =
    activeQuery;

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
      {isAdmin ? (
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
      ) : (
        <BaseTabBar
          tabs={[{ label: "Thuyền viên chính thức" }]}
          variant="fullWidth"
          color={Color.SecondaryBlue}
          sx={{
            backgroundColor: "inherit",
            marginTop: 4,
          }}
        />
      )}
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
            <SearchBar
              minQueryLength={0}
              searchAfterClear
              placeholder="Tìm thuyền viên..."
              onSearch={setQuery}
            />
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
