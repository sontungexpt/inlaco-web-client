import "react-data-grid/lib/styles.css";
import {
  Column,
  ColumnGroup,
  ColumnOrColumnGroup,
  DataGrid,
  DataGridProps,
  RenderCellProps,
} from "react-data-grid";

import Skeleton from "@mui/material/Skeleton";
import Color from "@constants/Color";
import { ReactNode, useMemo } from "react";
import NoValuesOverlay from "./NoValuesOverlay";
import { Box, Pagination } from "@mui/material";

function createSkeletonRows(count = 5): { ____loading: boolean }[] {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      id: i,
      ____loading: true,
    });
  }
  return rows;
}

function getSkeletonWidth(rowIdx: number, colIdx: number) {
  const seed = (rowIdx + 1) * 31 + (colIdx + 1) * 17;
  return `${60 + (seed % 40)}%`;
}

function renderSkeletonCell<R, SR>(p: RenderCellProps<R, SR>) {
  return (
    <Skeleton
      variant="text"
      animation="wave"
      width={getSkeletonWidth(p.rowIdx, p.column.idx)}
      height={16}
      sx={{ transform: "none" }}
    />
  );
}

function injectSkeletonToColumns<R, SR>(
  columns: readonly ColumnOrColumnGroup<R, SR>[],
): readonly ColumnOrColumnGroup<R, SR>[] {
  return columns.map((col: ColumnOrColumnGroup<R, SR>) => {
    if ("children" in col) {
      // group
      return {
        ...col,
        children: injectSkeletonToColumns(col.children),
      } as ColumnGroup<R, SR>;
    }

    return {
      ...col,
      renderCell: (p: RenderCellProps<R & { ____loading: boolean }, SR>) => {
        if (p.row.____loading)
          return renderSkeletonCell<R, SR>(p as RenderCellProps<R, SR>);
        return col.renderCell?.(p as RenderCellProps<R, SR>);
      },
    } as Column<R, SR>;
  });
}

export type RDGStyle = React.CSSProperties & {
  [key: `--rdg-${string}`]: string;
};

export type BaseDataGridProps<R, SR> = Omit<DataGridProps<R, SR>, "style"> & {
  style?: RDGStyle;
  loading?: boolean;
  noValuesOverlay?: () => ReactNode;
  footer?: () => ReactNode;
  skeletonCount?: number;
};

export default function BaseDataGrid<R, SR = unknown>({
  rows,
  columns,
  loading,
  style,
  skeletonCount,
  noValuesOverlay,
  footer,
  ...props
}: BaseDataGridProps<R, SR>) {
  const styleResolved: RDGStyle = useMemo(
    () => ({
      "--rdg-color": Color.TextPrimary,
      "--rdg-background-color": Color.PrimaryWhite,

      "--rdg-header-background-color": Color.SecondaryBlue,
      "--rdg-header-draggable-background-color": Color.PrimaryBlue,

      "--rdg-row-hover-background-color": Color.HoverOverlay,
      "--rdg-row-selected-background-color": "rgba(77, 133, 216, 0.12)",
      "--rdg-row-selected-hover-background-color": Color.ActiveOverlay,

      "--rdg-selection-width": "2px",
      "--rdg-selection-color": Color.PrimaryBlue,

      "--rdg-border-color": Color.PrimaryBlack,
      "--rdg-border-width": "1px",

      "--rdg-checkbox-focus-color": Color.PrimaryBlue,

      maxHeight: 460,
      height: "auto",

      ...style,
    }),
    [style],
  );

  const skeletonRows = useMemo(() => {
    return createSkeletonRows(Math.min(skeletonCount ?? 5, 10)) as R[];
  }, [skeletonCount]);

  const rowsResolved = useMemo(() => {
    if (!loading) return rows;
    if (!rows.length) return skeletonRows;
    return [...rows, ...skeletonRows];
  }, [rows, loading, skeletonRows]);

  const columnsResolved = useMemo(() => {
    return injectSkeletonToColumns(columns);
  }, [columns]);

  return (
    <Box>
      <DataGrid
        {...props}
        rows={rowsResolved}
        columns={columnsResolved}
        style={styleResolved}
      />

      {!loading &&
        rowsResolved.length === 0 &&
        (noValuesOverlay?.() ?? <NoValuesOverlay />)}

      {footer?.()}
    </Box>
  );
}
