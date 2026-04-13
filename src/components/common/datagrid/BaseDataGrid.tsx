import "react-data-grid/lib/styles.css";
import "./shared/css/base.css";

import {
  CalculatedColumn,
  Cell,
  CellRendererProps,
  Column,
  ColumnGroup,
  DataGrid,
  DataGridHandle,
  DataGridProps,
  RenderCellProps,
  Renderers,
} from "react-data-grid";
import {
  ReactNode,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useSyncExternalStore,
} from "react";
import NoValuesOverlay from "./components/NoValuesOverlay";
import { Box, css } from "@mui/material";
import {
  DEFAULT_RDG_ROW_HEIGHT,
  DEFAULT_RDG_VARS,
  RDGStyle,
} from "./shared/constants";

import { renderValue, resolveTooltip } from "./shared/utils";
import {
  createSkeletonRows,
  renderSkeletonCell,
  SkeletonCell,
} from "./shared/utils/skeleton";

import { LocaleType } from "@/utils/converter";
import BaseDataGridCell from "./components/BaseDataGridCell";
import Color from "@/constants/Color";
import { DataGridContextProvider } from "./shared/context";
import { GetCellError } from "./shared/error-store";

export type BaseDataGridLoadingRow = {
  ____loading: boolean;
};

export type BaseDataGridErrors = Record<
  string,
  Record<string, string | undefined>
>;

export type BaseDataGridColumnTooltip =
  | (<R, SR>(props: RenderCellProps<R, SR>) => BaseDataGridColumnTooltip)
  | object
  | string
  | boolean
  | null
  | undefined;

export type BaseDataGridColumn<R, SR = unknown> = Column<R, SR> & {
  type?: string | LocaleType;
  toolTip?: BaseDataGridColumnTooltip;
};

export type BaseDataGridColumnGroup<R, SR = unknown> = Omit<
  ColumnGroup<R, SR>,
  "children"
> & {
  children: BaseDataGridColumnOrColumnGroup<R, SR>[];
};

export type BaseDataGridCalculatedColumn<R, SR = unknown> = Omit<
  CalculatedColumn<R, SR> & BaseDataGridColumn<R, SR>,
  "renderCell"
> & {
  readonly renderCell?: (
    props: BaseDataGridRenderCellProps<R, SR>,
  ) => ReactNode;
};

export type BaseDataGridColumnOrColumnGroup<R, SR = unknown> =
  | BaseDataGridColumn<R, SR>
  | BaseDataGridColumnGroup<R, SR>;

export type BaseDataGridCellRendererProps<R, SR = unknown> = Omit<
  CellRendererProps<R, SR>,
  "column"
> & {
  column: BaseDataGridColumn<R, SR>;
};

export type BaseDataGridRenderCellProps<R, SR = unknown> = Omit<
  RenderCellProps<R, SR>,
  "column"
> & {
  column: BaseDataGridCalculatedColumn<R, SR>;
};

function useCustomColumns<R, SR>(
  columns: readonly BaseDataGridColumnOrColumnGroup<R, SR>[],
) {
  return useMemo(() => {
    function transform(
      cols: readonly BaseDataGridColumnOrColumnGroup<R, SR>[],
    ): BaseDataGridColumnOrColumnGroup<R, SR>[] {
      return cols.map((col) => {
        if ("children" in col) {
          return {
            ...col,
            children: transform(col.children),
          } as BaseDataGridColumnGroup<R, SR>;
        }

        return {
          ...col,
          renderCell: (
            props: RenderCellProps<R & BaseDataGridLoadingRow, SR>,
          ) => {
            const { row } = props;
            if (row.____loading) {
              return renderSkeletonCell(props);
            }

            const value =
              col.renderCell?.(props as RenderCellProps<R, SR>) ??
              renderValue(props);

            return <BaseDataGridCell {...props} children={value} />;
          },
        } as BaseDataGridColumn<R, SR>;
      });
    }

    return transform(columns);
  }, [columns]);
}

function useCustomRows<R>(
  rows: readonly R[],
  loading: boolean = false,
  skeletonCount: number = 5,
  showSkeletonTail: boolean = false,
) {
  return useMemo(() => {
    if (!loading) return rows;

    const skeletonRows = createSkeletonRows(
      Math.min(skeletonCount ?? 5, 10),
    ) as R[];

    if (!rows.length || !showSkeletonTail) {
      return skeletonRows;
    }

    return [...rows, ...skeletonRows];
  }, [rows, loading, skeletonCount, showSkeletonTail]);
}

function useDataGridSize(gridRef: React.RefObject<DataGridHandle | null>) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = gridRef.current?.element;
    if (!el) return;

    let frameId: number | null = null;

    const update = () => {
      setWidth(el.getBoundingClientRect().width);
    };

    const ro = new ResizeObserver(() => {
      // batch update rAF for better performance
      if (frameId != null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(update);
    });

    ro.observe(el);

    update(); // init

    return () => {
      ro.disconnect();
      if (frameId != null) cancelAnimationFrame(frameId);
    };
  }, [gridRef]);

  return { width };
}

export type BaseDataGridProps<R, SR> = Omit<
  DataGridProps<R, SR>,
  "style" | "columns"
> & {
  columns: readonly BaseDataGridColumnOrColumnGroup<R, SR>[];
  style?: RDGStyle;
  loading?: boolean;
  noValuesOverlay?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  skeletonCount?: number;
  showSkeletonTail?: boolean;
  globalTooltip?: ((props: RenderCellProps<R, SR>) => ReactNode) | ReactNode;
  getCellError?: GetCellError<R, SR>;
};

export default function BaseDataGrid<R, SR = unknown>({
  rows,
  columns,

  loading,
  rowKeyGetter,

  rowHeight = DEFAULT_RDG_ROW_HEIGHT,
  headerRowHeight = DEFAULT_RDG_ROW_HEIGHT,

  toolbar,
  footer,
  noValuesOverlay = <NoValuesOverlay />,

  globalTooltip, // If is a function should use useMemo to memoize

  skeletonCount,
  showSkeletonTail = false,

  defaultColumnOptions,

  style,
  getCellError,

  ...props
}: BaseDataGridProps<R, SR>) {
  const gridRef = useRef<DataGridHandle>(null);
  const { width: gridWidth } = useDataGridSize(gridRef);

  const columnsResolved = useCustomColumns(columns);
  const rowsResolved = useCustomRows(
    rows,
    loading,
    skeletonCount,
    showSkeletonTail,
  );

  const isEmpty = rowsResolved.length === 0;

  const dataGridStyle = useMemo(
    () => ({
      ...DEFAULT_RDG_VARS,
      maxHeight: "90vh",
      ...style,
    }),
    [style, isEmpty],
  );

  return (
    <Box sx={DEFAULT_RDG_VARS}>
      <div style={{ width: gridWidth }}>{toolbar}</div>

      <Box sx={{ position: "relative" }}>
        <DataGridContextProvider
          globalTooltip={globalTooltip}
          getCellError={getCellError}
          rowKeyGetter={rowKeyGetter}
        >
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
            rowKeyGetter={rowKeyGetter}
            headerRowHeight={headerRowHeight}
          />
        </DataGridContextProvider>

        {!loading && isEmpty && (
          <div
            style={{
              position: "absolute",
              width: gridWidth,

              top: `${headerRowHeight}px`,
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
          </div>
        )}
      </Box>

      <div style={{ width: gridWidth }}>{footer}</div>
    </Box>
  );
}
