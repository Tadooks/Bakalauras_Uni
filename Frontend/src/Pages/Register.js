import {useState} from 'react'
import {auth} from '../firebase_config';
import {useNavigate, Link} from 'react-router-dom'
import {createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged} from 'firebase/auth'
import {signOut} from 'firebase/auth'


//set this up then check what you can delete

import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';


function Register() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validatePassword = () => {
    let isValid = true
    if (password !== '' && confirmPassword !== ''){
      if (password !== confirmPassword) {
        isValid = false
        setError('Passwords does not match')
      }
    }
    return isValid
  }

  //register su google pridet.
  //old register
  const register = e => {
    e.preventDefault()
    setError('')
    if(validatePassword()) {
      // Create a new user with email and password using firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then(async () => {
          
          console.log(auth.currentUser)
          fetch(`http://localhost:3001/users`,{
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(
                { 
                  authid: auth.currentUser.uid,
                  email: auth.currentUser.email,
                  verified:  auth.currentUser.emailVerified
                  //permissions: userPermissions
                }
            )
        })
          .then(response => {
            alert('Created successfully, please verify your email!');
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });

          sendEmailVerification(auth.currentUser)   
          .then(async () => {
            await signOut(auth)//sign out user, so he could only login when verified.
            signOut(auth)
            navigate('/login')
            window.location.reload(true)//quick fix profile login bug :-)
          }).catch((err) => alert(err.message))
        })
        .catch(err => setError(err.message))
    }
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }


    //--------------------CSS for MUI table(well and buttons apparently)-------------------------
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

  return (
    <div style={{ color: 'white'}} className='center'>
      <ThemeProvider theme={theme}>
      <div className='auth'>
        <h1>Register</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={register} name='registration_form'>
          <input 
            type='email' 
            value={email}
            placeholder="Enter your email"
            required
            onChange={e => setEmail(e.target.value)}/>

          <input 
            type='password'
            value={password} 
            required
            placeholder='Enter your password'
            onChange={e => setPassword(e.target.value)}/>

            <input 
            type='password'
            value={confirmPassword} 
            required
            placeholder='Confirm password'
            onChange={e => setConfirmPassword(e.target.value)}/>

          <Button variant="contained" type='submit'>Register</Button>
        </form>
        <span>
          Already have an account?<br></br>
          <Link to='/login'>Login</Link>
        </span>
      </div>
      </ThemeProvider>
    </div>
  )
}

export default Register