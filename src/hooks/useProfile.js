import { useQuery, useQueryClient } from "react-query";
import useApi from "./useApi";
import { cacheKeys } from "../api/CacheKeys";
import useAuthToken from "./auth/useAuthToken";
import { useCallback } from "react";
import useSnackbarStatus from "./useSnackbarStatus";

export default function useProfile() {
  const api = useApi({ formData: false });
  const { authToken } = useAuthToken();
  const queryClient = useQueryClient();
  const showMessage = useSnackbarStatus();

  const { data, isLoading, error, refetch, isRefetching, ...rest } = useQuery({
    queryKey: [cacheKeys.profile],
    queryFn: () => {
      if (authToken) return api.userProfile();
    },
    refetchOnMount: false,
    enabled: !!authToken,
    retry: 2,
    onError: (error) => {
      showMessage(error?.message);
    },
  });

  const setProfile = (newProfile) => {
    console.log("new pr", newProfile);
    queryClient.setQueryData([cacheKeys.profile], newProfile);
  };

  return {
    profile: data?.data,
    isLoadingProfile: isLoading,
    isRefetchingProfile: isRefetching,
    errorProfile: error,
    refetchProfile: refetch,
    setProfile,
    ...rest,
  };
}
