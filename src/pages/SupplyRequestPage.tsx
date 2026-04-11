import { useMemo, useState } from "react";
import { Box, Button, Typography, Link, Stack } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useNavigate } from "react-router";
import { dateToLocaleString } from "@/utils/converter";
import Color from "@constants/Color";
import useAllowedRole from "@/hooks/useAllowedRole";
import { useSupplyRequests } from "@/queries/supply-request.query";
import {
  PageTitle,
  DetailActionCell,
  BaseDataGrid,
  CloudinaryImage,
  SectionWrapper,
} from "@/components/common";
import { Column } from "react-data-grid";
import { SupplyRequest } from "@/types/api/supply-request.api";
import CountryCodes from "@/constants/CountryCodes";
import BaseDataGridFooter from "@/components/common/datagrid/BaseDataGridFooter";

export default function SupplyRequestPage({ pageSize = 6 }) {
  const navigate = useNavigate();
  const isAdmin = useAllowedRole("ADMIN");
  const [page, setPage] = useState(0);

  const {
    data: { content: supplyRequests = [], totalPages = 0 } = {},
    isLoading,
  } = useSupplyRequests({
    page: page,
    pageSize: pageSize,
    filter: {
      // keyword: "",
      // status:
    },
  });

  const navigateToDetail = (id: string) => {
    navigate(`/supply-requests/${id}`);
  };

  const navigateToForm = () => {
    navigate("/supply-requests/form?formType=create");
  };

  const columns: readonly Column<SupplyRequest>[] = useMemo(
    () =>
      [
        {
          key: "companyName",
          name: "Tên công ty",
        },
        {
          key: "companyRepresentor",
          name: "Đại diện",
        },
        {
          key: "companyContact",
          name: "Liên hệ",
          renderCell: ({ row }) => (
            <Stack>
              <Typography variant="body2" color="text.secondary" noWrap>
                Điện thoại: {row.companyPhone}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                Email: {row.companyEmail}
              </Typography>
            </Stack>
          ),
        },
        {
          key: "rentalTime",
          name: "Thời gian thuê",
          renderCell: ({ row }) => (
            <Stack>
              <Typography variant="body2">
                Bắt đầu: {dateToLocaleString(row.rentalStartDate)}
              </Typography>
              <Typography variant="body2">
                Kết thúc: {dateToLocaleString(row.rentalEndDate)}
              </Typography>
            </Stack>
          ),
        },
        {
          key: "detailFile",
          name: "Chi tiết",
          renderCell: ({ row }) => (
            <Link href={row.detailFile?.url} target="_blank">
              Attach
            </Link>
          ),
        },
        {
          key: "shipInfo.image",
          name: "Ảnh tàu",
          renderCell: ({ row }) => (
            <CloudinaryImage publicId={row.shipInfo.image?.publicId} />
          ),
        },
        {
          key: "shipInfo.countryISO",
          name: "Quốc tịch",
          renderCell: ({ row }) =>
            CountryCodes.find((c) => row.shipInfo.countryISO === c.code)?.name,
        },
        {
          key: "shipInfo.name",
          name: "Tên tàu",
        },
        {
          key: "shipInfo.imoNumber",
          name: "Số IMO",
        },
        {
          key: "shipInfo.type",
          name: "Loại tàu",
        },
        {
          key: "shipInfo.description",
          name: "Mô tả tàu",
        },
        {
          key: "action",
          name: "",
          width: 40,
          renderCell: ({ row }) => (
            <DetailActionCell
              onClick={() => {
                navigateToDetail(row.id);
              }}
            />
          ),
        },
      ] as readonly Column<SupplyRequest>[],
    [],
  );

  return (
    <Box p="20px">
      <SectionWrapper>
        <PageTitle
          title="YÊU CẦU CUNG ỨNG"
          subtitle="Danh sách các yêu cầu cung ứng thuyền viên"
        />

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: Color.PrimaryGold,
              color: Color.PrimaryBlack,
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
            startIcon={<AddCircleRoundedIcon />}
            onClick={navigateToForm}
          >
            Tạo yêu cầu cung ứng
          </Button>
        </Box>
      </SectionWrapper>

      <BaseDataGrid<SupplyRequest>
        style={{ marginTop: "20px" }}
        loading={isLoading}
        columns={columns}
        rows={supplyRequests}
        globalTooltip="Click hai lần để xem chi tiết"
        onCellDoubleClick={({ row }) => {
          navigateToDetail(row.id);
        }}
        footer={
          <BaseDataGridFooter
            pagination={{
              page: page + 1,
              onChange: (_, p) => setPage(p - 1),
              count: totalPages,
            }}
          />
        }
      />
    </Box>
  );
}
