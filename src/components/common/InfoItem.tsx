import { Box, Stack, StackProps, Typography } from "@mui/material";
import { resolveComponent } from "@/utils/component";
import { dateToLocaleString, LocaleType } from "@/utils/converter";
import { ReactNode } from "react";

const formatDisplayValue = (value: unknown, type?: string | LocaleType) => {
  if (!value) return "--";
  if (!type) return value;
  else if (["date", "datetime-local", "time"].includes(type)) {
    return (
      dateToLocaleString(
        value as Date | string,
        type === "datetime-local" ? "datetime" : (type as LocaleType),
      ) || "--"
    );
  }
  return value ?? "--";
};

export type InfoItemProps = StackProps & {
  label: string;
  value: unknown;
  type?: string;
  color?: string;
  onClick?: () => void;
  highlight?: boolean;
  bold?: boolean;
  icon?: string;
  iconColor?: string;
};

export default function InfoItem({
  label,
  value,
  type,
  color,
  onClick,
  highlight = false,
  bold = false,
  icon,
  iconColor = "primary",
  ...props
}: InfoItemProps) {
  const valueColor = color || (highlight ? "primary.main" : "text.primary");
  const fontWeight = bold || highlight ? 600 : 500;

  return (
    <Stack spacing={1.2} direction="row" alignItems="center" {...props}>
      {icon &&
        resolveComponent(icon, {
          color: iconColor,
        })}
      <Box>
        {/* Label */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 0.5,
            fontSize: 13,
          }}
        >
          {label}
        </Typography>

        {/* Value */}
        <Typography
          variant="body1"
          sx={{
            fontWeight,
            color: valueColor,
            fontSize: highlight ? 16 : 14,
          }}
        >
          {formatDisplayValue(value, type) as ReactNode}
        </Typography>
      </Box>
    </Stack>
  );
}
