import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { ShipInfoCell, ScheduleCell } from "../components/mobilization";
import { useNavigate } from "react-router";
import { fetchMyMobilizations } from "../services/mobilization.service";
import { formatDateTime } from "@utils/converter";
import { PageTitle, DetailActionCell } from "@/components/common";
import BaseDataGridOld from "@/components/common/datagrid/mui/BaseDataGridOld";

const CrewMyMobilization = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mobilizations, setMobilizations] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchMyMobilizations();
        const formatted = (res.content ?? []).map((mobilization) => ({
          id: mobilization.detail.id,
          partnerInfo: {
            partnerName: mobilization.detail.partnerName,
            email: mobilization.detail.partnerEmail,
            phoneNumber: mobilization.detail.partnerPhone,
          },
          shipInfo: {
            IMONumber: mobilization.detail.shipInfo.imonumber,
            name: mobilization.detail.shipInfo.name,
            countryCode: mobilization.detail.shipInfo.countryISO,
            type: mobilization.detail.shipInfo.shipType,
          },
          scheduleInfo: {
            position: mobilization.professionalPosition,
            startLocation: mobilization.detail.departurePoint,
            startDate: mobilization.detail.startDate,
            endLocation: mobilization.detail.arrivalPoint,
            estimatedEndTime: mobilization.detail.estimatedEndDate,
          },
        }));
        setMobilizations(formatted);
      } catch (err) {
        console.error("Error when fetching my mobilization data: ", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const onMobilizationDetailClick = (id, position) => {
    navigate(`/mobilizations/${id}`, {
      state: { isAdmin: false, position },
    });
  };

  const columns = [
    {
      field: "partnerInfo",
      headerName: "Thông tin Công ty",
      sortable: false,
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <p style={{ margin: 0, textAlign: "left" }}>
            <strong>Tên: </strong>
            {params.value?.partnerName}
          </p>
          <p style={{ margin: 0, textAlign: "left" }}>
            <strong>Email: </strong>
            {params.value?.email}
          </p>
          <p style={{ margin: 0, textAlign: "left" }}>
            <strong>SĐT: </strong>
            {params.value?.phoneNumber}
          </p>
        </div>
      ),
    },
    {
      field: "shipInfo",
      headerName: "Thông tin Tàu",
      sortable: false,
      flex: 3,
      headerAlign: "center",
      renderCell: (params) => (
        <ShipInfoCell
          IMONumber={params?.value?.IMONumber}
          name={params?.value?.name}
          countryCode={params?.value?.countryCode}
          type={params?.value?.type}
          imageUrl={params?.value?.imageUrl}
        />
      ),
    },
    {
      field: "scheduleInfo",
      headerName: "Lịch trình",
      sortable: false,
      flex: 2.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <ScheduleCell
          startLocation={params?.value?.startLocation}
          startDate={formatDateTime(params?.value?.startDate)}
          endLocation={params?.value?.endLocation}
          estimatedEndTime={formatDateTime(params?.value?.estimatedEndTime)}
        />
      ),
    },
    {
      field: "detail",
      headerName: "Chi tiết",
      sortable: false,
      flex: 0.75,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <DetailActionCell
          onClick={() =>
            onMobilizationDetailClick(
              params?.id,
              params?.row?.scheduleInfo?.position,
            )
          }
        />
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box>
        <PageTitle
          title="LỊCH ĐIỀU ĐỘNG"
          subtitle="Thông tin các điều động của cá nhân"
        />
      </Box>
      <BaseDataGridOld loading={loading} rows={mobilizations} columns={columns} />
    </Box>
  );
};

export default CrewMyMobilization;
