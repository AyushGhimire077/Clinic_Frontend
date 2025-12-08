import { useToastStore } from "./stores/toast.store";

export const useToast = () => {
  const { showToast } = useToastStore();
  return { showToast };
};
