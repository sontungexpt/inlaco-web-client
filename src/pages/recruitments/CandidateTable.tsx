import {
  Box,
  Button,
  Select,
  MenuItem,
  PaginationProps,
  IconButton,
} from "@mui/material";
import Color from "@constants/Color";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CandidateStatus from "@/constants/CandidateStatus";
import { BaseDataGrid } from "@/components/common";
import { Column } from "react-data-grid";
import { useMemo } from "react";
import DataGridPaginationFooter from "@/components/common/datagrid/DataGridPaginationFooter";
import { RGBColumn } from "@/components/common/datagrid/BaseDataGrid";

const STATUS_FILTERS = [
  { label: "Đã nộp hồ sơ", value: CandidateStatus.APPLIED },
  { label: "Đang sàng lọc", value: CandidateStatus.SCREENING },
  {
    label: "Đã lên lịch phỏng vấn",
    value: CandidateStatus.INTERVIEW_SCHEDULED,
  },
  { label: "Đã phỏng vấn", value: CandidateStatus.INTERVIEWED },
  { label: "Đã gửi offer", value: CandidateStatus.OFFERED },
  { label: "Ứng viên xác nhận", value: CandidateStatus.CONFIRMED },
  {
    label: "Hợp đồng chưa kí",
    value: CandidateStatus.CONTRACT_PENDING_SIGNATURE,
  },
  { label: "Hợp đồng đã kí", value: CandidateStatus.CONTRACT_SIGNED },
  { label: "Hợp đồng có hiệu lực", value: CandidateStatus.HIRED },
  { label: "Từ chối", value: CandidateStatus.REJECTED },
  { label: "Ứng viên rút hồ sơ", value: CandidateStatus.WITHDRAWN },
];

const CandidateTableFooter = ({
  pagination,
  filterStatus,
  onFilterStatusChange,
  ...props
}: {
  pagination?: PaginationProps;
  filterStatus?: CandidateStatus;
  onFilterStatusChange?: (status: CandidateStatus) => void;
}) => {
  return (
    <DataGridPaginationFooter
      {...props}
      leftCompoent={
        <Select<CandidateStatus>
          size="small"
          value={filterStatus}
          onChange={(e) => onFilterStatusChange?.(e.target.value)}
          sx={{
            color: Color.PrimaryWhite,

            // Remove border
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          {STATUS_FILTERS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      }
    />
  );
};

export type CandidateTableProps = {
  candidates: any[];
  loading?: boolean;

  pagination?: PaginationProps;

  filterStatus?: CandidateStatus;
  onFilterStatusChange?: (status: CandidateStatus) => void;

  onDetailClick?: (id: string) => void;
};

export type CandidateRow = {
  id: string;
  fullName: string;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  email: string;
  phoneNumber: string;
};

export default function CandidateTable({
  candidates,
  pagination,

  loading = false,

  filterStatus,
  onFilterStatusChange,

  onDetailClick,
}: CandidateTableProps) {
  const columns: Column<CandidateRow>[] = useMemo(
    () =>
      [
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
          key: "email",
          name: "Email",
        },
        {
          key: "phoneNumber",
          name: "Số điện thoại",
        },
        {
          key: "languageSkills",
          name: "Ngoại ngữ",
        },
        {
          key: "address",
          name: "Địa chỉ",
        },
        {
          key: "actions",
          name: "",
          width: 40,
          renderCell: ({ row }) => (
            <IconButton
              size="small"
              onClick={() => onDetailClick?.(row.id)}
              sx={{
                color: Color.PrimaryBlue,
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </IconButton>
          ),
        },
      ] as Column<CandidateRow>[],
    [],
  );

  return (
    <BaseDataGrid<CandidateRow>
      loading={loading}
      rows={candidates}
      columns={columns}
      defaultColumnOptions={{}}
      skeletonCount={5}
      globalTooltip="Click hai lần để xem chi tiết ứng viên"
      onCellDoubleClick={({ row }) => onDetailClick?.(row?.id)}
      footer={
        <CandidateTableFooter
          pagination={pagination}
          filterStatus={filterStatus}
          onFilterStatusChange={onFilterStatusChange}
        />
      }
    />
  );
}
