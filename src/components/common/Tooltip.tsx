import React, { HtmlHTMLAttributes, ReactNode } from "react";
import {
  Tooltip as MuiTooltip,
  TooltipProps as MuiTooltipProps,
} from "@mui/material";

import Color from "@/constants/Color";

export type TooltipProps = Omit<MuiTooltipProps, "children" | "slotProps"> & {
  error?: boolean;
  children: React.ReactNode;
  slotProps?: MuiTooltipProps["slotProps"] & {
    container: HtmlHTMLAttributes<HTMLDivElement>;
  };
};

export default function Tooltip({
  error,
  title,
  slotProps,
  children,
  arrow = true,
  ...props
}: TooltipProps) {
  return (
    <MuiTooltip
      placement="auto"
      {...props}
      title={title}
      arrow={arrow}
      slotProps={
        error
          ? {
              tooltip: {
                ...slotProps?.tooltip,
                sx: {
                  ...slotProps?.tooltip?.sx,
                  color: Color.PrimaryWhite,
                  backgroundColor: Color.Error,
                },
              },
              arrow: {
                ...slotProps?.arrow,
                sx: {
                  ...slotProps?.arrow?.sx,
                  color: Color.Error,
                },
              },
            }
          : undefined
      }
    >
      <div
        {...slotProps?.container}
        style={{
          display: "flex",
          alignItems: "center",
          pointerEvents: "auto",
          ...slotProps?.container?.style,
        }}
      >
        {children}
      </div>
    </MuiTooltip>
  );
}
