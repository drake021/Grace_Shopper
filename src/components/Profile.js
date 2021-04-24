import React, { useState } from 'react';
import {
    Link,
    Redirect
} from 'react-router-dom';



const Profile = ({user}) => {

    const renderNotLoggedIn = () => {
        return <>
            <div>
                <h2>Please login to view your profile.</h2>
                <Link to='/login'>
                <button>Login</button>
                </Link>
            </div>
        </>
    }

    if(user === null) {
        return <>
            {renderNotLoggedIn()}
        </>
    }

    return <Redirect to='/profile/orders'/>

}

export default Profile;