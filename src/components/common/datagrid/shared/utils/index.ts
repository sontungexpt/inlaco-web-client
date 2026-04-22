import { dateToLocaleString, LocaleType } from "@/utils/converter";
import Regex from "@/utils/validation/Regex";
import { ReactNode } from "react";
import { Column } from "react-data-grid";
import {
  BaseDataGridColumnTooltip,
  BaseDataGridRenderCellProps,
} from "../../BaseDataGrid";
import { TooltipProps } from "@/components/common/Tooltip";

export function renderValue<R, SR>(props: {
  row: R;
  column: Column<R, SR> & { type?: string | LocaleType };
}): ReactNode {
  const { row, column } = props;
  const parts = column.key.split(".");

  let value: any = row;
  for (let i = 0; i < parts.length; i++) {
    if (value == null) return undefined;
    value = value[parts[i]];
  }

  const type = column.type;

  if (type === "date" || type === "datetime" || type === "time") {
    return dateToLocaleString(value, type as LocaleType) || value;
  }

  return value as ReactNode;
}

export function resolveTooltip<R, SR>(
  toolTip?: BaseDataGridColumnTooltip,
  props?: BaseDataGridRenderCellProps<R, SR>,
  defaultValue?: ReactNode,
): Omit<TooltipProps, "children"> | undefined {
  if (typeof toolTip === "function") {
    toolTip = toolTip(props as any);
  }

  if (toolTip === false || toolTip === "") {
    return undefined;
  }

  // string → direct
  else if (typeof toolTip === "string") {
    return { title: toolTip };
  }

  // boolean true / null / undefined → fallback to value
  else if (toolTip == null || toolTip === true) {
    const valueType = typeof defaultValue;
    if (
      valueType === "string" ||
      valueType === "number" ||
      valueType === "boolean"
    ) {
      return { title: String(defaultValue) };
    }

    return undefined;
  }

  // object → assume already valid tooltip props
  if (typeof toolTip === "object") {
    return toolTip as TooltipProps;
  }

  return undefined;
}
