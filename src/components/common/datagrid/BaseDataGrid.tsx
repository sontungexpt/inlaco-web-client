import "react-data-grid/lib/styles.css";
import {
  Cell,
  Column,
  ColumnGroup,
  ColumnOrColumnGroup,
  DataGrid,
  DataGridProps,
  RenderCellProps,
} from "react-data-grid";

import Skeleton from "@mui/material/Skeleton";
import Color from "@constants/Color";
import { isValidElement, cloneElement, ReactNode, useMemo } from "react";
import NoValuesOverlay from "./NoValuesOverlay";
import { Box } from "@mui/material";
import BaseDataGridFooter from "./BaseDataGridFooter";

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
      sx={{
        transform: "none",
      }}
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
  noValuesOverlay?: ReactNode;
  footer?: ReactNode;
  footerRowHeight?: number;
  skeletonCount?: number;
  showSkeletonTail?: boolean;
};

const rdgVars: RDGStyle = {
  "--rdg-font-size": "14px",
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
} as const;

export default function BaseDataGrid<R, SR = unknown>({
  rows,
  columns,
  loading,
  style,

  skeletonCount,
  showSkeletonTail = false,

  noValuesOverlay = <NoValuesOverlay />,
  footer = (
    <BaseDataGridFooter pagination={{ page: 0, pageSize: 10, total: 100000 }} />
  ),

  headerRowHeight,
  rowHeight,
  footerRowHeight,
  ...props
}: BaseDataGridProps<R, SR>) {
  const baseRowHeight = typeof rowHeight === "number" ? rowHeight : 40;
  const headerHeight = headerRowHeight ?? baseRowHeight;
  const footerHeight = footerRowHeight ?? headerHeight;

  const dataGridStyle = useMemo(() => {
    return {
      ...rdgVars,
      height: "auto",
      maxHeight: 450,
      ...style,
    };
  }, [style]);

  const skeletonRows = useMemo(() => {
    return createSkeletonRows(Math.min(skeletonCount ?? 5, 10)) as R[];
  }, [skeletonCount]);

  const rowsResolved = useMemo(() => {
    if (!loading) return rows;
    if (!rows.length || !showSkeletonTail) return skeletonRows;
    return [...rows, ...skeletonRows];
  }, [rows, loading, skeletonRows]);

  const columnsResolved = useMemo(() => {
    return injectSkeletonToColumns(columns);
  }, [columns]);

  const footerNode = useMemo(() => {
    if (!footer) return null;
    if (!isValidElement(footer)) {
      throw new Error("footer must be ReactNode");
    }
    return cloneElement<any>(footer, {
      height: footerHeight,
    });
  }, [footer]);

  return (
    <Box sx={rdgVars}>
      <DataGrid
        {...props}
        style={dataGridStyle}
        rows={rowsResolved}
        columns={columnsResolved}
        rowHeight={rowHeight} // use row height because it allows dynamic row height
        headerRowHeight={headerHeight}
      />

      {!loading && rowsResolved.length === 0 && noValuesOverlay}
      {!loading && footerNode}
    </Box>
  );
}
