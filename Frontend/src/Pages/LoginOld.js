
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from "react";
import { auth } from '../firebase_config';


//popup system for logins, registration, errors?
//same popups for item added to cart.

//User profile page
//change password
//forgot password
//email confirmation when registering.

const LoginOld = () => {

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  //currently logged in user object
  const [user, setUser] = useState({});

  

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [refresh,setRefresh] = useState(false);
  

  //Putting onAuthStateChange to useEffect to prevent memory leak.
  useEffect(() => {

    //Instead of onAuthStateChanged might use localStorage
    //Saving the logged in user data (keep user logged in)
    onAuthStateChanged(auth,(currentUser) =>{
      setUser(currentUser);
    })

  },[])


  //this gets spewed out into console everytime you type something in due to onChange event
  console.log(registerEmail);

  
  



  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log(user);
      //clearing any error messages
      setErrorMessage("")
      setSuccessMessage("User "+ user.email +" has registered successfully")
    } catch (error) {
      console.log(error.message);
      //setting error message
      setErrorMessage(error.message);
      //clearing success message
      setSuccessMessage("");
    }
  };



  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
      //clearing any error messages
      setErrorMessage("")
      setSuccessMessage("User "+ user.email +" has logged in successfully")
    } catch (error) {
      console.log(error.message);
      //setting error message
      setErrorMessage("Login Error: " + error.message);
      //clearing success message
      setSuccessMessage("");
    }
  };

  // setRefresh(true);//refreshing values

  const logout = async () => {
    if(user==null)
    {
      setErrorMessage("Already signed out")
      setSuccessMessage("")
    }
    else
    {
      setSuccessMessage("Signed out successfully")
      await signOut(auth);
    }
    
  };
  









  return (
    <div style={{ color: 'white'}}>


    {/* Register */}
    <div>

      <h1><div style={{ color: 'red'}} >{errorMessage}</div></h1>
      <h1><div style={{ color: 'green'}} >{successMessage}</div></h1>

        <h3> Register User </h3>
        {/* Error message: {errorMessage} */}
        <br></br>

        <label>Email:</label> &nbsp; <br></br>
        <input
          placeholder="Your email"
          onChange={(event) => {
            setRegisterEmail(event.target.value);
          }}
        />

        <br></br><br></br>

        <label>Password:</label> &nbsp; <br></br>
        <input
          placeholder="Your password"
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />

        <button onClick={register}> Create User</button>
      </div>

      {/* Login */}
      <div>
        
        <h3> Login </h3>

        <label>Email:</label> &nbsp; <br></br>
        <input
          placeholder="Your email"
          onChange={(event) => {
            setLoginEmail(event.target.value);
          }}
        />
        

        <br></br><br></br>
        
        <label>Password:</label> &nbsp; <br></br>
        <input
          placeholder="Your password"
          onChange={(event) => {
            setLoginPassword(event.target.value);
          }}
        />
        <button onClick={login}> Login</button>
      </div>


      {/* if user has an email property, if not doesnt do anything */}
      <br></br>
      <b>User currently signed in:</b> <br></br>
      {user?.email}
      <br></br>
      <br></br>
      
      <button onClick={logout}> Sign Out </button>
      
      

    </div>
)
}
  
export default LoginOld

