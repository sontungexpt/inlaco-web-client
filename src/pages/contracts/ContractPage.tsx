import { useMemo, useState } from "react";
import {
  PageTitle,
  SearchBar,
  InfoTextField,
  DetailActionCell,
} from "@components/common";
import { Box, MenuItem } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { dateToLocaleString } from "@utils/converter";
import { useContracts } from "@/queries/contract.query";

import BaseDataGrid, {
  BaseDataGridColumn,
} from "@/components/common/datagrid/BaseDataGrid";
import BaseDataGridFooter from "@/components/common/datagrid/BaseDataGridFooter";
import { Column } from "react-data-grid";
import { ContractType } from "@/types/api/contract.api";

const useContractPageParams = (): {
  initialPage: number;
  contractType: ContractType;
} => {
  const [searchParams] = useSearchParams();
  const initialPage = searchParams.get("page") || 0;
  const contractType = (searchParams.get("type") ||
    "LABOR_CONTRACT") as ContractType;

  return { initialPage: Number(initialPage), contractType };
};

export type ContractRow = {
  id: string;
  title: string;
  activationDate: string;
  expiredDate: string;
};

type ContractStatus = "SIGNED" | "PENDING";

const STATUS_FILTERS = [
  { label: "Hợp đồng chính thức", value: "SIGNED" },
  { label: "Đang chờ ký kết", value: "PENDING" },
];

export default function ContractPage({ pageSize = 20 }) {
  const navigate = useNavigate();
  const { initialPage = 0, contractType } = useContractPageParams();

  const [status, setStatus] = useState<ContractStatus>("SIGNED");
  const officialContract = status === "SIGNED";

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(initialPage);

  const { data: { content: contracts = [], totalPages = 0 } = {}, isLoading } =
    useContracts({
      page: page,
      pageSize: pageSize,
      filter: {
        signed: officialContract,
        keyword: searchText,
        type: contractType,
      },
    });

  const onContractDetailClick = (id: string) => {
    navigate(`/contracts/${id}`);
  };

  const columns: readonly Column<ContractRow>[] = useMemo(
    () =>
      [
        {
          key: "id",
          name: "ID",
          frozen: true,
        },
        {
          key: "title",
          name: "Tiêu đề",
          frozen: true,
        },
        {
          key: "activationDate",
          name: "Ngày có hiệu lực",
          renderCell: ({ row }) => dateToLocaleString(row.activationDate),
        },
        {
          key: "expiredDate",
          name: "Ngày hết hạn",
          renderCell: ({ row }) => dateToLocaleString(row.expiredDate),
        },
        {
          key: "actions",
          name: "",
          width: 40,
          renderCell: ({ row }) => (
            <DetailActionCell onClick={() => onContractDetailClick(row.id)} />
          ),
        },
      ] as BaseDataGridColumn<ContractRow>[],
    [],
  );

  return (
    <Box m="20px">
      <PageTitle
        title={
          contractType === "LABOR_CONTRACT"
            ? "HỢP ĐỒNG THUYỀN VIÊN"
            : "HỢP ĐỒNG CUNG ỨNG"
        }
        subtitle={
          contractType === "LABOR_CONTRACT"
            ? "Danh sách các hợp đồng thuyền viên"
            : "Danh sách các hợp đồng cung ứng thuyền viên"
        }
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
          my: 1,
        }}
      >
        <SearchBar
          onSearch={(q: string) => setSearchText(q)}
          loading={isLoading}
          minLength={0}
          size="small"
          placeholder="Nhập tên hoặc mã thuyền viên cần tìm kiếm"
        />

        <InfoTextField
          select
          size="small"
          margin="none"
          required
          label="Trạng thái"
          value={status}
          onChange={(e) => setStatus(e.target.value as ContractStatus)}
        >
          {STATUS_FILTERS.map((status, idx) => (
            <MenuItem key={idx} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </InfoTextField>
      </Box>

      <BaseDataGrid<ContractRow>
        loading={isLoading}
        columns={columns}
        globalTooltip="Click hai lần để xem chi tiết hợp đồng"
        onCellDoubleClick={({ row }) => onContractDetailClick(row.id)}
        rows={contracts as ContractRow[]}
        footer={
          <BaseDataGridFooter
            pagination={{
              page: page + 1,
              count: totalPages,
              onChange: (_, page) => setPage(page - 1),
            }}
          />
        }
      />
    </Box>
  );
}
