// external imports
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

// internal imports
import UserProfilePageComponent from './userPageComponents/UserProfilePageComponent';
import { setReduxUserState } from '../../redux/actions/userActions';

const updateUserApiRequest = async (name, lastName, address, phoneNumber, country, city, state, zipCode, password) => {
    const { data } = await axios.put('/api/users/profile', { name, lastName, address, phoneNumber, country, city, state, zipCode, password });
    return data;
};

const fetchUser = async (userId) => {
    const { data } = await axios.get(`/api/users/profile/${userId}`);
    return data;
};

export default function UserProfilePage() {
    const reduxDispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userRegisterLogin);
    return <UserProfilePageComponent updateUserApiRequest={updateUserApiRequest} fetchUser={fetchUser} userInfoFromRedux={userInfo} setReduxUserState={setReduxUserState} reduxDispatch={reduxDispatch} localStorage={localStorage} sessionStorage={sessionStorage} />;
}