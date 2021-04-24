import React from 'react';
import {Redirect} from 'react-router-dom';

const Logout = ({setUser, user}) => {

    setUser(null);
    localStorage.clear('username');
    localStorage.clear('token');

    return <>
        <Redirect to='/login' />
    </>
}

export default Logout;