import Color from "@/constants/Color";

export type RDGStyle = React.CSSProperties & {
  [key: `--rdg-${string}`]: string;
};

export const DEFAULT_RDG_VARS: RDGStyle = {
  "--rdg-font-size": "14px",
  "--rdg-color": Color.TextPrimary,

  "--rdg-background-color": Color.PrimaryWhite,

  "--rdg-header-background-color": Color.SecondaryBlue,
  "--rdg-header-draggable-background-color": Color.PrimaryBlue,

  "--rdg-row-hover-background-color": Color.HoverOverlay,
  "--rdg-row-selected-background-color": "rgba(77, 133, 216, 0.12)",
  "--rdg-row-selected-hover-background-color": Color.ActiveOverlay,

  "--rdg-selection-width": "2px",
  "--rdg-selection-color": Color.PrimaryBlue,

  "--rdg-border-color": Color.PrimaryBlack,
  "--rdg-border-width": "1px",

  "--rdg-checkbox-focus-color": Color.PrimaryBlue,
} as const;

export const DEFAULT_RDG_ROW_HEIGHT = 44;
