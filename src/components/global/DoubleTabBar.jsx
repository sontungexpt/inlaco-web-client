import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

const DoubleTabBar = ({
  onTabChange,
  initialTab = 0,
  tabLabel1,
  tabLabel2,
  variant,
  color,
  isSingleTab = false,
  sx = [],
}) => {
  const [value, setValue] = useState(initialTab);

  const handleValueChange = (event, newValue) => {
    if (isSingleTab) return;
    setValue(newValue);
    onTabChange(newValue);
  };

  const labels = isSingleTab
    ? [initialTab === 0 ? tabLabel1 : tabLabel2] // chỉ show tab đúng initialTab
    : [tabLabel1, tabLabel2]; // show cả 2 tab bình thường

  return (
    <Box maxWidth={1600} sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <Tabs
        value={isSingleTab ? 0 : value}
        onChange={handleValueChange}
        centered
        variant={variant}
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: color,
          },
        }}
      >
        {labels.map((label, idx) => (
          <Tab key={idx} label={label} sx={{ fontWeight: 700, color: color }} />
        ))}
      </Tabs>
    </Box>
  );
};

export default DoubleTabBar;
