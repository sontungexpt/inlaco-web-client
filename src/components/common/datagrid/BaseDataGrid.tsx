import "react-data-grid/lib/styles.css";
import {
  Column,
  ColumnGroup,
  ColumnOrColumnGroup,
  DataGrid,
  DataGridProps,
  RenderCellProps,
  renderValue,
} from "react-data-grid";

import Skeleton from "@mui/material/Skeleton";
import Color from "@constants/Color";
import { isValidElement, cloneElement, ReactNode, useMemo } from "react";
import NoValuesOverlay from "./NoValuesOverlay";
import { Box, Tooltip } from "@mui/material";

export interface RGBColumn<R, SR = unknown> extends Column<R, SR> {
  toolTip?: ((props: RenderCellProps<R, SR>) => ReactNode) | ReactNode;
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
  globalTooltip?: ((props: RenderCellProps<R, SR>) => ReactNode) | ReactNode;
};

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
function injectSkeletonToColumns<R, SR>(
  columns: readonly ColumnOrColumnGroup<R, SR>[],
  globalTooltip?: ((props: RenderCellProps<R, SR>) => ReactNode) | ReactNode,
): readonly ColumnOrColumnGroup<R, SR>[] {
  return columns.map((col: ColumnOrColumnGroup<R, SR>) => {
    if ("children" in col) {
      // group
      return {
        ...col,
        children: injectSkeletonToColumns(col.children),
      } as ColumnGroup<R, SR>;
    }

    const baseRender = col.renderCell;

    return {
      ...col,
      renderCell: (p: RenderCellProps<R & { ____loading: boolean }, SR>) => {
        if (p.row.____loading)
          return renderSkeletonCell<R, SR>(p as RenderCellProps<R, SR>);
        const value =
          baseRender?.(p as RenderCellProps<R, SR>) ?? renderValue(p);

        let toolTip = (col as RGBColumn<R, SR>).toolTip ?? globalTooltip;
        if (typeof toolTip === "function") {
          toolTip = toolTip(p as RenderCellProps<R, SR>);
        }

        if (isValidElement(toolTip)) {
          return cloneElement(toolTip, {}, value);
        }

        if (
          toolTip === false || // disable explicit
          toolTip === "" // empty string
        ) {
          return value;
        }

        const props = {
          title: "",
        };

        if (typeof toolTip === "string") {
          props.title = toolTip;
        } else if (
          (toolTip == null || toolTip === true) &&
          ((typeof value === "string" && value.length > 0) ||
            typeof value === "number" ||
            typeof value === "boolean")
        ) {
          props.title = String(value);
        }

        return (
          <Tooltip placement="bottom-start" arrow {...props}>
            <div style={{ width: "100%" }}>{value}</div>
          </Tooltip>
        );
      },
    } as Column<R, SR>;
  });
}

const DEFAULT_RDG_VARS: RDGStyle = {
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

const DEFAULT_ROW_HEIGHT = 44;

export default function BaseDataGrid<R, SR = unknown>({
  rows,
  columns,
  loading,
  style,

  globalTooltip, // If is a function should use useMemo to memoize

  skeletonCount,
  showSkeletonTail = false,

  noValuesOverlay = <NoValuesOverlay />,
  footer,

  headerRowHeight,
  rowHeight = DEFAULT_ROW_HEIGHT,
  footerRowHeight,

  ...props
}: BaseDataGridProps<R, SR>) {
  const baseRowHeight =
    typeof rowHeight === "number" ? rowHeight : DEFAULT_ROW_HEIGHT;
  const headerHeight = headerRowHeight ?? baseRowHeight;
  const footerHeight = footerRowHeight ?? headerHeight;

  const skeletonRows = useMemo(() => {
    return createSkeletonRows(Math.min(skeletonCount ?? 5, 10)) as R[];
  }, [skeletonCount]);

  const rowsResolved = useMemo(() => {
    if (!loading) {
      return rows;
    }
    if (!rows.length || !showSkeletonTail) {
      return skeletonRows;
    }
    return [...rows, ...skeletonRows];
  }, [rows, loading, skeletonRows]);
  const isEmpty = rowsResolved.length === 0;

  const columnsResolved = useMemo(() => {
    return injectSkeletonToColumns(columns, globalTooltip);
  }, [columns, globalTooltip]);

  const footerNode = useMemo(() => {
    if (!footer) return null;
    if (!isValidElement(footer)) {
      throw new Error("footer must be ReactNode");
    }
    return cloneElement<any>(footer, {
      height: footerHeight,
    });
  }, [footer]);

  const dataGridStyle = useMemo(() => {
    return {
      ...DEFAULT_RDG_VARS,
      height: "auto",
      maxHeight: 450,
      ...style,
    };
  }, [style]);

  return (
    <Box sx={DEFAULT_RDG_VARS}>
      <DataGrid
        {...props}
        style={dataGridStyle}
        rows={rowsResolved}
        columns={columnsResolved}
        rowHeight={rowHeight} // use row height because it allows dynamic row height
        headerRowHeight={headerHeight}
      />
      {isEmpty && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderStyle: "solid",
            borderWidth: "var(--rdg-border-width)",
            borderColor: "var(--rdg-border-color)",
          }}
        >
          {noValuesOverlay}
        </Box>
      )}
      {!loading && footerNode}
    </Box>
  );
}
