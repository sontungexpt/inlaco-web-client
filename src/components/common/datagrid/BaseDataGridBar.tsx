import { Box, BoxProps } from "@mui/material";
import { DEFAULT_RDG_ROW_HEIGHT } from "./constants";
import { cloneElement, isValidElement, ReactNode } from "react";

const BASE_DATA_GRID_BAR_TYPE = Symbol("BaseDataGridBar");

function isGridBar(node: any): boolean {
  return node?.type?.$$type === BASE_DATA_GRID_BAR_TYPE;
}

export type BaseDataGridBarProps = BoxProps & {};

export function BaseDataGridBar({
  sx,
  children,
  ...props
}: BaseDataGridBarProps) {
  return (
    <Box
      {...props}
      sx={[
        {
          width: "100%",
          height: DEFAULT_RDG_ROW_HEIGHT,

          backgroundColor: "var(--rdg-header-background-color)",

          borderWidth: "var(--rdg-border-width)",
          borderColor: "var(--rdg-border-color)",

          display: "flex",
          alignItems: "center",

          color: "var(--rdg-color)",
          fontSize: "var(--rdg-font-size)",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

BaseDataGridBar.displayName = "BaseDataGridBar";
BaseDataGridBar.$$type = BASE_DATA_GRID_BAR_TYPE;

export function enhanceBar(node: ReactNode, extraProps: any) {
  if (!node) return null;
  if (!isValidElement(node)) {
    throw new Error("Node must be ReactNode");
  }

  if (!extraProps) return node;
  if (!isGridBar(node)) return node;
  return cloneElement<any>(node, extraProps);
}
