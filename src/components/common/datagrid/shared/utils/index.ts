import { dateToLocaleString, LocaleType } from "@/utils/converter";
import Regex from "@/utils/validation/Regex";
import { TooltipProps } from "@mui/material";
import { ReactNode } from "react";
import { Column, RenderCellProps } from "react-data-grid";
import { BaseDataGridColumnTooltip } from "../../BaseDataGrid";

export function renderValue<R, SR>(props: {
  row: R;
  column: Column<R, SR> & { type?: string | LocaleType };
}) {
  const { row, column } = props;
  const parts = column.key.split(".");

  let value: any = row;
  for (let i = 0; i < parts.length; i++) {
    if (value == null) return undefined;
    value = value[parts[i]];
  }

  const type = column.type;

  if (type === "date" || type === "datetime" || type === "time") {
    if (typeof value === "string" && Regex.ISO_REGEX.test(value)) {
      return dateToLocaleString(value, type as LocaleType) as ReactNode;
    } else if (value instanceof Date) {
      return dateToLocaleString(value, type as LocaleType) as ReactNode;
    }
  }

  return value as ReactNode;
}

export function resolveTooltip<R, SR>(
  toolTip?: BaseDataGridColumnTooltip,
  props?: RenderCellProps<R, SR>,
  defaultValue?: unknown,
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
    return toolTip;
  }

  return undefined;
}
