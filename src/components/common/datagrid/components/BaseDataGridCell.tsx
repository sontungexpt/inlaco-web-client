import "react-data-grid/lib/styles.css";
import { ReactNode } from "react";
import Tooltip, { TooltipProps } from "@/components/common/Tooltip";
import { useCellError } from "../shared/use-cell-error";
import { useDataGridContext } from "../shared/context";
import { resolveTooltip } from "../shared/utils";
import { BaseDataGridRenderCellProps } from "../BaseDataGrid";

export type BaseDataGridCellProps<R, SR> = BaseDataGridRenderCellProps<
  R,
  SR
> & {
  error?: string;
  toolTipProps?: Omit<TooltipProps, "children">;
  children: ReactNode;
};

export default function BaseDataGridCell<R, SR>({
  children,
  ...props
}: BaseDataGridCellProps<R, SR>) {
  const { row, rowIdx, column } = props;
  const { errorStore, globalTooltip, rowKeyGetter } = useDataGridContext();

  const error = useCellError<R, SR>({
    row,
    rowIdx,
    column,
    store: errorStore,
    rowKeyGetter,
  });

  // resolve tooltip only when no error
  const toolTipProps = !error
    ? resolveTooltip(column.toolTip || globalTooltip, props, children)
    : undefined;

  const title = error || toolTipProps?.title;

  if (!title) return children;

  return (
    <Tooltip
      {...toolTipProps}
      error={!!error}
      title={title}
      slotProps={{
        container: {
          style: {
            position: "absolute",
            inset: 0,
            paddingInline: "8px",
            border: `var(--rdg-border-width) solid ${
              error
                ? "var(--rdg-error-border-color)"
                : "var(--rdg-border-color)"
            }`,
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
