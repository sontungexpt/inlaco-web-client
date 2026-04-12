import "react-data-grid/lib/styles.css";
import "./shared/css/base.css";

import {
  Column,
  ColumnGroup,
  DataGrid,
  DataGridHandle,
  DataGridProps,
  RenderCellProps,
} from "react-data-grid";
import { ReactNode, useMemo, useRef, useState, useLayoutEffect } from "react";
import NoValuesOverlay from "./components/NoValuesOverlay";
import { Box } from "@mui/material";
import {
  DEFAULT_RDG_ROW_HEIGHT,
  DEFAULT_RDG_VARS,
  RDGStyle,
} from "./shared/constants";

import { enhanceBar } from "./components/BaseDataGridBar";
import { renderValue, resolveTooltip } from "./shared/utils";
import {
  createSkeletonRows,
  renderSkeletonCell,
} from "./shared/utils/skeleton";

import { LocaleType } from "@/utils/converter";
import BaseDataGridCell from "./components/BaseDataGridCell";

export type BaseDataGridRowPrivateFields = {
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

export type BaseDataGridColumnOrColumnGroup<R, SR = unknown> =
  | BaseDataGridColumn<R, SR>
  | BaseDataGridColumnGroup<R, SR>;

function useCustomColumns<R, SR>(
  columns: readonly BaseDataGridColumnOrColumnGroup<R, SR>[],
  globalTooltip?: any,
  errors?: BaseDataGridErrors,
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
            props: RenderCellProps<R & BaseDataGridRowPrivateFields, SR>,
          ) => {
            const { row, rowIdx } = props;
            if (row.____loading) {
              return renderSkeletonCell(props as any);
            }

            const value = col.renderCell?.(props as any) ?? renderValue(props);
            const error = errors?.[rowIdx]?.[col.key as string];

            // fast path
            const toolTipProps = error
              ? undefined
              : resolveTooltip(col.toolTip || globalTooltip, props, value);

            return (
              <BaseDataGridCell
                error={error}
                toolTipProps={toolTipProps}
                children={value}
              />
            );
          },
        } as BaseDataGridColumn<R, SR>;
      });
    }

    return transform(columns);
  }, [columns, globalTooltip, errors]);
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
  columns: BaseDataGridColumnOrColumnGroup<R, SR>[];
  style?: RDGStyle;
  loading?: boolean;
  noValuesOverlay?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  skeletonCount?: number;
  showSkeletonTail?: boolean;
  globalTooltip?: ((props: RenderCellProps<R, SR>) => ReactNode) | ReactNode;
  errors?: BaseDataGridErrors;
};

export default function BaseDataGrid<R, SR = unknown>({
  rows,
  columns,

  loading,

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
  errors,

  ...props
}: BaseDataGridProps<R, SR>) {
  const gridRef = useRef<DataGridHandle>(null);
  const { width: gridWidth } = useDataGridSize(gridRef);

  const columnsResolved = useCustomColumns(columns, globalTooltip, errors);
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
          headerRowHeight={headerRowHeight}
        />

        {!loading && isEmpty && (
          <Box
            sx={{
              position: "absolute",
              width: gridWidth,

              top: headerRowHeight,
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

      <div style={{ width: gridWidth }}>{footer}</div>
    </Box>
  );
}
