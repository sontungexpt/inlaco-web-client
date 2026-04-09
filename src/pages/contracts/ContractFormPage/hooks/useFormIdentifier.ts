import { useMemo } from "react";
import { useParams } from "react-router";

export const useFormIdentifider = () => {
  const { id } = useParams<{ id?: string }>();

  const isEdit = useMemo(() => {
    return !!id;
  }, [id]);

  const contractId = useMemo(() => {
    return isEdit ? id : undefined;
  }, [id, isEdit]);

  return {
    id,
    contractId,
    isEdit,
  };
};
