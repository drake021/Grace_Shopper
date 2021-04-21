import React, { useState, useHook } from 'react';
import {Link} from 'react-router-dom';

const Nav = () => {

    return <>
        <div id="Nav">
            <Link to='/home'>
                Home
            </Link>
            <Link to='/catalog'>
                Catalog
            </Link>
            <Link to='/orders'>
                Orders
            </Link>
        </div>
    </>
};

export default Nav;