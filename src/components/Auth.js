import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {fetchRegister} from '../api/index.js'
// module.imports = {
//     fetchRegister
// };

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));



const Auth = ({ user, setUser }) => {
    //need to make it to where clicking register takes you to a /register route
    //OR make the element changed to have fields needed to register

    //Constants
    const [authDisplay, setAuthDisplay] = useState('not-logged-in');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const classes = useStyles();
    //Functions
    const displayLogin = () => {
        setAuthDisplay('login');
    }
    const displayRegister = () => {
        setAuthDisplay('register');
    }
    const displayBase = () => {
        setErrorMessage('');
        setAuthDisplay('not-logged-in');
    }
    const usernameOnChange = (e) => {
        setUsername(e.target.value);
    }
    const passwordOnChange = (e) => {
        setPassword(e.target.value);
    }
    const confirmPasswordOnChange = (e) => {
        setConfirmPassword(e.target.value);
    }
    const registerOnClick = async () => {
        //should have username and password fields as states
        try {
        const resp = await fetchRegister(username, password);
        if(!!resp.error) {
            setErrorMessage(resp.error);
            throw resp.error;
        }
        //so now we want to store a user object and also save a cookie.
        const resultUser = {...resp.user};
        resultUser.token = resp.token;
        setUser(resultUser);
        localStorage.setItem('user', JSON.stringify(resultUser));
        setAuthDisplay('logged-in');
        }
        catch (error) {
            throw error;
        }
    }

    const loginOnClick = async () => {

        try {
        const resp = await fetchLogin(username, password);

        if(!!resp.error) {
            setErrorMessage(resp.error);
            throw resp.error;
        }
        const resultUser = {...resp.user};
        resultUser.token = resp.token;
        setUser(resultUser);
        localStorage.setItem('user', JSON.stringify(resultUser));

        const myRoutinesResult = await fetchMyRoutines(resultUser.username, resultUser.token);
        if (!myRoutinesResult)  {
            throw 'myRoutinesResult is undefined'
        }
        setMyRoutines(myRoutinesResult);
        localStorage.setItem('myRoutines', JSON.stringify(myRoutinesResult));
        setAuthDisplay('logged-in');
        }
        catch (error) {
            throw error;
        }

    }
    const logoutOnClick = () => {

        displayBase();
        setUser(null);
        localStorage.removeItem('user');
        localStorage.clear();
    }


    if (!user) {

        //login form
        if (authDisplay === 'login') {
            return <div className={classes.root}>
                <div className='auth-row'>
                    <div>
                        Username:
                    </div>
                    <input type='text' onChange={usernameOnChange}/>
                </div>
                <div className='auth-row'>
                    <div>
                        Password:
                    </div>
                    <input type='password' onChange={passwordOnChange} />
                </div>
                <div className='auth-row'>
                    <Button onClick={loginOnClick} variant="contained">
                        Login
                    </Button>
                    <Button onClick={displayBase} variant="contained">
                        Cancel
                    </Button>
                </div>
                <div className='auth-row'>
                    <div style={{color: 'red'}}>
                        {errorMessage}
                    </div>
                </div>
            </div>
        }
        if (authDisplay === 'register') {
            //register form
            return <div className={classes.root}>
                <div className='auth-row'>
                    <div>
                        Username:
                    </div>
                    <input type='text' onChange={usernameOnChange}/>
                </div>
                <div className='auth-row'>
                    <div>
                        Password:
                    </div>
                    <input type='password' onChange={passwordOnChange} />
                </div>
                <div className='auth-row'>
                    <div>
                        Confirm Password:
                    </div>
                    <input type='password' onChange={confirmPasswordOnChange} />
                </div>
                <div className='auth-row'>
                    <Button onClick={registerOnClick} variant="contained">
                        Register
                    </Button>
                    <Button onClick={displayBase} variant="contained">
                        Cancel
                    </Button>
                </div>
                <div className='auth-row'>
                    <div style={{color: 'red'}}>
                        {errorMessage}
                    </div>
                </div>
            </div>
        }
        //base form, user not logged in
        return <div className={classes.root}>
            <Button onClick={displayRegister} variant="contained">Register</Button>
            <Button onClick={displayLogin} variant="contained">Login</Button>
        </div>
    }
    //User is logged in
    return <div className={classes.root}>
        <div className='auth-row'>
        <div>
            {user.username} is logged in.
        </div>
        </div>
        <div className='auth-row'>
            <Button onClick={logoutOnClick} variant="contained">Logout</Button>
        </div>
    </div>

}

export default Auth;