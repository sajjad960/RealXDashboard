import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useAuthToken from './auth/useAuthToken';

const useRedirectIfTokenExists = () => {
    const { isExpired, authToken } = useAuthToken();
    const history = useHistory();

    useEffect(() => {
        if (authToken && !isExpired) {
            // Token exists, navigate to the home page or any other desired route
            history.push('/');
        }
    }, [authToken, isExpired, history]);
};

export default useRedirectIfTokenExists;
