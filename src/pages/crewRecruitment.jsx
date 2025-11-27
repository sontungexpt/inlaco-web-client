import React, { useState, useEffect } from "react";
import {
  Pagination,
  Box,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { PageTitle, SwitchBar, NoValuesOverlay } from "../components/global";
import { DataGrid } from "@mui/x-data-grid";
import { RecruitmentCard } from "../components/other";
import { COLOR } from "../assets/Color";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { useNavigate, useLocation } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import HttpStatusCode from "../constants/HttpStatusCode";
import { getAllPostAPI, getAllCandidatesAPI } from "../services/postServices";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { isoStringToAppDateString } from "../utils/converter";

const CrewRecruitment = () => {
  const navigate = useNavigate();
  const { roles } = useAuthContext();
  const isAdmin = roles.includes("ADMIN");
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await getAllPostAPI(0, 10);
        await new Promise((resolve) => setTimeout(resolve, 200)); //Delay the UI for 200ms

        if (response.status === HttpStatusCode.OK) {
          setPosts(response.data);
        } else {
          console.error("Error when fetching posts: ", response);
        }
      } catch (error) {
        console.error("Error when fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreateRecruitmentClick = () => {
    navigate("/recruitment/create");
  };

  const handleRecruitmentClick = (id) => {
    navigate(`/recruitment/${id}`, { state: { isAdmin: isAdmin } });
  };

  const onAdminMemberDetailClick = (candidateID) => {
    navigate(`/recruitment/candidates/${candidateID}/admin`);
  };

  const onCreateCrewMemberClick = (candidateID, candidateInfo) => {
    navigate(`/crews/add/${candidateID}`, {
      state: { candidateInfo: candidateInfo },
    });
  };

  const statusFilters = [
    { label: "Đã nộp", value: "APPLIED" },
    { label: "Đã qua vòng phỏng vấn", value: "WAIT_FOR_INTERVIEW" },
    { label: "Từ chối", value: "REJECTED" },
    { label: "Đã ký hợp đồng", value: "HIRED" },
  ];

  const columns = [
    {
      field: "fullName",
      headerName: "Họ tên",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "gender",
      headerName: "Giới tính",
      sortable: false,
      flex: 0.75,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {params.value === "MALE"
              ? "Nam"
              : params.value === "FEMALE"
                ? "Nữ"
                : "Khác"}
          </Box>
        );
      },
    },
    {
      field: "birthDate",
      headerName: "Ngày sinh",
      sortable: false,
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {isoStringToAppDateString(params.value)}
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "SĐT",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "detail",
      headerName: "Thao tác",
      sortable: false,
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
              padding: 5,
            }}
          >
            {candidateStatus === "WAIT_FOR_INTERVIEW" && (
              <Button
                variant="contained"
                size="small"
                onClick={() => onCreateCrewMemberClick(params?.id, params?.row)}
                sx={{
                  backgroundColor: COLOR.PrimaryGold,
                  color: COLOR.PrimaryBlack,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  marginRight: "8px",
                }}
              >
                <PersonAddAltRoundedIcon
                  sx={{
                    width: 18,
                    height: 18,
                    marginTop: "3px",
                    marginBottom: "3px",
                  }}
                />
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              onClick={() => onAdminMemberDetailClick(params?.id)}
              sx={{
                backgroundColor: COLOR.PrimaryGreen,
                color: COLOR.PrimaryBlack,
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

  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(location.state?.tabValue || 0);
  const [candidateList, setCandidateList] = useState([]);
  const [candidateStatus, setCandidateStatus] = useState(
    location.state?.candidateStatus || "APPLIED",
  );

  useEffect(() => {
    const fetchCandidates = async () => {
      setSectionLoading(true);
      try {
        const response = await getAllCandidatesAPI(0, 20, candidateStatus);
        await new Promise((resolve) => setTimeout(resolve, 200)); //Delay the UI for 200ms

        if (response.status === HttpStatusCode.OK) {
          console.log("Candidates: ", response.data.content);
          setCandidateList(response.data.content);
        } else {
          console.error("Error when fetching candidates: ", response);
        }
      } catch (error) {
        console.error("Error when fetching candidates: ", error);
      } finally {
        setSectionLoading(false);
      }
    };

    if (isAdmin) {
      fetchCandidates();
    }
  }, [candidateStatus]);

  const handleStatusChange = (event) => {
    setCandidateStatus(event.target.value);
  };

  const handleTabChange = async (newValue) => {
    setSectionLoading(true);
    if (newValue === 1) {
      try {
        const response = await getAllCandidatesAPI(0, 20, candidateStatus);
        await new Promise((resolve) => setTimeout(resolve, 200)); //Delay the UI for 200ms

        if (response.status === HttpStatusCode.OK) {
          console.log("Candidates: ", response.data.content);
          setCandidateList(response.data.content);
          setTabValue(newValue);
        } else {
          console.error("Error when fetching candidates: ", response);
        }
      } catch (error) {
        console.error("Error when fetching candidates: ", error);
      } finally {
        setSectionLoading(false);
      }
    } else {
      setSectionLoading(true);
      try {
        const response = await getAllPostAPI(0, 10);
        await new Promise((resolve) => setTimeout(resolve, 200)); //Delay the UI for 200ms

        if (response.status === HttpStatusCode.OK) {
          setPosts(response.data);
          setTabValue(newValue);
        } else {
          console.error("Error when fetching posts: ", response);
        }
      } catch (error) {
        console.error("Error when fetching posts: ", error);
      } finally {
        setSectionLoading(false);
      }
    }
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
            title="TUYỂN DỤNG"
            subtitle="Danh sách các bài đăng tuyển dụng Thuyền viên"
          />
        </Box>
        {isAdmin && (
          <SwitchBar
            tabLabel1={"Danh sách bài đăng"}
            tabLabel2={"Danh sách đơn ứng tuyển"}
            variant={"fullWidth"}
            initialTab={tabValue}
            onChange={(newValue) => handleTabChange(newValue)}
            color={COLOR.SecondaryBlue}
            sx={{
              backgroundColor: COLOR.SecondaryWhite,
              marginTop: 4,
              marginBottom: 2,
            }}
          />
        )}
        {tabValue === 1 && !sectionLoading ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Select
                label="Trạng thái"
                value={candidateStatus}
                size="small"
                onChange={handleStatusChange}
                sx={{ marginTop: 1 }}
              >
                {statusFilters.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box
              m="8px 0 0 0"
              height="62vh"
              maxHeight={550}
              maxWidth={1600}
              sx={{
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: COLOR.SecondaryBlue,
                  color: COLOR.PrimaryWhite,
                },
                "& .MuiTablePagination-root": {
                  backgroundColor: COLOR.SecondaryBlue,
                  color: COLOR.PrimaryWhite,
                },
              }}
            >
              <DataGrid
                disableRowSelectionOnClick
                disableColumnMenu
                disableColumnResize
                getRowHeight={() => "auto"}
                rows={candidateList}
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
          </>
        ) : tabValue === 0 && !sectionLoading ? (
          <>
            <Box sx={{}}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  marginBottom: 2,
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    marginLeft: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontStyle: "italic",
                      fontWeight: "700",
                      color: COLOR.PrimaryGreen,
                    }}
                  >
                    {posts.numberOfElements ? posts.numberOfElements : "0"}
                    &nbsp;
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 16,
                      color: COLOR.primary_black_placeholder,
                      fontStyle: "italic",
                    }}
                  >
                    {" "}
                    kết quả
                  </Typography>
                </Box>
                {isAdmin && (
                  <Button
                    variant="contained"
                    onClick={handleCreateRecruitmentClick}
                    sx={{
                      backgroundColor: COLOR.PrimaryGold,
                      color: COLOR.PrimaryBlack,
                      borderRadius: 2,
                    }}
                  >
                    <AddCircleRoundedIcon />
                    <Typography
                      sx={{
                        fontWeight: 700,
                        marginLeft: "4px",
                        textTransform: "capitalize",
                      }}
                    >
                      Đăng Bài tuyển dụng
                    </Typography>
                  </Button>
                )}
              </Box>
              <Grid container spacing={4}>
                {posts.numberOfElements > 0 ? (
                  <>
                    {posts.content.map((post) => (
                      <RecruitmentCard
                        key={post?.id}
                        title={post?.title}
                        description={post?.content}
                        // location={post?.location}
                        isAdmin={isAdmin}
                        onClick={() => handleRecruitmentClick(post?.id)}
                      />
                    ))}
                  </>
                ) : (
                  <Grid
                    size={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: "bold",
                        fontStyle: "italic",
                      }}
                    >
                      Chưa có bài đăng tuyển dụng nào
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={posts.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      "&.Mui-selected": {
                        backgroundColor: COLOR.PrimaryGold,
                        color: COLOR.PrimaryBlack,
                      },
                      "&:hover": {
                        backgroundColor: COLOR.SecondaryGold,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </>
        ) : (
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
        )}
      </Box>
    </div>
  );
};

export default CrewRecruitment;
