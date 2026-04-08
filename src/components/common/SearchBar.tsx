import {
  IconButton,
  CircularProgress,
  InputAdornment,
  TextField,
  Popper,
  Paper,
  List,
  ListItemButton,
  PopperProps,
  TextFieldProps,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDebounced } from "@/hooks/useDebounced";

const SOURCE = {
  USER: "user",
  INTERNAL: "internal",
};

export type SearchBarProps = Omit<
  TextFieldProps,
  "slotProps" | "onChange" | "value"
> & {
  value?: string;
  showSearchIcon: boolean;
  debounceMs?: number;
  minLength?: number;

  autoSearch?: boolean;
  searchOnMount?: boolean;
  searchAfterClear?: boolean;
  suppressSearchOnValueChange?: boolean;

  loading?: boolean;
  dropdown?: boolean;
  options?: any[];
  renderOption?: (opt: any, selected: boolean, idx: number) => React.ReactNode;
  mapOptionToValue?: (opt: any) => string;
  matchAnchorWidth?: boolean;
  onSelectOption?: (opt: any) => void;

  collapsible?: boolean;
  collapsed?: boolean;
  collapseWidth?: number;
  autoCollapseOnBlur?: boolean;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent,
    value: string,
  ) => void;
  onSearch?: (value: string) => void;

  slotProps?: TextFieldProps["slotProps"] & {
    popper?: PopperProps;
  };
};

