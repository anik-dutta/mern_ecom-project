// extenal import
import axios from 'axios';

// internal imports
import { LOGIN_USER, LOGOUT_USER } from '../constants/userConstants';

export function setReduxUserState(userCreated) {
    return function (dispatch) {
        dispatch({
            type: LOGIN_USER,
            payload: userCreated
        });
    };
}

export function logout() {
    return function (dispatch) {
        document.location.href = '/login';
        axios.get('/api/logout');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('userInfo');
        localStorage.removeItem('cart');
        dispatch({
            type: LOGOUT_USER
        });
    };
}