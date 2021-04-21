import React, {useState, useHook} from 'react';
import Auth from './Auth.js';

const AppHeader = () => {

    return <>
        <div id='AppHeader'>
            <div>
                Hamburger icon
            </div>
            <div>
                LOGO
            </div>
            <Auth />
        </div>
    </>
};

export default AppHeader;