import BaseDataGrid, {
  BaseDataGridProps,
  BaseDataGridColumn,
  BaseDataGridColumnOrColumnGroup,
  BaseDataGridColumnGroup,
  BaseDataGridRenderCellProps,
  BaseDataGridCalculatedColumn,
} from "./BaseDataGrid";
import { RenderEditCellProps } from "react-data-grid";
import { InfoTextField } from "../fields";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";

export type BaseEditableDataGridColumnOrColumnGroup<R, SR = unknown> =
  | BaseEditableDataGridColumn<R, SR>
  | BaseEditableDataGridColumnGroup<R, SR>;

export type BaseEditableDataGridColumnGroup<R, SR = unknown> = Omit<
  BaseDataGridColumnGroup<R, SR>,
  "children"
> & {
  children: BaseEditableDataGridColumnOrColumnGroup<R, SR>[];
};

export type BaseEditableDataGridRenderCellProps<R, SR = unknown> = Omit<
  BaseDataGridRenderCellProps<R, SR>,
  "column"
> & {
  column: BaseEditableDataGridColumn<R, SR>;
};

export type BaseEditableDataGridCalculatedColumn<
  R,
  SR = unknown,
> = BaseDataGridCalculatedColumn<R, SR> & {
  readonly renderCell: (
    props: BaseEditableDataGridRenderCellProps<R, SR>,
  ) => ReactNode;
};

export type BaseEditableDataGridRenderEditCellProps<R, SR = unknown> = Omit<
  RenderEditCellProps<R, SR>,
  "column"
> & {
  column: BaseEditableDataGridCalculatedColumn<R, SR>;
};

export type BaseEditableDataGridColumn<R, SR = unknown> = Omit<
  BaseDataGridColumn<R, SR>,
  "renderEditCell"
> & {
  readonly renderEditCell?: (
    props: BaseEditableDataGridRenderEditCellProps<R, SR>,
  ) => ReactNode;
};

export type useEditableDataGridProps<R, SR = unknown> = {
  rows: R[];
  setRows: Dispatch<SetStateAction<R[]>>;
  defaultNewRowValue?: (prevRows: R[]) => R;
  initialRows?: R[];
};

export function useEditableDataGrid<R, SR>({
  rows,
  setRows,
  defaultNewRowValue,
}: useEditableDataGridProps<R, SR>) {
  const addRow = useCallback(() => {
    const newRow =
      defaultNewRowValue?.(rows) ??
      ({
        id: crypto.randomUUID(),
      } as R);
    setRows((prev) => [newRow, ...prev]);
  }, [defaultNewRowValue]);

  return {
    rows,
    setRows,
    addRow,
  };
}

export type BaseEditableDataGridProps<R, SR> = Omit<
  BaseDataGridProps<R, SR>,
  "columns"
> & {
  columns: BaseEditableDataGridColumnOrColumnGroup<R, SR>[];
};

export function renderEditCell<R, SR>({
  row,
  column,
  onRowChange,
}: BaseEditableDataGridRenderEditCellProps<R, SR>) {
  const key = column.key as keyof R;

  return (
    <InfoTextField
      value={(row[key] ?? "") as string}
      type={column.type}
      onChange={(e) =>
        onRowChange({
          ...row,
          [key]: e.target.value,
        })
      }
      sx={{
        height: "100%",
        width: "100%",
      }}
    />
  );
}

function useCustomColumns<R, SR>(
  columns: readonly BaseEditableDataGridColumnOrColumnGroup<R, SR>[],
): BaseEditableDataGridColumnOrColumnGroup<R, SR>[] {
  return useMemo(() => {
    function transform(
      cols: readonly BaseEditableDataGridColumnOrColumnGroup<R, SR>[],
    ): BaseEditableDataGridColumnOrColumnGroup<R, SR>[] {
      return cols.map((col) => {
        if ("children" in col) {
          return {
            ...col,
            children: transform(col.children),
          } as BaseEditableDataGridColumnGroup<R, SR>;
        }
        if (col.renderEditCell) return col;
        return {
          ...col,
          renderEditCell,
        } as BaseEditableDataGridColumn<R, SR>;
      });
    }
    return transform(columns);
  }, [columns]);
}

export default function BaseEditableDataGrid<R, SR = unknown>({
  rows,
  columns,
  onRowsChange,
  ...props
}: BaseEditableDataGridProps<R, SR>) {
  const resolvedColumns = useCustomColumns<R, SR>(columns);

  return (
    <BaseDataGrid
      {...props}
      rows={rows}
      columns={resolvedColumns as BaseDataGridColumnOrColumnGroup<R, SR>[]}
      onRowsChange={onRowsChange}
    />
  );
}
