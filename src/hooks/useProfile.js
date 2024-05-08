import { useQuery, useQueryClient } from "react-query";
import useApi from "./useApi";
import { cacheKeys } from "../api/CacheKeys";
import useAuthToken from "./auth/useAuthToken";
import { useCallback } from "react";

export default function useProfile() {
  const api = useApi({ formData: false });
  const { authToken } = useAuthToken();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isRefetching, ...rest } = useQuery({
    queryKey: [cacheKeys.profile],
    queryFn: () => {
      if (authToken) return api.userProfile();
    },
    refetchOnMount: false,
    enabled: !!authToken,
  });

  const setProfile = useCallback(
    (newProfile) => {
      return queryClient.setQueryData([cacheKeys.profile], newProfile);
    },
    [queryClient]
  );

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
