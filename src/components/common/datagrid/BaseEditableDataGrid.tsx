import BaseDataGrid, {
  BaseDataGridProps,
  BaseDataGridColumn,
  BaseDataGridColumnOrColumnGroup,
  BaseDataGridColumnGroup,
  BaseDataGridErrors,
} from "./BaseDataGrid";
import { Box, Button, ButtonProps } from "@mui/material";
import { RenderEditCellProps } from "react-data-grid";
import { InfoTextField } from "../fields";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import BaseEditableDataGridToolbar from "./components/BaseEditableDataGridToolbar";

export type BaseEditableDataGridColumnOrColumnGroup<R, SR = unknown> =
  | BaseEditableDataGridColumn<R, SR>
  | BaseEditableDataGridColumnGroup<R, SR>;

export type BaseEditableDataGridColumnGroup<R, SR = unknown> = Omit<
  BaseDataGridColumnGroup<R, SR>,
  "children"
> & {
  children: BaseDataGridColumnOrColumnGroup<R, SR>[];
};

export type BaseEditableDataGridColumn<R, SR = unknown> = BaseDataGridColumn<
  R,
  SR
> & {
  searchable?: boolean;
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

type WithToolbar<R, SR> = {
  toolbar: BaseDataGridProps<R, SR>["toolbar"];
  onNewRowClick?: never;
};

type WithoutToolbar = {
  toolbar?: never;
  onNewRowClick: ButtonProps["onClick"];
};

export type BaseEditableDataGridProps<R, SR> = Omit<
  BaseDataGridProps<R, SR>,
  "toolbar"
> &
  (WithToolbar<R, SR> | WithoutToolbar) & {};

export function renderEditCell<R, SR>({
  row,
  column,
  onRowChange,
  error,
}: RenderEditCellProps<R, SR> & {
  error?: string;
}) {
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
  errors?: BaseDataGridErrors,
): BaseEditableDataGridColumnOrColumnGroup<R, SR>[] {
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
          renderEditCell: (props: RenderEditCellProps<R, SR>) => {
            const { rowIdx, column } = props;
            const error = (errors as any)[rowIdx][column.key];

            return renderEditCell({
              ...props,
              error,
            });
          },
        };
      });
    }
    return transform(columns);
  }, [columns, errors]);
}

export default function BaseEditableDataGrid<R, SR = unknown>({
  rows,
  columns,
  onNewRowClick,
  onRowsChange,
  errors,
  toolbar,
  ...props
}: BaseEditableDataGridProps<R, SR>) {
  const resolvedColumns = useCustomColumns<R, SR>(columns, errors);

  return (
    <BaseDataGrid
      {...props}
      rows={rows}
      errors={errors}
      columns={resolvedColumns}
      onRowsChange={onRowsChange}
      toolbar={
        toolbar ?? <BaseEditableDataGridToolbar onNewRowClick={onNewRowClick} />
      }
    />
  );
}
