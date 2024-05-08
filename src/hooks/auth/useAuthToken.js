import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import { getToken, setToken } from "../../utility/helpers";
// import useLocalStorageState from "use-local-storage-state";

const useAuthToken = () => {
  // const [authToken, setAuthToken] = useLocalStorageState("auth-simple-social", {
  //     defaultValue: null
  // });
  const authToken = getToken();
  const setAuthToken = (token) => {
    setToken(token);
  };

  const decode = useMemo(() => {
    return authToken ? jwtDecode(authToken) : null;
  }, [authToken]);

  const isExpired = useMemo(() => {
    return decode?.exp && decode?.exp * 1000 < new Date().getTime();
  }, [decode]);

  const userId = useMemo(() => decode?.sub && decode?.sub, [decode]);

  return {
    authToken,
    setAuthToken,
    isExpired,
    userId,
  };
};

export default useAuthToken;
