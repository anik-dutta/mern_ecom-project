// external imports
import axios from 'axios';
import { useDispatch } from 'react-redux';

// internal imports
import LoginPageComponent from './pageComponents/LoginPageComponent';
import { setReduxUserState } from '../redux/actions/userActions';

const loginUserApiRequest = async (email, password, doNotLogout) => {
    const { data } = await axios.post('/api/users/login', { email, password, doNotLogout });

    if (data.userLoggedIn.doNotLogout) {
        localStorage.setItem('userInfo', JSON.stringify(data.userLoggedIn));
    } else {
        sessionStorage.setItem('userInfo', JSON.stringify(data.userLoggedIn));
    }
    return data;
};

export default function LoginPage() {
    const reduxDispatch = useDispatch();

    return <LoginPageComponent loginUserApiRequest={loginUserApiRequest} reduxDispatch={reduxDispatch} setReduxUserState={setReduxUserState} />;
} 