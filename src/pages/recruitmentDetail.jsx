import React, { useState, useEffect } from "react";
import { PageTitle, SectionDivider, InfoTextField } from "../components/global";
import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { COLOR } from "../assets/Color";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import { useNavigate, useParams } from "react-router";
import { useAppContext } from "../contexts/AppContext";
import HttpStatusCode from "../constants/HttpStatusCode";
import { getPostByID_API } from "../services/postServices";
import { isoStringToDateString } from "../utils/ValueConverter";

const RecruitmentDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { roles } = useAppContext();
  const isAdmin = roles.includes("ADMIN");
  const isAlreadyApplied = false; //this later will be replaced by the actual applied status of the user when fetching API

  const [loading, setLoading] = useState(false);
  const [postInfo, setPostInfo] = useState({});

  useEffect(() => {
    const fetchRecruitmentInfo = async () => {
      setLoading(true);
      try {
        // Call API to fetch recruitment info
        const response = await getPostByID_API(id);
        await new Promise((resolve) => setTimeout(resolve, 200)); //Delay 200ms to simulate API call

        if (response.status === HttpStatusCode.OK) {
          setPostInfo(response.data);
          setIsActive(!response.date?.isActive);
        } else {
          console.log("Error when fetching recruitment info");
        }
      } catch (err) {
        console.log("Error when fetching recruitment info: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitmentInfo();
  }, []);

  // const [hideUnhideLoading, setHideUnhideLoading] = useState(false);
  // const [isActive, setIsActive] = useState(true);

  const [openClosedLoading, setOpenClosedLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleUserApplicationClick = (id) => {
    if (isAlreadyApplied) {
      navigate(`/recruitment/${id}/application`);
    } else {
      navigate(`/recruitment/${id}/apply`);
    }
  };

  // const handleSwitchingIsActiveClick = async () => {
  //   setIsActive(!isActive);
  // };

  const handleSwitchingOpenClosedClick = async () => {
    console.log("Switching open closed click");
    setOpenClosedLoading(true);
    try {
      //Call API to update the status of the recruitment
      await new Promise((resolve) => setTimeout(resolve, 1000)); //Mock API call

      setIsActive(!isActive);
    } catch (error) {
      console.log("Error when updating recruitment status: ", error);
    } finally {
      setOpenClosedLoading(false);
    }
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <PageTitle
              title="CHI TIẾT BÀI ĐĂNG TUYỂN DỤNG"
              subtitle={`Chi tiết bài đăng tuyển dụng: ${postInfo?.title}`}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              {isAdmin ? (
                <Button
                  variant="contained"
                  onClick={() => handleSwitchingOpenClosedClick()}
                  disabled={openClosedLoading}
                  sx={{
                    width: "15%",
                    padding: 1,
                    color: COLOR.primary_white,
                    backgroundColor: !isActive
                      ? COLOR.primary_blue
                      : COLOR.primary_orange,
                    minWidth: 110,
                  }}
                >
                  {openClosedLoading ? (
                    <CircularProgress size={24} color={COLOR.primary_black} />
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "end" }}>
                      {!isActive ? (
                        <CheckCircleRoundedIcon
                          sx={{
                            marginRight: "5px",
                            marginBottom: "3px",
                            width: 20,
                            height: 20,
                          }}
                        />
                      ) : (
                        <EventBusyRoundedIcon
                          sx={{
                            marginRight: "5px",
                            marginBottom: "3px",
                            width: 20,
                            height: 20,
                          }}
                        />
                      )}
                      <Typography sx={{ fontWeight: 700, marginLeft: "2px" }}>
                        {!isActive ? "Mở đăng ký" : "Đóng đăng ký"}
                      </Typography>
                    </Box>
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleUserApplicationClick(id)}
                  sx={{
                    backgroundColor: COLOR.primary_gold,
                    color: COLOR.primary_black,
                    borderRadius: 2,
                  }}
                >
                  <AppRegistrationRoundedIcon />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      marginLeft: "4px",
                    }}
                  >
                    {isAlreadyApplied ? "XEM HỒ SƠ ỨNG TUYỂN" : "ỨNG TUYỂN"}
                  </Typography>
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          px={2}
          mt={4}
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <InfoTextField
            id="recruitment-start-date"
            type="date"
            label="Ngày mở đăng ký"
            size="small"
            margin="none"
            disabled={true}
            fullWidth
            name="recruitmentStartDate"
            value={
              postInfo.recruitmentStartDate
                ? isoStringToDateString(postInfo.recruitmentStartDate)
                : ""
            }
            mx={2}
            sx={{
              width: "40%",
              marginBottom: 0,
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "30%",
            }}
          >
            <Box
              sx={{
                borderBottom: `2px solid ${COLOR.primary_black}`,
                width: "40%",
              }}
            />
          </Box>
          <InfoTextField
            id="recruitment-end-date"
            label="Ngày đóng đăng ký"
            size="small"
            margin="none"
            disabled={true}
            type="date"
            fullWidth
            name="recruitmentEndDate"
            value={
              postInfo.recruitmentEndDate
                ? isoStringToDateString(postInfo.recruitmentEndDate)
                : ""
            }
            mx={2}
            sx={{
              width: "40%",
              marginBottom: 0,
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Box>
        <SectionDivider
          sx={{ marginTop: 2 }}
          sectionName="Thông tin bài đăng*: "
        />
        <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
          <Grid size={4}>
            <InfoTextField
              id="title"
              label="Tiêu đề bài đăng"
              size="small"
              margin="none"
              disabled={true}
              required
              fullWidth
              name="title"
              value={postInfo.title}
            />
          </Grid>
          <Grid size={3}>
            <InfoTextField
              id="position"
              label="Vị trí tuyển dụng"
              size="small"
              margin="none"
              disabled={true}
              required
              fullWidth
              name="position"
              value={postInfo.position}
            />
          </Grid>
          <Grid size={2.5}>
            <InfoTextField
              id="work-location"
              label="Địa điểm"
              size="small"
              margin="none"
              disabled={true}
              required
              fullWidth
              name="workLocation"
              value={postInfo.workLocation}
            />
          </Grid>
          <Grid size={2.5}>
            <InfoTextField
              id="salary"
              label="Mức lương"
              size="small"
              type="number"
              margin="none"
              disabled={true}
              required
              fullWidth
              name="salary"
              value={postInfo.expectedSalary ? postInfo.expectedSalary[1] : "0"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">vnđ</InputAdornment>
                  ),
                },
              }}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
            />
          </Grid>
          <Grid size={12}>
            <InfoTextField
              id="content"
              label="Mô tả công việc"
              rows={8}
              multiline
              size="small"
              margin="none"
              disabled={true}
              required
              fullWidth
              name="content"
              value={postInfo.content}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default RecruitmentDetail;
