import { useCallback } from "react";
import { useSnackbar } from "notistack";

export default function useSnackbarStatus() {
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    (message, variant="error") => {
      enqueueSnackbar(message, {
        variant,
        preventDuplicate: true,
        // persist: true,
        autoHideDuration: 5000,
      })
    },
    [enqueueSnackbar]
  );
}
