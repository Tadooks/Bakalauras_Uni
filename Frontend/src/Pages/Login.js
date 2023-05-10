import {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import {signInWithEmailAndPassword, sendEmailVerification, signOut} from 'firebase/auth'
import {auth, signInWithGoogle} from '../firebase_config'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from './AuthContextNew'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from "@mui/material";
//IF encountering issues with profile, REFRESH page when profile is clicked first thing.
function Login(){

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') 
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { user, setUser  } = useContext(AuthContext);

  const login = e => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {

      console.log(auth.currentUser.uid)
      //i need realtimedatabase id (so i get it with auth id)
      fetch(`https://bakalaurasserverrender.onrender.com/auth/${auth.currentUser.uid}`,{
        method: "GET"
      })
      .then(response => response.json())
      .then((usefulData) => {
        //setting fetched data
        console.log(usefulData)
        if(auth.currentUser.emailVerified) {
          setUser([{authid: usefulData.authid,
            email: usefulData.email,
            permissions: usefulData.permissions,
            uid: usefulData.uid,
            verified: usefulData.verified}])
            
            window.localStorage.setItem("userAccount",JSON.stringify(usefulData) )
        }
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`)
        alert('Error, contact support: ' + e.message);
      });

      if(!auth.currentUser.emailVerified) {
        //doesnt send the verification fully for some reason
        // sendEmailVerification(auth.currentUser)
        // .then(() => {
        //   setTimeActive(true)
        //   signOut(auth)
          alert("Please verify your email!")
        //   window.location.reload(true)
        setUser([{}])
          
          window.localStorage.setItem("userAccount",JSON.stringify({}) )
        // })
      window.location.reload(true)
      signOut(auth)
    }else{
      navigate('/shop')
    }
    })
    .catch(err => setError(err.message))
  }


      //--------------------CSS for MUI table-------------------------
      const theme = createTheme({
        palette: {
          primary: {
            main: '#5a0061',
          },
          secondary: {
            main: '#5a0061', 
          },
        },
      });
      //---------------------------------------------------------------

  return(
    <div style={{ color: 'white'}} className='center'>
      <ThemeProvider theme={theme}>
      <div className='auth'>
        <h1>Log in</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={login} name='login_form'>
          <input 
            type='email' 
            value={email}
            required
            placeholder="Enter your email"
            onChange={e => setEmail(e.target.value)}/>

          <input 
            type='password'
            value={password}
            required
            placeholder='Enter your password'
            onChange={e => setPassword(e.target.value)}/>

          <Button variant="contained" type='submit'>Login</Button>
        </form>
        <p>
          <Link to='/register'>Register</Link>
        </p>

        {/* <div>Sign in with gmail</div> */}
        {/* <button class="login-with-google-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button> */}
        
        
        <Link  to='/forgotpassword'>
          Forgot password
        </Link>
      
        
      </div>
      </ThemeProvider>
    </div>
  )
}

export default Login