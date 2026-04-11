import { useEffect, useMemo, useState } from "react";
import { PageTitle, SectionWrapper } from "@components/common";

import { type Column } from "react-data-grid";
import { Box, Button } from "@mui/material";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

import Color from "@constants/Color";
import { useNavigate } from "react-router";
import { useMobilizations } from "@/queries/mobilization.query";
import BaseDataGrid from "@/components/common/datagrid/BaseDataGrid";
import { MobilizationSchedule } from "@/types/api/mobilization.api";

const MobilizationPage = ({ pageSize = 10 }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const { data: { content: mobilizations = [] } = {}, isLoading } =
    useMobilizations({
      page: page,
      pageSize: pageSize,
      filter: {},
    });

  const columns: Column<MobilizationSchedule>[] = useMemo(
    () =>
      [
        {
          key: "id",
          name: "ID",
        },
        {
          key: "partnerName",
          name: "Công ty",
        },
        {
          key: "partnerPhone",
          name: "Số điện thoại",
        },
        {
          key: "partnerEmail",
          name: "Email",
        },
        {
          key: "partnerAddress",
          name: "Địa chiề",
        },
        {
          key: "startDate",
          name: "Thời gian khởi hành",
        },
        {
          key: "endDate",
          name: "Thời gian kết thúc",
        },
        {
          key: "shipInfo.imoNumber",
          name: "Số IMO tàu",
        },
        {
          key: "shipInfo.name",
          name: "Tên tàu",
        },
        {
          key: "shipInfo.countryISO",
          name: "Quốc tịch tàu",
        },
        {
          key: "shipInfo.type",
          name: "Loại tàu",
        },
        // {
        //   key: "shipInfo.image.url",
        //   name: "Hình ảnh tàu",
        // },
        // {
        //   key: "shipInfo.image.publicId",
        //   name: "ID hình ảnh tàu",
        // },
      ] as Column<MobilizationSchedule>[],
    [],
  );

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
      <BaseDataGrid<MobilizationSchedule>
        loading={isLoading}
        rows={mobilizations}
        columns={columns}
      />
    </Box>
  );
};

export default MobilizationPage;
