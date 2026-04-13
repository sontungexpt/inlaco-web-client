import Skeleton from "@mui/material/Skeleton";
import { Cell, CellRendererProps, RenderCellProps } from "react-data-grid";

export function createSkeletonRows(count = 5): { ____loading: boolean }[] {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      id: i,
      ____loading: true,
    });
  }
  return rows;
}

export function getSkeletonWidth(rowIdx: number, colIdx: number) {
  const seed = (rowIdx + 1) * 31 + (colIdx + 1) * 17;
  return `${60 + (seed % 40)}%`;
}

export function renderSkeletonCell<R, SR>(p: RenderCellProps<R, SR>) {
  const width = getSkeletonWidth(p.rowIdx, p.column.idx);
  const delay = (p.rowIdx * 3 + p.column.idx) * 80;

  return (
    <Skeleton
      variant="text"
      animation="pulse"
      sx={{
        width,
        height: 16,
        transform: "none",
        position: "relative",
        overflow: "hidden",

        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "0%",
          backgroundColor: "currentColor",
          opacity: 0.2,

          animation: `grow 1.2s ease forwards ${delay}ms`,
        },

        "@keyframes grow": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
      }}
    />
  );
}

export function SkeletonCell<R, SR>(props: CellRendererProps<R, SR>) {
  const { column } = props;
  return (
    <Cell
      {...props}
      column={{
        ...column,
        renderCell: renderSkeletonCell,
      }}
    />
  );
}
