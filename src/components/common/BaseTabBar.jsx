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
            },
            ...(Array.isArray(tabSx) ? tabSx : [tabSx]),
          ]}
        />
      ))}
    </Tabs>
  );
};

export default BaseTabBar;
