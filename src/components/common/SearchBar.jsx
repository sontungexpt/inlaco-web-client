import {
  IconButton,
  CircularProgress,
  InputAdornment,
  TextField,
  Popper,
  Paper,
  List,
  ListItemButton,
  Box,
  Stack,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useRef, useState, useCallback, Fragment } from "react";
import { useDebounced } from "@/hooks/useDebounced";

const SearchBar = ({
  value,
  placeholder = "Tìm kiếm...",
  debounce = 400,
  size = "small",
  minLength = 1,
  autoSearch = true,
  loading = false,
  disabled = false,

  /** dropdown */
  dropdown = false,
  options = [],
  renderOption = (opt) => opt?.label ?? String(opt),
  onSelectOption,

  onChange,
  onSearch,
  slotProps,
  sx,
  ...props
}) => {
  const isControlled = value !== undefined;
  const mountedRef = useRef(false);
  const skipDebounceRef = useRef(false);
  const anchorRef = useRef(null);

  const [internalValue, setInternalValue] = useState(value ?? "");
  const [open, setOpen] = useState(false);

  /** sync controlled */
  useEffect(() => {
    if (isControlled) setInternalValue(value ?? "");
  }, [value, isControlled]);

  const debouncedValue = useDebounced(internalValue || "", debounce);

  /** auto search */
  useEffect(() => {
    if (!autoSearch || !onSearch) return;
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }

    if (debouncedValue.length < minLength) {
      setOpen(false);
      return;
    }

    onSearch(debouncedValue);
    if (dropdown) setOpen(true);
  }, [debouncedValue, autoSearch, minLength, onSearch, dropdown]);

  const handleInputChange = useCallback(
    (e) => {
      const v = e.target.value;
      setInternalValue(v);
      onChange?.(v);

      if (dropdown) {
        setOpen(v.length >= minLength);
      }
    },
    [onChange, dropdown, minLength],
  );

  const handleClear = useCallback(() => {
    skipDebounceRef.current = true;
    setInternalValue("");
    setOpen(false);
    if (minLength > 0) return;
    onSearch?.("");
  }, [onSearch, minLength]);

  const handleEnter = useCallback(
    (e) => {
      if (e.key === "Enter") {
        skipDebounceRef.current = true;
        if (internalValue.length >= minLength) {
          onSearch?.(internalValue);
        }
        setOpen(false);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [internalValue, minLength, onSearch],
  );

  const handleSelect = (option) => {
    const label = typeof option === "string" ? option : (option?.label ?? "");

    skipDebounceRef.current = true;
    setInternalValue(label);
    setOpen(false);

    onSelectOption?.(option);
    onSearch?.(label);
  };

  return (
    <>
      <TextField
        fullWidth
        {...props}
        ref={anchorRef}
        value={internalValue}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
        onChange={handleInputChange}
        onKeyDown={handleEnter}
        sx={sx}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                {loading ? (
                  <CircularProgress size={18} />
                ) : (
                  <SearchRoundedIcon fontSize="small" />
                )}
              </InputAdornment>
            ),
            endAdornment:
              internalValue && !loading && !disabled ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClear}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
          },
          ...slotProps,
        }}
      />

      {/* ===== Dropdown ===== */}
      {dropdown && (
        <Popper
          open={open && options.length > 0}
          anchorEl={anchorRef.current}
          style={{
            zIndex: 1300,
            width: anchorRef.current?.getBoundingClientRect().width,
          }}
        >
          <Paper
            sx={{
              minWidth: anchorRef.current?.offsetWidth,
              mt: 0.5,
              maxHeight: 300,
              overflow: "auto",
            }}
          >
            <List dense>
              {options.map((opt, idx) => (
                <ListItemButton key={idx} onMouseDown={() => handleSelect(opt)}>
                  {renderOption(opt)}
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Popper>
      )}
    </>
  );
};

export default SearchBar;
