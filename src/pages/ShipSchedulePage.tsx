import { useMemo, useState } from "react";

import { Box, Button, Chip } from "@mui/material";

import { type Column } from "react-data-grid";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

import { useNavigate } from "react-router";

import Color from "@constants/Color";

import { PageTitle, SectionWrapper } from "@components/common";

import BaseDataGrid from "@/components/common/datagrid/BaseDataGrid";

import { BaseDataGridFooter } from "@/components/common/datagrid/components";

import {
  ScheduleStatus,
  ShipScheduleResponse,
} from "@/types/api/ship-schedule.api";
import { useShipSchedules } from "@/queries/ship-schedule.query";

const statusColorMap: Record<
  ScheduleStatus,
  "default" | "warning" | "success" | "error" | "info"
> = {
  DRAFT: "default",
  PLANNED: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "error",
};

const statusLabelMap: Record<ScheduleStatus, string> = {
  DRAFT: "Nháp",
  PLANNED: "Đã lên kế hoạch",
  IN_PROGRESS: "Đang chạy",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã huỷ",
};

const ShipSchedulePage = ({ pageSize = 10 }) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const { data: { content: schedules = [], totalPages = 0 } = {}, isLoading } =
    useShipSchedules({
      page,
      pageSize,
      filter: {},
    });

  const columns: Column<ShipScheduleResponse>[] = useMemo(
    () =>
      [
        {
          key: "id",
          name: "ID",
        },

        {
          key: "shipInfo.imoNumber",
          name: "IMO",
        },

        {
          key: "shipInfo.name",
          name: "Tên tàu",
        },

        {
          key: "shipInfo.countryISO",
          name: "Quốc tịch",
        },

        {
          key: "shipInfo.type",
          name: "Loại tàu",
        },

        {
          key: "departurePort",
          name: "Cảng đi",
        },

        {
          key: "arrivalPort",
          name: "Cảng đến",
        },

        {
          key: "departureTime",
          name: "Khởi hành",
          type: "datetime",
        },

        {
          key: "arrivalTime",
          name: "Cập cảng",
          type: "datetime",
        },

        {
          key: "status",
          name: "Trạng thái",
          renderCell: ({ row }) => (
            <Chip
              size="small"
              label={statusLabelMap[row.status] ?? row.status}
              color={statusColorMap[row.status] ?? "default"}
            />
          ),
        },

        {
          key: "createdAt",
          name: "Ngày tạo",
          type: "datetime",
        },
      ] as Column<ShipScheduleResponse>[],
    [],
  );

  return (
    <Box m="20px">
      <SectionWrapper>
        <PageTitle title="LỊCH TRÌNH TÀU" subtitle="Danh sách lịch trình tàu" />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            mt: 2,
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddCircleRoundedIcon />}
            sx={{
              backgroundColor: Color.PrimaryGold,
              color: Color.PrimaryBlack,
              borderRadius: 2,
            }}
            onClick={() => navigate("/ship-schedules/form")}
          >
            Tạo lịch tàu
          </Button>
        </Box>
      </SectionWrapper>

      <BaseDataGrid<ShipScheduleResponse>
        rowKeyGetter={(row) => row.id}
        loading={isLoading}
        rows={schedules}
        columns={columns}
        globalTooltip="Click hai lần để xem chi tiết"
        onCellDoubleClick={({ row }) => {
          navigate(`/ship-schedules/${row.id}`);
        }}
        footer={
          <BaseDataGridFooter
            pagination={{
              page: page + 1,
              count: totalPages,
              onChange(_, page) {
                setPage(page - 1);
              },
            }}
          />
        }
      />
    </Box>
  );
};

export default ShipSchedulePage;
