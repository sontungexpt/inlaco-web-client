import BaseDataGrid, {
  BaseDataGridProps,
  BaseDataGridColumn,
  BaseDataGridColumnOrColumnGroup,
  BaseDataGridColumnGroup,
} from "./BaseDataGrid";
import { Box, Button } from "@mui/material";
import { RenderEditCellProps } from "react-data-grid";
import { InfoTextField } from "../fields";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";

export type BaseEditableDataGridColumnOrColumnGroup<R, SR> =
  | BaseEditableDataGridColumn<R, SR>
  | BaseEditableDataGridColumnGroup<R, SR>;

export type BaseEditableDataGridColumnGroup<R, SR> = BaseDataGridColumnGroup<
  R,
  SR
> & {
  children: BaseDataGridColumnOrColumnGroup<R, SR>[];
};

export type BaseEditableDataGridColumn<R, SR> = BaseDataGridColumn<R, SR> & {
  searchable?: boolean;
};

export type useEditableDataGridProps<R, SR> = {
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

export type BaseEditableDataGridProps<R, SR> = BaseDataGridProps<R, SR> & {
  initialRows?: R[];
  onAddRow?: () => void;
  errors: Record<string, string>;
};

export function renderEditCell<R, SR>({
  row,
  column,
  onRowChange,
  error,
}: RenderEditCellProps<R, SR> & {
  error?: string;
}) {
  const key = column.key as keyof R;
  console.log("errror", error);
  return (
    <InfoTextField
      value={(row[key] ?? "") as string}
      error={!!error}
      onChange={(e) =>
        onRowChange(
          {
            ...row,
            [key]: e.target.value,
          },
          false,
        )
      }
      fullWidth
      sx={{
        height: "100%",
        width: "100%",
      }}
    />
  );
}

function useCustomColumns<R, SR>(
  columns: readonly BaseEditableDataGridColumnOrColumnGroup<R, SR>[],
  errors: Record<string, string>,
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
  onAddRow,
  onRowsChange,
  errors,
  ...props
}: BaseEditableDataGridProps<R, SR>) {
  const resolvedColumns = useCustomColumns<R, SR>(columns, errors);

  return (
    <BaseDataGrid
      {...props}
      rows={rows}
      columns={resolvedColumns}
      onRowsChange={onRowsChange}
      toolbar={
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button variant="outlined" size="small" onClick={() => onAddRow?.()}>
            + Add row
          </Button>
        </Box>
      }
    />
  );
}
