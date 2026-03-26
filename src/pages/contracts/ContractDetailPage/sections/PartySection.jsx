import React from "react";
import { Typography, Divider } from "@mui/material";

const PartySection = ({ title, party }) => {
  if (!party) return null;

  return (
    <>
      <Typography fontWeight={700}>{title}</Typography>
      <Typography>
        Tên đơn vị: <b>{party.partyName}</b>
      </Typography>
      <Typography>Địa chỉ: {party.address}</Typography>
      <Typography>
        Đại diện: {party.representer} – {party.representerPosition}
      </Typography>
      <Typography>Email: {party.email}</Typography>
      <Typography>Điện thoại: {party.phone}</Typography>
      <Divider sx={{ my: 2 }} />
    </>
  );
};

export default PartySection;
