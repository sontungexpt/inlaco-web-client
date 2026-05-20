import { useMemo, useState } from "react";
import { PageTitle, SearchBar } from "@components/common";
import { Box, Button, Chip } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { useContracts } from "@/queries/contract.query";

import BaseDataGrid, {
  BaseDataGridColumn,
} from "@/components/common/datagrid/BaseDataGrid";
import { BaseDataGridFooter } from "@/components/common/datagrid/components";
import {
  BaseContract,
  ContractType,
  FilterOptions,
} from "@/types/api/contract.api";

type ContractStatus = "SIGNED" | "PENDING" | "ACTIVE" | "SIGNED_OR_ACTIVE";

const STATUS_FILTERS: { label: string; value: ContractStatus }[] = [
  { label: "Đang chờ ký kết", value: "PENDING" },
  { label: "Hợp đồng chính thức (Đã kí)", value: "SIGNED" },
  { label: "Hợp đồng có hiệu lực", value: "ACTIVE" },
  {
    label: "Hợp đồng đã kí hoặc có hiệu lực",
    value: "SIGNED_OR_ACTIVE",
  },
];

const STATUS_FILTER_MAP = {
  PENDING: { signed: false },
  SIGNED: { signed: true },
  ACTIVE: { active: true },
  SIGNED_OR_ACTIVE: { includedStatuses: ["SIGNED", "ACTIVE"] },
} as Record<ContractStatus, Partial<FilterOptions>>;

const buildStatusFilter = (status?: ContractStatus): Partial<FilterOptions> => {
  if (!status) return {};
  return STATUS_FILTER_MAP[status] ?? {};
};

const useContractPageParams = (): {
  initialPage: number;
  contractType: ContractType;

  status: ContractStatus;
  lockedStatus?: boolean;
} => {
  const [searchParams] = useSearchParams();
  const initialPage = searchParams.get("page") || 0;
  const contractType = (searchParams.get("type") ||
    "LABOR_CONTRACT") as ContractType;
  const status = (searchParams.get("status") ||
    STATUS_FILTERS[0].value) as ContractStatus;
  const lockedStatus = !!searchParams.get("lockedStatus");

  return {
    initialPage: Number(initialPage),
    contractType,
    status,
    lockedStatus,
  };
};

export default function ContractPage({ pageSize = 20 }) {
  const navigate = useNavigate();
  const {
    initialPage = 0,
    contractType,
    status: initialStatus,
    lockedStatus,
  } = useContractPageParams();

  const [status, setStatus] = useState<ContractStatus>(initialStatus);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(initialPage);

  const { data: { content: contracts = [], totalPages = 0 } = {}, isLoading } =
    useContracts({
      page: page,
      pageSize: pageSize,
      filter: {
        ...buildStatusFilter(status),
        keyword: query,
        type: contractType,
      },
    });

  const onContractDetailClick = (id: string) => {
    navigate(`/contracts/${id}`);
  };

  const columns: readonly BaseDataGridColumn<BaseContract>[] = useMemo(() => {
    const cols = [
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
        type: "datetime",
      },
      {
        key: "expiredDate",
        name: "Ngày hết hạn",
        type: "datetime",
      },
    ] as BaseDataGridColumn<BaseContract>[];

    if (contractType === "SUPPLY_CONTRACT") {
      cols.push({
        key: "actions",
        name: "Thao tác",
        width: 100,
        toolTip: "Click để tạo điều động",
        renderCell: ({ row: contract }) => (
          <Button
            disabled={
              contract.status !== "SIGNED" && contract.status !== "ACTIVE"
            }
            size="small"
            variant="contained"
            sx={{
              "&.Mui-disabled": {
                backgroundColor: "#bdbdbd",
                color: "#000",
                opacity: 1,
              },
            }}
            onClick={() =>
              navigate(`/mobilizations/form?contractId=${contract.id}`)
            }
          >
            Điều động
          </Button>
        ),
      });
    }

    return cols;
  }, [contractType]);

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

      <BaseDataGrid<BaseContract>
        key={contractType}
        loading={isLoading}
        columns={columns}
        globalTooltip="Click hai lần để xem chi tiết hợp đồng"
        onCellDoubleClick={({ row }) => onContractDetailClick(row.id)}
        rowKeyGetter={({ id }) => id}
        rows={contracts}
        toolbar={
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
              my: 1,
              minWidth: 0,
            }}
          >
            <Box sx={{ flex: "1 1 320px", minWidth: 0 }}>
              <SearchBar
                onSearch={setQuery}
                loading={isLoading}
                minQueryLength={0}
                size="small"
                placeholder="Nhập tên hoặc mã thuyền viên cần tìm kiếm"
              />
            </Box>

            <Box
              role="group"
              aria-label="Lọc trạng thái hợp đồng"
              sx={{
                display: "flex",
                gap: 1,
                maxWidth: { xs: "100%", md: 560 },
                overflowX: "auto",
                overflowY: "hidden",
                pb: 0.5,
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  borderRadius: 999,
                  backgroundColor: "rgba(0,0,0,0.22)",
                },
              }}
            >
              {STATUS_FILTERS.map((item) => {
                const selected = status === item.value;

                return (
                  <Chip
                    key={item.value}
                    label={item.label}
                    color={selected ? "primary" : "default"}
                    variant={selected ? "filled" : "outlined"}
                    disabled={lockedStatus}
                    onClick={() => setStatus(item.value)}
                    sx={{
                      flexShrink: 0,
                      fontWeight: selected ? 700 : 500,
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        }
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
