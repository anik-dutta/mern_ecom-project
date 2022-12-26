// external imports
import { Outlet, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// internal imports
import UserChatComponent from './userComponents/UserChatComponent';
import LoginPage from '../pages/LoginPage';

export default function ProtectedRoutesComponent({ admin }) {
    const [isAuth, setIsAuth] = useState();

    useEffect(() => {
        axios.get('/api/get-token')
            .then((result) => {
                if (result.data.token) {
                    setIsAuth(result.data.token);
                }
                return isAuth;
            });
        // .catch((err) => { });
    }, [isAuth]);

    if (isAuth === undefined) {
        return <LoginPage />;
    }
    return isAuth && admin && isAuth !== 'admin' ? (<Navigate to="/login" />) : isAuth && admin ? (<Outlet />) : isAuth && !admin ? (
        <>
            <UserChatComponent />
            <Outlet />
        </>
    ) : (<Navigate to="/login" />);

    // return isAuth && admin ? (<Outlet />) : isAuth && !admin ? (
    //     <>
    //         <UserChatComponent />
    //         <Outlet />
    //     </>
    // ) : (<Navigate to="/login" />);
}