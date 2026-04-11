import "react-data-grid/lib/styles.css";
import {
  Column,
  ColumnGroup,
  DataGrid,
  DataGridHandle,
  DataGridProps,
  RenderCellProps,
} from "react-data-grid";

import Skeleton from "@mui/material/Skeleton";
import {
  isValidElement,
  cloneElement,
  ReactNode,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import NoValuesOverlay from "./NoValuesOverlay";
import { Box, Tooltip } from "@mui/material";
import {
  DEFAULT_RDG_ROW_HEIGHT,
  DEFAULT_RDG_VARS,
  RDGStyle,
} from "./constants";
import { enhanceBar } from "./BaseDataGridBar";

export type BaseDataGridColumn<R, SR = unknown> = Column<R, SR> & {
  toolTip?: ((props: RenderCellProps<R, SR>) => ReactNode) | ReactNode;
};

export type BaseDataGridColumnGroup<R, SR = unknown> = ColumnGroup<R, SR> & {
  children: BaseDataGridColumnOrColumnGroup<R, SR>[];
};

export type BaseDataGridColumnOrColumnGroup<R, SR = unknown> =
  | BaseDataGridColumn<R, SR>
  | BaseDataGridColumnGroup<R, SR>;

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

export function renderValue<R, SR>(props: {
  row: R;
  column: BaseDataGridColumn<R, SR>;
}) {
  const key = props.column.key;
  const value = key.split(".").reduce<any>((acc, part) => {
    return acc?.[part];
  }, props.row);
  return value as React.ReactNode;
}

function useCustomColumns<R, SR>(
  columns: readonly BaseDataGridColumnOrColumnGroup<R, SR>[],
  globalTooltip?: any,
): BaseDataGridColumnOrColumnGroup<R, SR>[] {
  return useMemo(() => {
    function transform(
      cols: readonly BaseDataGridColumnOrColumnGroup<R, SR>[],
    ): BaseDataGridColumnOrColumnGroup<R, SR>[] {
      return cols.map((col) => {
        if ("children" in col) {
          return {
            ...col,
            children: transform(col.children),
          };
        }

        return {
          ...col,
          renderCell: (
            p: RenderCellProps<R & { ____loading: boolean }, SR>,
          ) => {
            if (p.row.____loading)
              return renderSkeletonCell<R, SR>(p as RenderCellProps<R, SR>);

            const value =
              col.renderCell?.(p as RenderCellProps<R, SR>) ?? renderValue(p);

            let toolTip =
              (col as BaseDataGridColumn<R, SR>).toolTip ?? globalTooltip;
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
        } as BaseDataGridColumn<R, SR>;
      });
    }

    return transform(columns);
  }, [columns, globalTooltip]);
}

function useCustomRows<R, SR>(
  rows: readonly R[],
  skeletonCount?: number,
  loading?: boolean,
  showSkeletonTail?: boolean,
) {
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

  return rowsResolved;
}

function useCompatibleGridWidth(node: ReactNode, gridWidth: number) {
  return useMemo(
    () =>
      enhanceBar(node, {
        width: (node as any)?.props?.width ?? gridWidth,
      }),
    [node, gridWidth],
  );
}

function useGridSize(gridRef: React.RefObject<DataGridHandle | null>) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = gridRef.current?.element;
    if (!el) return;

    const update = () => {
      setWidth(el.getBoundingClientRect().width);
    };

    update(); // init
    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  return { width };
}

export type BaseDataGridProps<R, SR> = Omit<
  DataGridProps<R, SR>,
  "style" | "columns"
> & {
  columns: BaseDataGridColumnOrColumnGroup<R, SR>[];
  style?: RDGStyle;
  loading?: boolean;
  noValuesOverlay?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  skeletonCount?: number;
  showSkeletonTail?: boolean;
  globalTooltip?: ((props: RenderCellProps<R, SR>) => ReactNode) | ReactNode;
};

export default function BaseDataGrid<R, SR = unknown>({
  rows,
  columns,
  loading,
  style,

  toolbar,
  globalTooltip, // If is a function should use useMemo to memoize

  skeletonCount,
  showSkeletonTail = false,

  noValuesOverlay = <NoValuesOverlay />,

  footer,

  rowHeight = DEFAULT_RDG_ROW_HEIGHT,
  headerRowHeight,

  defaultColumnOptions,

  ...props
}: BaseDataGridProps<R, SR>) {
  const baseRowHeight =
    typeof rowHeight === "number" ? rowHeight : DEFAULT_RDG_ROW_HEIGHT;
  const headerHeight = headerRowHeight ?? baseRowHeight;

  const gridRef = useRef<DataGridHandle>(null);
  const { width: gridWidth } = useGridSize(gridRef);

  const columnsResolved = useCustomColumns(columns, globalTooltip);
  const rowsResolved = useCustomRows(
    rows,
    skeletonCount,
    loading,
    showSkeletonTail,
  );
  const isEmpty = rowsResolved.length === 0;

  const dataGridStyle = useMemo(
    () => ({
      ...DEFAULT_RDG_VARS,
      maxHeight: "90vh",
      ...style,
    }),
    [style],
  );

  const footerNode = useCompatibleGridWidth(footer, gridWidth);
  const toolbarNode = useCompatibleGridWidth(toolbar, gridWidth);

  return (
    <Box sx={DEFAULT_RDG_VARS}>
      {toolbarNode}

      <Box sx={{ position: "relative" }}>
        <DataGrid
          {...props}
          defaultColumnOptions={{
            resizable: true,
            sortable: true,
            ...defaultColumnOptions,
          }}
          ref={gridRef}
          style={dataGridStyle}
          rows={rowsResolved}
          columns={columnsResolved}
          rowHeight={rowHeight}
          headerRowHeight={headerHeight}
        />
        {!loading && isEmpty && (
          <Box
            sx={{
              position: "absolute",
              width: gridWidth,

              top: headerHeight,
              left: 0,
              right: 0,
              bottom: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              pointerEvents: "none",
            }}
          >
            {noValuesOverlay}
          </Box>
        )}
      </Box>

      {footerNode}
    </Box>
  );
}
