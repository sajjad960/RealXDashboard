import { useMemo } from "react";
import useAuthToken from "./auth/useAuthToken";
import ApiMethods from "../api/ApiMethods";
import { API_BASE_URL } from "../utility/helpers";

export default function useApi({ formData }) {
  const { authToken } = useAuthToken();

  return useMemo(
    () =>
      new ApiMethods({
        baseURL: API_BASE_URL,
        formData,
        commonHeaders: authToken
          ? { Authorization: `Bearer ${authToken}` }
          : {},
        timeout: 60000,
      }),
    [authToken, formData]
  );
}
