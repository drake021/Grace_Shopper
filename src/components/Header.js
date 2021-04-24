import React from 'react';
import { Link } from 'react-router-dom';

const profileHeader = (boolean) => {
    if (boolean) {
        return <> Profile </>
    }
    return null;
}

const authSection = (user, setUser) => {
    const onClickLogout = () => {
        setUser(null);
    }

    if (!user) {
        return <>
            <Link to="/login">
                <button id='login-button'>
                    Login
                </button>
            </Link>
            <Link to="/register">
                <button id='register-button'>
                    Register
                </button>
            </Link>
        </>
    }
    return <>
        <div id='username'>
            {user.username}
        </div>
        <Link to='/logout'>
            <button onClick={onClickLogout}>
                Log Out
            </button>
        </Link>
    </>
}


const Header = ({ user, setUser }) => {

    return <>
        <section id="header">
            <div id='auth'>
                {authSection(user, setUser)}
            </div>
            <div className='tabs'>
                <Link id= "header-catalog" to= "/catalog">
                    Catalog
                </Link>
                <Link id= "header-profile" to= "/profile">
                    Pofile
                </Link>
                <Link id = "header-cart" to = "/cart">
                    Cart
                </Link>
            </div>
        </section>
    </>

}

export default Header;