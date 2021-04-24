const Register = ({setUser, user}) => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState(null);

    const handleFormSubmit = (event) => {
        event.preventDefault();
    // const { username, password } = this.state;
    if(submitIsValid().test) {
        console.log('validation is running')
        fetchRegister(username, password)
        .then(data => {
            console.log (data)
            if(data.success) {
                fetchMe(data.data.token).then(user => {
                  setUser(user);
                  setUser({token: data.data.token});
                });
                localStorage.setItem('user', user);
            }
            else {
                setErrors(
                    <>
                    {data.error.message}
                    </>
                )

            }
        })
    }
    else {
        console.log('error')
            setErrors(
      <>
        {submitIsValid().passwordLength ? <p> {submitIsValid().passwordLength}</p> : null}
        {submitIsValid().usernameLength ? <p> {submitIsValid().usernameLength}</p> : null}
        {submitIsValid().passwordMatch ? <p> {submitIsValid().passwordMatch}</p> : null}
      </>
            )
            }

}

const usernameOnChange = (event) => {
    setUsername(event.target.value);
  }
  const passwordOnChange = (event) => {
    setPassword(event.target.value);
  }
  const confirmPasswordOnChange = (event) => {
    setConfirmPassword(event.target.value);
  }
  const submitIsValid = () => {
    let result = {test: true};
    if(password.length < 4) {
      result.test = false;
      result.passwordLength = "Password is too short. Please enter at least 4 characters."
    }
    if(username.length < 4) {
      result.test = false;
      result.usernameLength = "Username is too short. Please enter atleast 4 characters"
    }
  
    if(password != confirmPassword) {
        result.test = false;
        result.passwordMatch = "Passswords do not match"
    }
    return result;
  }
}

return (
  <main id="main-holder">
      {user ? <Redirect to='/home' /> : null}
  <div className='App'></div>
    <h1 id="register-header">Register</h1>
    <form id="register-storage">
    <input onChange={usernameOnChange} type="text" name="username" id="username-field" className="register-storage-field" placeholder="Username"></input>
    <input onChange={passwordOnChange}type="password" name="password" id="password-field" className="register-storage-field" placeholder="Password"></input>
      <input onChange={confirmPasswordOnChange}type="password" name="password" id="confirm-password-field" className="register-storage-field" placeholder="Confirm Password"></input>
      <input onClick={handleFormSubmit} type="submit" value="Register" id="register-storgae-submit"></input>
      {errors}
    </form>
  </main>
)

export default Register;