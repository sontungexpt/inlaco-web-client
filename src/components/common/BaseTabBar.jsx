import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Tab } from "@mui/material";

const BaseTabBar = ({
  tabs = [],
  value,
  onChange,
  singleTab = false,
  color = "primary",
  variant = "standard",
  centered = true,
  sx,
  tabSx,
  ...props
}) => {
  const isControlled = value !== undefined;

  // normalize tabs: ensure each tab has a value
  const normalizedTabs = useMemo(
    () =>
      tabs.map((tab, index) => ({
        ...tab,
        value: tab.value ?? index,
      })),
    [tabs],
  );

  const [internalValue, setInternalValue] = useState(
    value ?? normalizedTabs[0]?.value,
  );

  const finalValue = isControlled ? value : internalValue;

  // sync controlled value
  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [isControlled, value]);

  // auto-fix when tabs changed
  useEffect(() => {
    if (!normalizedTabs.length) return;
    const isValid = normalizedTabs.some((t) => t.value === finalValue);
    if (!isValid) {
      const fallback = normalizedTabs[0].value;
      if (!isControlled) {
        setInternalValue(fallback);
      }
      onChange?.(null, fallback);
    }
  }, [normalizedTabs, finalValue, isControlled, onChange]);

  const handleChange = (e, newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(e, newValue);
  };

  const visibleTabs = useMemo(() => {
    if (!singleTab) return normalizedTabs;
    const matched = normalizedTabs.find((t) => t.value === finalValue);
    return matched ? [matched] : [normalizedTabs[0]];
  }, [finalValue, normalizedTabs, singleTab]);

  if (!visibleTabs.length) return null;

  return (
    <Tabs
      {...props}
      value={finalValue}
      onChange={handleChange}
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
          key={tab.value}
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
              "&.Mui-selected": { color },
              "&:hover": { color },
            },
            ...(Array.isArray(tabSx) ? tabSx : [tabSx]),
          ]}
        />
      ))}
    </Tabs>
  );
};

export default BaseTabBar;
