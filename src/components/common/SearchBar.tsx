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

export type SearchBarProps = Omit<
  TextFieldProps,
  "slotProps" | "onChange" | "value"
> & {
  value?: string;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent
      | React.KeyboardEvent<HTMLDivElement>,
    value: string,
  ) => void;
  showSearchIcon?: boolean;

  loading?: boolean;
  debounceMs?: number;
  minQueryLength?: number;

  dropdownEnabled?: boolean;
  dropdownItems?: any[];
  renderDropdownItem?: (
    opt: any,
    selected: boolean,
    idx: number,
  ) => React.ReactNode;
  onDropdownItemSeletected?: (
    opt: any,
  ) =>
    | Promise<string | null | undefined | void>
    | string
    | null
    | undefined
    | void;
  dropdownMatchAnchorWidth?: boolean;

  collapsible?: boolean;
  collapsed?: boolean;
  collapseWidth?: number;
  autoCollapseOnBlur?: boolean;

  searchOnMount?: boolean;
  searchAfterClear?: boolean;
  onSearch?: (value: string) => Promise<void> | void;

  slotProps?: TextFieldProps["slotProps"] & {
    popper?: PopperProps;
  };
};

function clampIndex(idx: number, length: number) {
  if (idx < 0) return length - 1;
  if (idx >= length) return 0;
  return idx;
}

