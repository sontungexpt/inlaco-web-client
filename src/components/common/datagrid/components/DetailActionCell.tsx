import { IconButtonProps, IconButton } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Color from "@constants/Color";

export type DetailActionCellProps = IconButtonProps & {};

const DetailActionCell = ({ ...props }: DetailActionCellProps) => {
  return (
    <IconButton
      size="small"
      {...props}
      sx={{
        color: Color.PrimaryBlue,
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.04)",
        },
      }}
    >
      <ArrowForwardIosRoundedIcon fontSize="small" />
    </IconButton>
  );
};

export default DetailActionCell;
