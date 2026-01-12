import React, { useCallback, useMemo } from "react";
import SearchBar from "@/components/common/SearchBar";
import { ErrorTooltip } from "@/components/common";

const SearchEditCell = ({
  id,
  field,
  value,
  api,
  error,
  hasFocus,
  options,
  mapOptionToRow,
  onSelectOption,
  ...props
}) => {
  if (!id || !field) throw new Error("id and field is required");
  if (!api) throw new Error("api is required");

  const normalizeOptions = useMemo(() => {
    return options.map((opt) => {
      const rowValues = mapOptionToRow?.(opt) || {};
      const value = rowValues[field];
      if (!value) {
        throw new Error(
          `mapOptionToRow must return a value for field ${field}`,
        );
      }
      return {
        raw: opt, // raw data (for render)
        value, // value for current cell
        rowValues, // all fields to update
      };
    });
  }, [mapOptionToRow, field, options]);

  // Select option → update row once
  const handleSelect = useCallback(
    (option, ...args) => {
      const { raw, rowValues } = option;
      Object.entries(rowValues).forEach(([key, val]) => {
        api.setEditCellValue({
          id,
          field: key,
          value: val,
        });
      });
      onSelectOption?.(raw, option, ...args);
    },
    [api, id, onSelectOption],
  );

  return (
    <ErrorTooltip error={error}>
      <SearchBar
        autoSearch
        dropdown
        showSearchIcon={false}
        suppressSearchOnValueChange={!hasFocus}
        {...props}
        value={value}
        options={normalizeOptions}
        mapOptionToValue={(opt) => opt.value}
        onSelectOption={handleSelect}
        error={!!error}
        onChange={(e, v) => {
          api.setEditCellValue({ id, field, value: v }, { debounceMs: 120 });
        }}
      />
    </ErrorTooltip>
  );
};

export default SearchEditCell;
