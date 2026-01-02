import { Box, IconButton } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Color from "@constants/Color";

const SearchBar = ({
  placeholder,
  value,
  backgroundColor = Color.PrimaryWhite,
  color = Color.PrimaryBlack,
  sx = [],
  onChange,
  onSearchClick,
}) => {
  return (
    <Box
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
      display="flex"
      backgroundColor={backgroundColor}
      borderRadius="3px"
    >
      <InputBase
        sx={{ ml: 2, flex: 1, color: color }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <IconButton
        onClick={onSearchClick}
        type="button"
        sx={{ p: 1, color: color }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
