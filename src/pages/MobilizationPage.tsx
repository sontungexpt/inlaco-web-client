import { useEffect, useState } from "react";
import { PageTitle, SectionWrapper } from "@components/common";

import { type Column } from "react-data-grid";
import { Box, Button } from "@mui/material";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

import Color from "@constants/Color";
import { useLocation, useNavigate } from "react-router";
import { useMobilizations } from "@/queries/mobilization.query";
import BaseDataGrid from "@/components/common/datagrid/BaseDataGrid";

const mockMobilizations: MobilizationRow[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i.toString(),
    partnerName: "Company A ",
    partnerPhone: "0901234567",
    partnerEmail: "contact@companyA.com",
    partnerAddress: "Hà Nội",
    startDate: "2026-04-01T08:00:00Z",
    estimatedEndDate: "2026-04-10T08:00:00Z",
    shipInfo: {
      imoNumber: "IMO1234567",
      name: "Sea Dragon",
      countryISO: "VN",
      type: "Cargo",
      image: {
        publicId: "ship1",
        url: "https://via.placeholder.com/100",
      },
    },
  })),
];

type MobilizationRow = {
  id: string;
  partnerName: string;
  partnerPhone: string;
  partnerEmail: string;
  partnerAddress: string;
  startDate: string;
  estimatedEndDate: string;

  shipInfo?: {
    imoNumber?: string;
    name?: string;
    countryISO?: string;
    type?: string;
    image?: {
      publicId?: string;
      url?: string;
    };
  };
};

const columns: Column<MobilizationRow>[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    key: `col_${i}`,
    name: `Column ${i}`,
    width: 200,
    renderCell: () => <div>Data {i}</div>,
  })),
];

const MobilizationPage = ({ pageSize = 10 }) => {
  const navigate = useNavigate();
  const { initialPage = 0 } = useLocation().state || {};
  const [loading, setLoading] = useState(true);

  const [paginationModel, setPaginationModel] = useState({
    page: initialPage || 0,
    pageSize: pageSize,
  });

  const { data: { content: mobilizations } = {}, isLoading } = useMobilizations(
    {
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      filter: {},
    },
    {},
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box m="20px">
      <SectionWrapper>
        <PageTitle
          title="LỊCH ĐIỀU ĐỘNG"
          subtitle={"Thông tin các điều động đã tạo"}
        />
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
            sx={{
              backgroundColor: Color.PrimaryGold,
              color: Color.PrimaryBlack,
              borderRadius: 2,
            }}
            startIcon={<AddCircleRoundedIcon />}
            onClick={() =>
              navigate("/mobilizations/form", {
                state: {
                  type: "create",
                },
              })
            }
          >
            Tạo điều động
          </Button>
        </Box>
      </SectionWrapper>
      <BaseDataGrid<MobilizationRow>
        loading={loading}
        rows={mockMobilizations}
        columns={columns}
      />
    </Box>
  );
};

export default MobilizationPage;