const SearchBar = ({
  value,
  placeholder = "Tìm kiếm...",
  showSearchIcon = true,
  debounceMs = 300,
  fullWidth = true,
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
  matchAnchorWidth = false,
  onSelectOption,

  collapsible = false,
  collapsed = true,
  collapseWidth,
  autoCollapseOnBlur = true,

  onChange,
  onKeyDown,
  onClick,

  onBlur,
  onSearch,
  slotProps,
  sx,
  ...props
}: SearchBarProps) => {
  /* =========================
   * State & Refs
   * ========================= */
  const isControlled = value !== undefined;
  const [inputValue, setInputValue] = useState<string>(value ?? "");
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const [innerLoading, setInnerLoading] = useState(false);
  const [isCollapsed, setIsCollapsedState] = useState<boolean>(
    collapsible && collapsed,
  );

  const setIsCollapsed = useCallback(
    (v: boolean) => {
      if (collapsible) setIsCollapsedState(v);
    },
    [collapsible],
  );

  const debouncedValue = useDebounced(inputValue, debounceMs);
  const finalLoading = typeof loading === "boolean" ? loading : innerLoading;

  const listRef = useRef<
    Array<React.ComponentRef<typeof ListItemButton> | null>
  >([]);
  const changeSourceRef = useRef(SOURCE.INTERNAL);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef<boolean>(false);
  const popperRef = useRef<HTMLDivElement | null>(null);

  /* =========================
   * Helpers
   * ========================= */

  const clampIndex = (idx: number) => {
    if (idx < 0) return options.length - 1;
    if (idx >= options.length) return 0;
    return idx;
  };

  const runSearch = useCallback(
    async (keyword: string) => {
      if (!onSearch || keyword.length < minLength) {
        setDropdownOpened(false);
        return;
      }

      try {
        if (typeof loading !== "boolean") {
          setInnerLoading(true);
        }
        const res = onSearch?.(keyword) as any;
        if (res instanceof Promise) {
          await res;
        }
      } finally {
        setInnerLoading(false);
        if (dropdown) setDropdownOpened(true);
      }
    },
    [onSearch, minLength, dropdown, loading],
  );

  // useEffect(() => {
  //   const handleFocusChange = () => {
  //     const activeEl = document.activeElement;

  //     const isInside =
  //       anchorRef.current?.contains(activeEl) ||
  //       popperRef.current?.contains(activeEl);

  //     if (!isInside) {
  //       setDropdownOpened(false);

  //       if (autoCollapseOnBlur && !inputValue) {
  //         setIsCollapsed(true);
  //       }

  //       onBlur?.();
  //     }
  //   };
  //   document.addEventListener("focusin", handleFocusChange);
  //   return () => {
  //     document.removeEventListener("focusin", handleFocusChange);
  //   };
  // }, [inputValue, autoCollapseOnBlur, onBlur]);
  //
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget as Node | null;

    const isInside =
      anchorRef.current?.contains(next) || popperRef.current?.contains(next);

    if (!isInside) {
      setDropdownOpened(false);

      if (autoCollapseOnBlur && !inputValue) {
        setIsCollapsed(true);
      }
    }

    onBlur?.(e);
  };

  useEffect(() => {
    if (!isCollapsed && !disabled) {
      inputRef.current?.focus();
    }
  }, [isCollapsed, disabled]);

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
    setIsCollapsed(collapsed);
  }, [collapsed, setIsCollapsed]);

  useEffect(() => {
    if (!isControlled) return;
    else if (value === inputValue) return;

    changeSourceRef.current = suppressSearchOnValueChange
      ? SOURCE.INTERNAL
      : SOURCE.USER;

    setInputValue(value ?? "");
  }, [value, isControlled, suppressSearchOnValueChange]); // eslint-disable-line

  /* ==================
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    changeSourceRef.current = SOURCE.USER;
    setInputValue(v);
    onChange?.(e, v);

    if (!autoSearch) {
      // no debounce
      runSearch(v);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    onClick?.(e);
  };

  const handleClear = (e: React.MouseEvent) => {
    changeSourceRef.current = SOURCE.INTERNAL;
    setInputValue("");
    setDropdownOpened(false);
    onChange?.(e, "");

    if (searchAfterClear) {
      runSearch("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      case "Tab":
        if (options[activeOptionIndex]) {
          handleSelectOption(options[activeOptionIndex]);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (options[activeOptionIndex]) {
          handleSelectOption(options[activeOptionIndex]);
        } else {
          runSearch(inputValue);
        }
        break;
      case "Escape":
        setDropdownOpened(false);
        break;
      default:
        break;
    }

    onKeyDown?.(e);
  };

  const handleSelectOption = (option: any) => {
    const value =
      typeof option === "string" ? option : (mapOptionToValue?.(option) ?? "");

    changeSourceRef.current = SOURCE.INTERNAL;
    setInputValue(value);
    setDropdownOpened(false);
    onSelectOption?.(option);
  };

  const mergedSx = useMemo(
    () => [
      ...(Array.isArray(sx) ? sx : [sx]),
      {
        overflow: "hidden",
        maxWidth: isCollapsed ? collapseWidth : undefined,
        minWidth: isCollapsed
          ? collapseWidth && collapseWidth > 50
            ? collapseWidth
            : 50
          : undefined,
        transition: "max-width 300ms ease min-width 300ms ease",

        "& input": {
          width: isCollapsed ? collapseWidth || 0 : undefined,
          transition: "width 300ms ease",
        },
      },
    ],
    [sx, isCollapsed, collapseWidth],
  );

  const startAdornment = useMemo(
    () => (
      <InputAdornment position="start" sx={{ cursor: "pointer" }}>
        {finalLoading ? (
          <CircularProgress size={18} />
        ) : (
          showSearchIcon && <SearchRoundedIcon fontSize="small" />
        )}
      </InputAdornment>
    ),
    [finalLoading, showSearchIcon],
  );

  const endAdornment = useMemo(() => {
    if (isCollapsed || !inputValue || finalLoading || disabled) return null;

    return (
      <InputAdornment position="end">
        <IconButton size="small" onClick={handleClear}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    );
  }, [isCollapsed, inputValue, finalLoading, disabled, handleClear]);

  /* =========================
   * Render
   * ========================= */
  return (
    <>
      <TextField
        {...props}
        ref={anchorRef}
        inputRef={inputRef}
        value={inputValue}
        fullWidth={!isCollapsed && fullWidth}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
        sx={mergedSx}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onBlur={handleBlur}
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            startAdornment,
            endAdornment,
          },
        }}
      />

      {dropdown && (
        <Popper
          ref={popperRef}
          placement="bottom-start"
          {...slotProps?.popper}
          open={dropdownOpened && options.length > 0}
          anchorEl={anchorRef.current}
          style={{
            zIndex: 1300,
            ...slotProps?.popper?.style,
            width: matchAnchorWidth
              ? anchorRef.current?.getBoundingClientRect().width
              : undefined,
          }}
        >
          <Paper sx={{ mt: 0.5, overflow: "auto" }}>
            <List dense>
              {options.map((opt, idx) => (
                <ListItemButton
                  ref={(el: any) => (listRef.current[idx] = el)}
                  key={opt.key ?? `opt-${idx}`}
                  selected={idx === activeOptionIndex}
                  onMouseEnter={() => setActiveOptionIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectOption(opt);
                  }}
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
