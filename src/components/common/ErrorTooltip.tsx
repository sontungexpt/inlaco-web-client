import React, { ReactNode } from "react";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import Color from "@/constants/Color";

export type ErrorTooltipProps = Omit<TooltipProps, "children"> & {
  error?: ReactNode;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  children: React.ReactNode;
};

export default function ErrorTooltip({
  error,
  wrapperProps,
  children,
  arrow = true,
  ...props
}: ErrorTooltipProps) {
  const title = error || props.title || "";

  return (
    <Tooltip
      placement="auto"
      {...props}
      title={title}
      arrow={arrow}
      slotProps={
        error
          ? {
              tooltip: {
                ...props.slotProps?.tooltip,
                sx: {
                  ...props.slotProps?.tooltip?.sx,
                  color: Color.PrimaryWhite,
                  backgroundColor: Color.Error,
                },
              },
              arrow: {
                ...props.slotProps?.arrow,
                sx: {
                  ...props.slotProps?.arrow?.sx,
                  color: Color.Error,
                },
              },
            }
          : undefined
      }
    >
      <div
        {...wrapperProps}
        style={{
          ...wrapperProps?.style,
          display: "flex",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
}
