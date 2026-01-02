import React from "react";
import { Tabs, Tab } from "@mui/material";

const BaseTabBar = ({
  tabs = [],
  value = 0,
  onChange,
  singleTab = false,
  color = "primary",
  variant = "standard",
  centered = true,
  sx,
  tabSx,
  ...props
}) => {
  const visibleTabs = singleTab ? tabs.filter((t) => t.value === value) : tabs;

  return (
    <Tabs
      {...props}
      value={singleTab ? visibleTabs[0]?.value : value}
      onChange={(_, newValue) => onChange?.(newValue)}
      centered={centered}
      variant={variant}
      sx={[
        {
          minHeight: 48,
          "& .MuiTabs-indicator": {
            backgroundColor: color,
            height: 3,
            borderRadius: 2,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {visibleTabs.map((tab) => (
        <Tab
          key={tab?.key || tab.value}
          value={tab.value}
          label={tab.label}
          icon={tab.icon}
          iconPosition={tab.iconPosition || "start"}
          disabled={tab.disabled}
          sx={[
            {
              fontWeight: 700,
              textTransform: "none",
              minHeight: 48,
              px: 3,
              color: "text.secondary",
              "&.Mui-selected": {
                color: color,
              },
              "&:hover": {
                color: color,
              },
              ...tabSx,
            },
          ]}
        />
      ))}
    </Tabs>
  );
};

export default BaseTabBar;
// import React, { useState } from "react";
// import { Tabs, Tab, Box } from "@mui/material";

// const BaseTabBar = ({
//   onTabChange,
//   initialTab = 0,
//   tabLabel1,
//   tabLabel2,
//   variant,
//   color,
//   isSingleTab = false,
//   sx = [],
// }) => {
//   const [value, setValue] = useState(initialTab);

//   const handleValueChange = (event, newValue) => {
//     if (isSingleTab) return;
//     setValue(newValue);
//     onTabChange(newValue);
//   };

//   const labels = isSingleTab
//     ? [initialTab === 0 ? tabLabel1 : tabLabel2] // chỉ show tab đúng initialTab
//     : [tabLabel1, tabLabel2]; // show cả 2 tab bình thường

//   return (
//     <Tabs
//       value={isSingleTab ? 0 : value}
//       onChange={handleValueChange}
//       centered
//       variant={variant}
//       sx={[
//         {
//           "& .MuiTabs-indicator": {
//             backgroundColor: color,
//           },
//         },
//         ...(Array.isArray(sx) ? sx : [sx]),
//       ]}
//     >
//       {labels.map((label, idx) => (
//         <Tab key={idx} label={label} sx={{ fontWeight: 700, color: color }} />
//       ))}
//     </Tabs>
//   );
// };

// export default BaseTabBar;
