import React, { useState, useEffect } from "react";
import { PageTitle, NoValuesOverlay } from "../components/global";
import { Box, Button, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ShipInfoCell, ScheduleCell } from "../components/mobilization";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useNavigate } from "react-router";
import { getMyMobilizationAPI } from "../services/mobilizationServices";
import { getProfileCurrentCrewMemberAPI } from "../services/crewServices";
import { formatDateTime } from "@utils/converter";
import Color from "@constants/Color";
import { HttpStatusCode } from "axios";

const CrewMyMobilization = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mobilizations, setMobilizations] = useState([]);
  const [cardID, setCardID] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      try {
        const response = await getProfileCurrentCrewMemberAPI();
        await new Promise((resolve) => setTimeout(resolve, 200)); // delay UI for 200ms

        if (response.status === HttpStatusCode.Ok) {
          setCardID(response.data.cardId);
        }
      } catch (err) {
        console.log("Error when fetching crew member profile data: ", err);
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    const getMyMobilization = async (cardID) => {
      setLoading(true);
      try {
        const response = await getMyMobilizationAPI(cardID);
        await new Promise((resolve) => setTimeout(resolve, 200)); // delay UI for 200ms

        if (response.status === HttpStatusCode.OK) {
          const mobilizations = response.data;

          const formattedMobilizations = mobilizations.map((mobilization) => ({
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
              // imageUrl: mobilization.detail?.shipInfo?.imageUrl?.url,
            },
            scheduleInfo: {
              position: mobilization.professionalPosition,
              startLocation: mobilization.detail.departurePoint,
              startDate: mobilization.detail.startDate,
              endLocation: mobilization.detail.arrivalPoint,
              estimatedEndTime: mobilization.detail.estimatedEndDate,
            },
          }));

          setMobilizations(formattedMobilizations);
        }
      } catch (err) {
        console.log("Error when fetching my mobilization data: ", err);
      } finally {
        setLoading(false);
      }
    };

    if (cardID !== "") {
      getMyMobilization(cardID);
    }
  }, [cardID]);

  const onMobilizationDetailClick = (id, position) => {
    navigate(`/mobilizations/${id}`, {
      state: { isAdmin: false, position: position },
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
      renderCell: (params) => {
        return (
          <ShipInfoCell
            IMONumber={params?.value?.IMONumber}
            name={params?.value?.name}
            countryCode={params?.value?.countryCode}
            type={params?.value?.type}
            imageUrl={params?.value?.imageUrl}
          />
        );
      },
    },
    {
      field: "scheduleInfo",
      headerName: "Lịch trình",
      sortable: false,
      flex: 2.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <ScheduleCell
            startLocation={params?.value?.startLocation}
            startDate={formatDateTime(params?.value?.startDate)}
            endLocation={params?.value?.endLocation}
            estimatedEndTime={formatDateTime(params?.value?.estimatedEndTime)}
          />
        );
      },
    },
    {
      field: "detail",
      headerName: "Chi tiết",
      sortable: false,
      flex: 0.75,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        console.log(params);
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                onMobilizationDetailClick(
                  params?.id,
                  params?.row?.scheduleInfo?.position,
                )
              }
              sx={{
                backgroundColor: Color.PrimaryGreen,
                color: Color.PrimaryBlack,
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              <ArrowForwardIosRoundedIcon
                sx={{
                  width: 15,
                  height: 15,
                  marginTop: "4px",
                  marginBottom: "4px",
                }}
              />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box m="20px">
        <Box>
          <PageTitle
            title="LỊCH ĐIỀU ĐỘNG"
            subtitle={"Thông tin các điều động của cá nhân"}
          />
        </Box>
        {/* Switch bar component only for Crew Member role */}
        {/* <SwitchBar
          tabLabel1={"Danh Sách"}
          tabLabel2={"Thời Gian Biểu"}
          variant={"fullWidth"}
          onChange={(newValue) => handleTabChange(newValue)}
          color={COLOR.secondary_blue}
          sx={{
            backgroundColor: COLOR.secondary_white,
          }}
        />
        {tabValue === 0 ? (
          <Box
            m="40px 0 0 0"
            height="62vh"
            maxHeight={550}
            maxWidth={1600}
            sx={{
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: COLOR.secondary_blue,
                color: COLOR.primary_white,
              },
              "& .MuiTablePagination-root": {
                backgroundColor: COLOR.secondary_blue,
                color: COLOR.primary_white,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                paddingBottom: 2,
                justifyContent: "end",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: COLOR.primary_gold,
                  color: COLOR.primary_black,
                  borderRadius: 2,
                }}
                onClick={() => navigate("/createMobilization")}
              >
                <AddCircleRoundedIcon />
                <Typography
                  sx={{
                    fontWeight: 700,
                    marginLeft: "4px",
                    textTransform: "capitalize",
                  }}
                >
                  Tạo điều động
                </Typography>
              </Button>
            </Box>
            <DataGrid
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnResize
              getRowHeight={() => "auto"}
              rows={masterAssignmentSchedule}
              columns={columns}
              slots={{ noRowsOverlay: NoValuesOverlay }}
              pageSizeOptions={[5, 10, { value: -1, label: "All" }]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5, page: 0 },
                },
              }}
              sx={{
                backgroundColor: "#FFF",
                headerAlign: "center",
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontSize: 16,
                  fontWeight: 700,
                },
              }}
            />
          </Box>
        ) : (
          <Box m="40px 0 0 0" height="62vh" maxHeight={550} maxWidth={1600}>
            <Typography>THỜI GIAN BIỂU</Typography>
          </Box>
        )} */}
        <Box
          m="40px 0 0 0"
          height={"72vh"}
          maxHeight={550}
          maxWidth={1600}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: Color.SecondaryBlue,
              color: Color.PrimaryWhite,
            },
            "& .MuiTablePagination-root": {
              backgroundColor: Color.SecondaryBlue,
              color: Color.PrimaryWhite,
            },
          }}
        >
          <DataGrid
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnResize
            getRowHeight={() => "auto"}
            rows={mobilizations}
            columns={columns}
            slots={{ noRowsOverlay: NoValuesOverlay }}
            pageSizeOptions={[5, 10, { value: -1, label: "All" }]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            sx={{
              backgroundColor: "#FFF",
              headerAlign: "center",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: 16,
                fontWeight: 700,
              },
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default CrewMyMobilization;
