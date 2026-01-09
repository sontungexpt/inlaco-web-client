import { styled, Tooltip } from "@mui/material";

const ErrorTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  "& .MuiTooltip-arrow": {
    color: theme.palette.error.main,
  },
}));

const ErrorWrapper = ({ error, children }) => {
  if (!error) return children;

  return (
    <ErrorTooltip placement="top-start" title={error} open>
      <span
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          // borderColor: error ?? "error.main",
          // borderWidth: 1,
          // borderStyle: "solid",
        }}
      >
        {children}
      </span>
    </ErrorTooltip>
  );
};

export default ErrorWrapper;
