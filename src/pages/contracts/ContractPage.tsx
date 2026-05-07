import { useMemo, useState } from "react";
import {
  PageTitle,
  SearchBar,
  InfoTextField,
  DetailActionCell,
} from "@components/common";
import { Box, Button, MenuItem } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { useContracts } from "@/queries/contract.query";

import BaseDataGrid, {
  BaseDataGridColumn,
} from "@/components/common/datagrid/BaseDataGrid";
import { BaseDataGridFooter } from "@/components/common/datagrid/components";
import { BaseContract, ContractType } from "@/types/api/contract.api";

type ContractStatus = "SIGNED" | "PENDING";

const STATUS_FILTERS: { label: string; value: ContractStatus }[] = [
  { label: "Đang chờ ký kết", value: "PENDING" },
  { label: "Hợp đồng chính thức", value: "SIGNED" },
];

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

  console.log(
    "useContractPageParams",
    initialPage,
    contractType,
    status,
    lockedStatus,
  );

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
  const officialContract = status === "SIGNED";

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(initialPage);

  const { data: { content: contracts = [], totalPages = 0 } = {}, isLoading } =
    useContracts({
      page: page,
      pageSize: pageSize,
      filter: {
        signed: officialContract,
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
        renderCell: ({ row }) => (
          <Button
            disabled={!row.signed}
            size="small"
            variant="contained"
            sx={{
              "&.Mui-disabled": {
                backgroundColor: "#bdbdbd",
                color: "#000",
                opacity: 1,
              },
            }}
            onClick={() => navigate(`/mobilizations/form?contractId=${row.id}`)}
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
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 2,
              my: 1,
            }}
          >
            <SearchBar
              onSearch={setQuery}
              loading={isLoading}
              minQueryLength={0}
              size="small"
              placeholder="Nhập tên hoặc mã thuyền viên cần tìm kiếm"
            />

            <InfoTextField
              select
              size="small"
              margin="none"
              required
              disabled={lockedStatus}
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
