import React, { useState, useRef } from 'react';
// import "./Auth.css";
import { fetchLogin, fetchMe } from "../api/index.js";
import { Redirect } from 'react-router-dom';

const Login = ({ user, setUser }) => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(null);
  
    const usernameOnChange = (event) => {
      setUsername(event.target.value);
    }
    const passwordOnChange = (event) => {
      setPassword(event.target.value);
    }
    const submitIsValid = () => {
      let result = { test: true };
      if (password.length < 4) {
        result.test = false;
        result.passwordLength = "Entered password is too short. Please enter at least 4 characters."
      }
      if (username.length < 4) {
        result.test = false;
        result.usernameLength = "Username must be atleast 4 characters"
      }
      return result;
    }
    const updateUserState = (object, token) => {
        console.log('updateUserState() running');
        console.log('object', object);
        console.log('token', token);
        let result = { ...object };
        result.token = token;
        setRefUser(result);
      }
      const myStateRef = useRef(user);
      const setRefUser = data => {
        myStateRef.current = data;
        setUser(data);  
      };
    }

    const submitOnClick = (event) => {
      event.preventDefault();
      if (submitIsValid().test) {
        fetchLogin(username, password)
          .then((response) => {  
            if (response.success) {
  
              fetchMe(response.data.token).then(data => {
                updateUserState(data.data, response.data.token);
                return data;
              }).then(data => {
                localStorage.setItem('user', JSON.stringify(myStateRef.current));
              })
            } else {
              setErrors(
                <>
                  <p>{response.error.message}</p>
                </>
              )
            }
          })
      } else {
        setErrors(
          <>
            {submitIsValid().passwordLength ? <p> {submitIsValid().passwordLength}</p> : null}
            {submitIsValid().usernameLength ? <p> {submitIsValid().usernameLength}</p> : null}
          </>
        );
      }
  
      console.log('aferFetchMeInLogin user: ', user);
    }

    return (
      <main id="main-holder">
        {user ? <Redirect to='/home' /> : null}
        <div className='App'></div>
        <h1 id="login-header">Login</h1>
        <form id="login-storage">
          <input onChange={usernameOnChange} type="text" name="username" id="username-field" className="login-storage-field" placeholder="Username"></input>
          <input onChange={passwordOnChange} type="password" name="password" id="password-field" className="login-storage-field" placeholder="Password"></input>
          <input onClick={submitOnClick} type="submit" value="Login" id="login-storgae-submit"></input>
          {errors}
        </form>
      </main>
    )
  export default Login;