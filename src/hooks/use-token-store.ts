import { tokenStore } from "@/shared/auth/token-store";
import { useSyncExternalStore } from "react";

const getSnapshot = () => {
  return tokenStore.getSnapshot();
};

export function useTokenStore() {
  return useSyncExternalStore(tokenStore.subscribe, getSnapshot);
}
