import {
  IconButton,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useRef, useState, useCallback } from "react";
import Color from "@constants/Color";
import { useDebounced } from "@/hooks/useDebounced";

const SearchBar = ({
  value,
  placeholder = "Tìm kiếm...",
  backgroundColor = Color.PrimaryWhite,
  borderColor = Color.PrimaryBlackPlaceHolder,
  debounce = 400,
  size,
  minLength = 1,
  autoSearch = true,
  loading = false,
  disabled = false,
  sx,
  onChange,
  onSearch,
  slotProps,
  ...props
}) => {
  const isControlled = value !== undefined;
  const mountedRef = useRef(false);
  const skipDebounceRef = useRef(false);

  const [internalValue, setInternalValue] = useState(value ?? "");

  /** sync controlled */
  useEffect(() => {
    if (isControlled) setInternalValue(value ?? "");
  }, [value, isControlled]);

  const debouncedValue = useDebounced(internalValue, debounce);

  /** debounced search */
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

    if (debouncedValue.length < minLength) return;

    onSearch(debouncedValue);
  }, [debouncedValue, autoSearch, minLength, onSearch]);

  const handleChange = useCallback(
    (e) => {
      const v = e.target.value;
      setInternalValue(v);
      onChange?.(v);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    skipDebounceRef.current = true;
    setInternalValue("");
    onSearch?.("");
  }, [onSearch]);

  const handleEnter = useCallback(
    (e) => {
      if (e.key === "Enter") {
        skipDebounceRef.current = true;
        if (internalValue.length >= minLength) {
          onSearch?.(internalValue);
        }
      }
    },
    [internalValue, minLength, onSearch],
  );

  return (
    <TextField
      {...props}
      value={internalValue}
      disabled={disabled}
      placeholder={placeholder}
      size={size}
      fullWidth
      onChange={handleChange}
      onKeyDown={handleEnter}
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

          endAdornment: internalValue && !loading && !disabled && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
        ...slotProps,
      }}
    />
  );
};

export default SearchBar;
