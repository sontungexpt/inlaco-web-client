import React, { useState } from "react";
import { PageTitle, NoValuesOverlay } from "@components/global";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ScheduleCell, ShipInfoCell } from "@components/mobilization";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useNavigate } from "react-router";
import { formatDateTime } from "@/utils/converter";
import Color from "@constants/Color";
import useAllowedRole from "@/hooks/useAllowedRole";
import { useSupplyRequests } from "@/hooks/services/supplyRequests";

const SupplyRequest = () => {
  const navigate = useNavigate();
  const isAdmin = useAllowedRole("ADMIN");
  const PAGE_SIZE = 10;

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { data: response, isLoading } = useSupplyRequests({
    page: paginationModel.page,
    sizePerPage: paginationModel.pageSize,
  });

  const supplyRequests = response?.content.map((r) => ({
    id: r.id,
    companyName: r.companyName,
    representativeInfo: {
      representativeName: r.representativeName,
      email: r.companyEmail,
      phoneNumber: r.companyPhone,
    },
    shipInfo: {
      IMONumber: r.shipInfo.imonumber,
      name: r.shipInfo.name,
      countryCode: r.shipInfo.countryISO,
      type: r.shipInfo.shipType,
    },
    scheduleInfo: {
      startLocation: r.departurePoint,
      startDate: r.estimatedDepartureTime,
      endLocation: r.arrivalPoint,
      estimatedEndTime: r.estimatedArrivalTime,
    },
  }));
  const totalRequests = response?.totalElements;

  const onRequestDetailClick = (id) => {
    const type = isAdmin ? "admin" : "user";
    navigate(`/supply-requests/${id}/${type}`);
  };

  const columns = [
    {
      field: "companyName",
      headerName: "Tên công ty",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "representativeInfo",
      headerName: "Người đại diện",
      flex: 2,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Stack spacing={0.3} alignItems="flex-start">
          <Typography variant="body2">
            <strong>Tên:</strong> {params.value.representativeName}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {params.value.email}
          </Typography>
          <Typography variant="body2">
            <strong>SĐT:</strong> {params.value.phoneNumber}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "shipInfo",
      headerName: "Thông tin Tàu",
      flex: 3,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => <ShipInfoCell {...params.value} />,
    },
    {
      field: "scheduleInfo",
      headerName: "Lịch trình",
      flex: 2,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <ScheduleCell
          startLocation={params.value.startLocation}
          startDate={formatDateTime(params.value.startDate)}
          endLocation={params.value.endLocation}
          estimatedEndTime={formatDateTime(params.value.estimatedEndTime)}
        />
      ),
    },
    {
      field: "detail",
      headerName: "Chi tiết",
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => onRequestDetailClick(params.id)}
            sx={{
              backgroundColor: Color.PrimaryGreen,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: Color.PrimaryBlack,
              borderRadius: "6px",
              minWidth: "36px",
            }}
          >
            <ArrowForwardIosRoundedIcon sx={{ width: 16, height: 16 }} />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p="20px">
      <PageTitle
        title="YÊU CẦU CUNG ỨNG"
        subtitle="Danh sách các yêu cầu cung ứng thuyền viên"
      />

      {!isAdmin && (
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
            onClick={() => navigate("/supply-requests/user/create")}
          >
            <AddCircleRoundedIcon sx={{ mr: 1 }} />
            Gửi yêu cầu cung ứng
          </Button>
        </Box>
      )}

      <Box
        mt={3}
        sx={{
          height: isAdmin ? "72vh" : "65vh",
          maxWidth: 1600,
          bgcolor: "#FFF",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",
        }}
      >
        <DataGrid
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnResize
          getRowHeight={() => "auto"}
          columns={columns}
          paginationMode="server" // QUAN TRỌNG!
          rowCount={totalRequests}
          rows={supplyRequests}
          slots={{ noRowsOverlay: NoValuesOverlay }}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => {
            setPaginationModel({ ...model });
          }}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: Color.SecondaryBlue,
              color: Color.PrimaryWhite,
              fontWeight: 700,
            },
            "& .MuiTablePagination-root": {
              backgroundColor: Color.SecondaryBlue,
              color: Color.PrimaryWhite,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SupplyRequest;
// import React, { useEffect, useState } from "react";
// import { PageTitle, NoValuesOverlay } from "@components/global";
// import { Box, Button, Typography, CircularProgress } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { ScheduleCell, ShipInfoCell } from "@components/mobilization";
// import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
// import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
// import { useNavigate } from "react-router";
// import { useAuthContext } from "@/contexts/AuthContext";
// import { getAllSupplyRequestAPI } from "@/services/supplyReqServices";
// import { formatDateTime } from "@utils/converter";
// import Color from "@constants/Color";
// import { HttpStatusCode } from "axios";

// const SupplyRequest = () => {
//   const navigate = useNavigate();
//   const { roles } = useAuthContext();

//   const isAdmin = roles.includes("ADMIN");
//   const [loading, setLoading] = useState(false);
//   const [supplyRequests, setSupplyRequests] = useState([]);

//   useEffect(() => {
//     const fetchSupplyRequests = async () => {
//       setLoading(true);
//       try {
//         const response = await getAllSupplyRequestAPI(0, 10, "");
//         await new Promise((resolve) => setTimeout(resolve, 200)); // delay UI for 200ms

//         if (response.status === HttpStatusCode.Ok) {
//           console.log(response.data.content);
//           const requests = response.data.content;

//           const formattedRequests = requests.map((request) => ({
//             id: request.id,
//             companyName: request.companyName,
//             representativeInfo: {
//               representativeName: request.representativeName,
//               email: request.companyEmail,
//               phoneNumber: request.companyPhone,
//             },
//             shipInfo: {
//               IMONumber: request.shipInfo.imonumber,
//               name: request.shipInfo.name,
//               countryCode: request.shipInfo.countryISO,
//               type: request.shipInfo.shipType,
//               // imageUrl: request.shipInfo.imageUrl,
//             },
//             scheduleInfo: {
//               startLocation: request.departurePoint,
//               startDate: request.estimatedDepartureTime,
//               endLocation: request.arrivalPoint,
//               estimatedEndTime: request.estimatedArrivalTime,
//             },
//           }));

//           setSupplyRequests(formattedRequests);
//         } else {
//           console.error("Error fetching supply requests:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching supply requests");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSupplyRequests();
//   }, []);

//   const onRequestDetailClick = (id) => {
//     if (isAdmin) {
//       navigate(`/supply-requests/${id}/admin`);
//     } else {
//       navigate(`/supply-requests/${id}/user`);
//     }
//   };

//   const columns = [
//     {
//       field: "companyName",
//       headerName: "Tên công ty",
//       sortable: false,
//       flex: 1.5,
//       align: "center",
//       headerAlign: "center",
//       renderCell: (params) => (
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             height: "100%",
//           }}
//         >
//           {params.value}
//         </div>
//       ),
//     },
//     {
//       field: "representativeInfo",
//       headerName: "Thông tin Người đại diện",
//       sortable: false,
//       flex: 2,
//       align: "center",
//       headerAlign: "center",
//       renderCell: (params) => (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             height: "100%",
//           }}
//         >
//           <p style={{ margin: 0, textAlign: "left" }}>
//             <strong>Tên: </strong>
//             {params.value.representativeName}
//           </p>
//           <p style={{ margin: 0, textAlign: "left" }}>
//             <strong>Email: </strong>
//             {params.value?.email}
//           </p>
//           <p style={{ margin: 0, textAlign: "left" }}>
//             <strong>SĐT: </strong>
//             {params.value?.phoneNumber}
//           </p>
//         </div>
//       ),
//     },
//     {
//       field: "shipInfo",
//       headerName: "Thông tin Tàu",
//       sortable: false,
//       flex: 3,
//       headerAlign: "center",
//       renderCell: (params) => {
//         return (
//           <ShipInfoCell
//             IMONumber={params?.value?.IMONumber}
//             name={params?.value?.name}
//             countryCode={params?.value?.countryCode}
//             type={params?.value?.type}
//             imageUrl={params?.value?.imageUrl}
//           />
//         );
//       },
//     },
//     {
//       field: "scheduleInfo",
//       headerName: "Lịch trình",
//       sortable: false,
//       flex: 2,
//       align: "center",
//       headerAlign: "center",
//       renderCell: (params) => {
//         return (
//           <ScheduleCell
//             startLocation={params?.value?.startLocation}
//             startDate={formatDateTime(params?.value?.startDate)}
//             endLocation={params?.value?.endLocation}
//             estimatedEndTime={formatDateTime(params?.value?.estimatedEndTime)}
//           />
//         );
//       },
//     },
//     {
//       field: "detail",
//       headerName: "Chi tiết",
//       sortable: false,
//       flex: 0.75,
//       align: "center",
//       headerAlign: "center",
//       renderCell: (params) => {
//         return (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               height: "100%",
//               justifyContent: "center",
//             }}
//           >
//             <Button
//               variant="contained"
//               size="small"
//               onClick={() => onRequestDetailClick(params?.id)}
//               sx={{
//                 backgroundColor: Color.PrimaryGreen,
//                 color: Color.PrimaryBlack,
//                 fontWeight: 700,
//                 textTransform: "capitalize",
//               }}
//             >
//               <ArrowForwardIosRoundedIcon
//                 sx={{
//                   width: 15,
//                   height: 15,
//                   marginTop: "4px",
//                   marginBottom: "4px",
//                 }}
//               />
//             </Button>
//           </div>
//         );
//       },
//     },
//   ];

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <div>
//       <Box m="20px">
//         <PageTitle
//           title="YÊU CẦU CUNG ỨNG"
//           subtitle="Danh sách các yêu cầu cung ứng thuyền viên"
//         />
//         {!isAdmin && (
//           <Box sx={{ display: "flex", justify: "end" }}>
//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: Color.PrimaryGold,
//                 color: Color.PrimaryBlack,
//                 borderRadius: 2,
//                 margin: 0,
//                 marginLeft: "auto",
//               }}
//               onClick={() => navigate("/supply-requests/user/create")}
//             >
//               <AddCircleRoundedIcon />
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   marginLeft: "4px",
//                   textTransform: "capitalize",
//                 }}
//               >
//                 Gửi yêu cầu cung ứng
//               </Typography>
//             </Button>
//           </Box>
//         )}
//         <Box
//           m="20px 0 0 0"
//           height={isAdmin ? "72vh" : "65vh"}
//           maxHeight={550}
//           maxWidth={1600}
//         >
//           <DataGrid
//             disableRowSelectionOnClick
//             disableColumnMenu
//             disableColumnResize
//             getRowHeight={() => "auto"}
//             rows={supplyRequests}
//             columns={columns}
//             slots={{ noRowsOverlay: NoValuesOverlay }}
//             pageSizeOptions={[5, 10, { value: -1, label: "All" }]}
//             initialState={{
//               pagination: {
//                 paginationModel: { pageSize: 5, page: 0 },
//               },
//             }}
//             sx={{
//               backgroundColor: "#FFF",
//               headerAlign: "center",
//               "& .MuiDataGrid-columnHeaderTitle": {
//                 fontSize: 16,
//                 fontWeight: 700,
//               },
//               "& .MuiDataGrid-columnHeader": {
//                 backgroundColor: Color.SecondaryBlue,
//                 color: Color.PrimaryWhite,
//               },
//               "& .MuiTablePagination-root": {
//                 backgroundColor: Color.SecondaryBlue,
//                 color: Color.PrimaryWhite,
//               },
//             }}
//           />
//         </Box>
//       </Box>
//     </div>
//   );
// };

// export default SupplyRequest;
