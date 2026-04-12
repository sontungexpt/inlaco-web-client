import "react-data-grid/lib/styles.css";
import { ReactNode } from "react";
import ErrorTooltip, { ErrorTooltipProps } from "../../ErrorTooltip";
import Color from "@/constants/Color";

export type BaseDataGridCellProps = {
  error?: string;
  toolTipProps?: Omit<ErrorTooltipProps, "children">;
  children: ReactNode;
};

export default function BaseDataGridCell({
  error,
  toolTipProps,
  children,
}: BaseDataGridCellProps) {
  const toolTipTitle = error || toolTipProps?.title;

  if (!toolTipTitle) {
    return children;
  }

  return (
    <ErrorTooltip
      {...toolTipProps}
      error={error}
      title={toolTipTitle}
      disableHoverListener={!toolTipTitle}
      wrapperProps={{
        ...toolTipProps?.wrapperProps,
        style: {
          ...toolTipProps?.wrapperProps?.style,
          position: "absolute",
          inset: 0,
          paddingInlineStart: "8px",
          paddingInlineEnd: "8px",
          borderInline: `var(--rdg-border-width) solid ${error ? Color.Error : "var(--rdg-border-color)"}`,
        },
      }}
    >
      {children}
    </ErrorTooltip>
  );
}
