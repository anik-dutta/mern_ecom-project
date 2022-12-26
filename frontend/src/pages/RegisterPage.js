// external imports
import axios from 'axios';
import { useDispatch } from 'react-redux';

// internal imports
import RegisterPageComponent from './pageComponents/RegisterPageComponent';
import { setReduxUserState } from '../redux/actions/userActions';

const registerUserApiRequest = async (name, lastName, email, password) => {
    const { data } = await axios.post('/api/users/signup', { name, lastName, email, password });

    sessionStorage.setItem('userInfo', JSON.stringify(data.userCreated));

    if (data.success === 'User created successfully!') {
        window.location.href = '/user';
    }
    return data;
};

export default function RegisterPage() {
    const reduxDispatch = useDispatch();

    return <RegisterPageComponent registerUserApiRequest={registerUserApiRequest} reduxDispatch={reduxDispatch} setReduxUserState={setReduxUserState} />;
}