export default function SearchBar<T = any>({
  value,
  placeholder = "Tìm kiếm...",
  showSearchIcon = true,

  size = "small",
  disabled = false,
  fullWidth = true,
  dropdownMatchAnchorWidth = false,

  debounceMs = 300,
  minQueryLength = 1,
  searchOnMount = false,
  searchAfterClear = false,

  loading: controlledLoading,
  dropdownEnabled = false,
  dropdownItems = [],
  renderDropdownItem = (opt) => opt?.label ?? String(opt),
  onDropdownItemSeletected,

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
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string>(value ?? "");

  const [dropdownOpened, setDropdownOpenedState] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);

  const setDropdownOpened = useMemo(
    () => (dropdownEnabled ? setDropdownOpenedState : () => {}),
    [dropdownEnabled],
  );

  const [innerLoading, setInnerLoading] = useState(false);
  const loading = controlledLoading ?? innerLoading;

  const [isCollapsed, setIsCollapsedState] = useState<boolean>(
    collapsible && collapsed,
  );
  const setIsCollapsed = useMemo(
    () => (collapsible ? setIsCollapsedState : () => {}),
    [collapsible],
  );

  const listRef = useRef<
    Array<React.ComponentRef<typeof ListItemButton> | null>
  >([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const inFlightKeywordRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  const triggerSearch = useCallback(
    (value: string, immediate = false) => {
      if (!onSearch) return;

      clearTimeout(debounceRef.current);

      if (value.length < minQueryLength) {
        setDropdownOpened(false);
        return;
      }

      // skip if search is processing with the same query
      if (inFlightKeywordRef.current === value) {
        return;
      }

      const exec = async () => {
        const requestId = ++requestIdRef.current;

        inFlightKeywordRef.current = value;

        try {
          if (controlledLoading === undefined) {
            setInnerLoading(true);
          }

          await onSearch(value);
        } finally {
          if (requestId === requestIdRef.current) {
            setInnerLoading(false);
            setDropdownOpened(true);
          }

          // clear in-flight if still the same request
          if (inFlightKeywordRef.current === value) {
            inFlightKeywordRef.current = null;
          }
        }
      };

      if (immediate) {
        exec();
      } else {
        debounceRef.current = setTimeout(exec, debounceMs);
      }
    },
    [debounceMs, onSearch, minQueryLength, controlledLoading],
  );

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
    };
  }, []);

  // Auto search on mount
  useEffect(() => {
    if (!searchOnMount || !onSearch) return;
    triggerSearch(inputValue);
  }, []);

  // Auto focus input when expand search bar
  useEffect(() => {
    if (!isCollapsed && !disabled) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isCollapsed, disabled]);

  // Scroll to active option
  useEffect(() => {
    if (activeOptionIndex >= 0) {
      listRef.current[activeOptionIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeOptionIndex]);

  // Auto focus option when dropdown open
  useEffect(() => {
    if (!dropdownOpened) {
      setActiveOptionIndex(-1);
    } else {
      setActiveOptionIndex(0); // auto focus option đầu tiên
    }
  }, [dropdownOpened]);

  // Sync collapsed
  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed, setIsCollapsed]);

  useEffect(() => {
    if (value === undefined) return;

    setInputValue(value);
  }, [value]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;

    setInputValue(v);
    onChange?.(e, v);

    triggerSearch(v);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsCollapsed(false);
    onClick?.(e);
  };

  const handleClear = (e: React.MouseEvent) => {
    setInputValue("");
    setDropdownOpened(false);
    onChange?.(e, "");

    if (searchAfterClear) {
      triggerSearch("");
    }
  };

  const handleSeletectDropdownItem = async (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    item: T,
  ) => {
    const newValue = await onDropdownItemSeletected?.(item);
    if (newValue != null) {
      setInputValue(newValue);
      onChange?.(e, String(value));
    }

    setDropdownOpened(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);

    const isOpen = dropdownEnabled && dropdownOpened;
    const dropdownItemsLength = dropdownItems.length;
    const hasItems = dropdownItemsLength > 0;
    const currentItem = dropdownItems[activeOptionIndex];

    switch (e.key) {
      case "ArrowDown": {
        if (!isOpen && hasItems) {
          e.preventDefault();
          setDropdownOpened(true);
          setActiveOptionIndex(0);
          return;
        }

        if (isOpen) {
          e.preventDefault();
          setActiveOptionIndex((i) => clampIndex(i + 1, dropdownItemsLength));
        }
        break;
      }

      case "ArrowUp": {
        if (isOpen) {
          e.preventDefault();
          setActiveOptionIndex((i) => clampIndex(i - 1, dropdownItemsLength));
        }
        break;
      }

      case "Enter": {
        if (isOpen && currentItem) {
          e.preventDefault();
          handleSeletectDropdownItem(e, currentItem);
        } else {
          triggerSearch(inputValue, true); // immediate
        }
        break;
      }

      case "Tab": {
        if (isOpen && currentItem) {
          handleSeletectDropdownItem(e, currentItem);
        }
        break;
      }

      case "Escape": {
        if (isOpen) {
          e.preventDefault();
          setDropdownOpened(false);
        }
        break;
      }

      default:
        break;
    }
  };

  const mergedSx = useMemo(
    () => [
      ...(Array.isArray(sx) ? sx : [sx]),
      {
        "& .MuiInputBase-root": {
          height: "100%",
          fontSize: "inherit",
        },

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

  const endAdornment = useMemo(() => {
    if (isCollapsed || !inputValue || loading || disabled) return null;

    return (
      <InputAdornment position="end">
        <IconButton size="small" onClick={handleClear}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    );
  }, [isCollapsed, inputValue, loading, disabled, handleClear]);

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
            startAdornment: (
              <InputAdornment position="start" sx={{ cursor: "pointer" }}>
                {loading ? (
                  <CircularProgress size={18} />
                ) : (
                  showSearchIcon && <SearchRoundedIcon fontSize="small" />
                )}
              </InputAdornment>
            ),
            endAdornment,
          },
        }}
      />

      {dropdownEnabled && (
        <Popper
          ref={popperRef}
          placement="bottom-start"
          {...slotProps?.popper}
          open={dropdownOpened && dropdownItems.length > 0}
          anchorEl={anchorRef.current}
          style={{
            zIndex: 1300,
            ...slotProps?.popper?.style,
            width: dropdownMatchAnchorWidth
              ? anchorRef.current?.getBoundingClientRect().width
              : undefined,
          }}
        >
          <Paper sx={{ mt: 0.5, overflow: "auto" }}>
            <List dense>
              {dropdownItems.map((opt, idx) => (
                <ListItemButton
                  ref={(el: any) => (listRef.current[idx] = el)}
                  key={opt.key ?? `opt-${idx}`}
                  selected={idx === activeOptionIndex}
                  onMouseEnter={() => setActiveOptionIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSeletectDropdownItem(e, opt);
                  }}
                >
                  {renderDropdownItem(opt, idx === activeOptionIndex, idx)}
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Popper>
      )}
    </>
  );
}
