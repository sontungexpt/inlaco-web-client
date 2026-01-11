import {
  IconButton,
  CircularProgress,
  InputAdornment,
  TextField,
  Popper,
  Paper,
  List,
  ListItemButton,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDebounced } from "@/hooks/useDebounced";

const SOURCE = {
  USER: "user",
  INTERNAL: "internal",
};

const SearchBar = ({
  value,
  placeholder = "Tìm kiếm...",
  showSearchIcon = true,
  debounceMs = 300,
  disabled = false,
  size = "small",
  minLength = 1,

  autoSearch = true,
  searchOnMount = false,
  searchAfterClear = false,
  suppressSearchOnValueChange = false,

  loading,
  dropdown = false,
  options = [],
  renderOption = (opt) => opt?.label ?? String(opt),
  mapOptionToValue,
  onSelectOption,

  onChange,
  onSearch,
  slotProps,
  sx,
  ...props
}) => {
  /* =========================
   * State & Refs
   * ========================= */
  const isControlled = value !== undefined;
  const [inputValue, setInputValue] = useState(value ?? "");
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const [innerLoading, setInnerLoading] = useState(false);

  const debouncedValue = useDebounced(inputValue, debounceMs);
  const finalLoading = typeof loading === "boolean" ? loading : innerLoading;

  const listRef = useRef([]);
  const changeSourceRef = useRef(SOURCE.INTERNAL);
  const anchorRef = useRef(null);
  const mountedRef = useRef(false);

  /* =========================
   * Helpers
   * ========================= */
  const shouldSearch = (keyword) =>
    Boolean(onSearch) && keyword.length >= minLength;

  const clampIndex = (idx) => {
    if (idx < 0) return options.length - 1;
    if (idx >= options.length) return 0;
    return idx;
  };

  const runSearch = useCallback(
    async (keyword) => {
      if (!shouldSearch(keyword)) {
        setDropdownOpened(false);
        return;
      }

      try {
        if (typeof loading !== "boolean") {
          setInnerLoading(true);
        }
        const res = onSearch?.(keyword);
        if (res instanceof Promise) {
          await res;
        }
      } finally {
        setInnerLoading(false);
      }

      if (dropdown) setDropdownOpened(true);
    },
    [onSearch, minLength, dropdown, loading], // eslint-disable-line
  );

  useEffect(() => {
    if (activeOptionIndex >= 0) {
      listRef.current[activeOptionIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeOptionIndex]);

  useEffect(() => {
    if (!dropdownOpened || options.length === 0) {
      setActiveOptionIndex(-1);
    } else {
      setActiveOptionIndex(0); // auto focus option đầu tiên
    }
  }, [dropdownOpened, options]);

  /* =========================
   * Sync controlled value
   * ========================= */
  useEffect(() => {
    if (!isControlled) return;
    else if (value === inputValue) return;

    changeSourceRef.current = suppressSearchOnValueChange
      ? SOURCE.INTERNAL
      : SOURCE.USER;

    setInputValue(value ?? "");
  }, [value, isControlled, suppressSearchOnValueChange]); // eslint-disable-line

  /* =========================
   * Auto search (debounce)
   * ========================= */
  useEffect(() => {
    if (!autoSearch || !onSearch) return;
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (!searchOnMount) return;
    }

    if (changeSourceRef.current !== SOURCE.USER) {
      return;
    }

    runSearch(debouncedValue);

    changeSourceRef.current = SOURCE.INTERNAL;
  }, [debouncedValue, autoSearch, searchOnMount, onSearch, runSearch]);

  /* =========================
   * Handlers
   * ========================= */
  const handleInputChange = (e) => {
    const v = e.target.value;
    changeSourceRef.current = SOURCE.USER;
    setInputValue(v);
    onChange?.(e, v);

    if (!autoSearch) {
      // no debounce
      runSearch(v);
    }
  };

  const handleClear = (e) => {
    changeSourceRef.current = SOURCE.INTERNAL;
    setInputValue("");
    setDropdownOpened(false);
    onChange?.(e, "");

    if (searchAfterClear) {
      runSearch("");
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "ArrowDown" &&
      dropdown &&
      !dropdownOpened &&
      options.length
    ) {
      e.preventDefault();
      setDropdownOpened(true);
      setActiveOptionIndex(0);
      return;
    }

    if (!dropdown || !dropdownOpened) {
      if (e.key === "Enter") {
        changeSourceRef.current = SOURCE.USER;
        runSearch(inputValue);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveOptionIndex((i) => clampIndex(i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveOptionIndex((i) => clampIndex(i - 1));
        break;
      case "Enter":
        e.preventDefault();
        options[activeOptionIndex]
          ? handleSelectOption(options[activeOptionIndex])
          : runSearch(inputValue);
        break;
      case "Escape":
        setDropdownOpened(false);
        break;
      default:
        break;
    }
  };

  const handleSelectOption = (option, ...params) => {
    const value =
      typeof option === "string" ? option : mapOptionToValue(option, ...params);

    changeSourceRef.current = SOURCE.INTERNAL;
    setInputValue(value);
    setDropdownOpened(false);
    onSelectOption?.(option, ...params);
  };

  const handleBlur = (e) => {
    setDropdownOpened(false);
  };

  /* =========================
   * Render
   * ========================= */
  return (
    <>
      <TextField
        {...props}
        fullWidth
        ref={anchorRef}
        value={inputValue}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
        sx={sx}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                {finalLoading ? (
                  <CircularProgress size={18} />
                ) : showSearchIcon ? (
                  <SearchRoundedIcon fontSize="small" />
                ) : undefined}
              </InputAdornment>
            ),
            endAdornment:
              inputValue && !finalLoading && !disabled ? (
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

      {dropdown && (
        <Popper
          placement="bottom-start"
          {...slotProps?.poper}
          open={dropdownOpened && options.length > 0}
          anchorEl={anchorRef.current}
          style={{
            zIndex: 1300,
            ...slotProps?.poper?.style,
            // width: anchorRef.current?.getBoundingClientRect().width,
          }}
        >
          <Paper sx={{ mt: 0.5, overflow: "auto" }}>
            <List dense>
              {options.map((opt, idx) => (
                <ListItemButton
                  ref={(el) => (listRef.current[idx] = el)}
                  key={opt.key || idx}
                  selected={idx === activeOptionIndex}
                  onMouseEnter={() => setActiveOptionIndex(idx)}
                  onMouseDown={() => handleSelectOption(opt)}
                >
                  {renderOption(opt, idx === activeOptionIndex, idx)}
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
