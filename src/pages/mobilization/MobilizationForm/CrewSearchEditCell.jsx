import React, { useState, useCallback } from "react";
import SearchBar from "@/components/common/SearchBar";
import { ErrorWrapper } from "@/components/common/EditableDataGrid";
import { searchCrewMembers } from "@/services/crewServices";

const CrewSearchEditCell = ({ id, field, value, api, error }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  /** call API */
  const searchCrew = async (keyword) => {
    if (!keyword) return [];

    const res = await searchCrewMembers({
      query: keyword,
      page: 0,
      size: 10,
    });

    // Giả sử backend trả về { content: [...] }
    return res?.content ?? [];
  };

  const handleSearch = useCallback(async (keyword) => {
    setLoading(true);
    try {
      const data = await searchCrew(keyword);
      setOptions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = useCallback(
    (crew) => {
      if (!crew) return;

      console.log(api.setEditCellValue !== null);
      /** set cardId */
      api.setEditCellValue(
        { id, field: "cardId", value: crew.cardId },
        { debounceMs: 0 },
      );

      /** set name */
      api.setEditCellValue(
        { id, field: "name", value: crew.name },
        { debounceMs: 0 },
      );

      /** close edit mode */
      api.stopCellEditMode({ id, field: "cardId" });
    },
    [api, id],
  );

  return (
    <ErrorWrapper error={error}>
      <SearchBar
        value={value || ""}
        autoSearch
        dropdown
        loading={loading}
        placeholder="Tìm thuyền viên..."
        options={options}
        onSearch={handleSearch}
        onSelectOption={handleSelect}
        renderOption={(opt) => (
          <>
            <strong>{opt.cardId}</strong> — {opt.fullName}
          </>
        )}
      />
    </ErrorWrapper>
  );
};

export default CrewSearchEditCell;
