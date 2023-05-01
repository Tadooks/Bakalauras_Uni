import {useState} from 'react'
import {auth} from '../firebase_config';
import {sendPasswordResetEmail} from 'firebase/auth'

import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';


function ForgotPassword() {
    const [email, setEmail] = useState('')
    // const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [emailMessage, setEmailMessage] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        
        await sendPasswordResetEmail(auth,email);
        
        setEmailMessage(true);
        console.log("mmm???")
      } catch (err) {    
        if (err.code === 'auth/user-not-found') {
          alert('User not found, try again!');
          console.log(err);
          setEmail('');
        }
      }
    };


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
          {
            emailMessage ?
            <h3>The Email has been sent <br></br> Check your Inbox!</h3> : 
            <form onSubmit={handleSubmit}>
              <input 
                type="email" 
                name="email"
                placeholder="name@email.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div>
                <Button variant="contained" type='submit'>Reset Your Password</Button>
              </div>
            </form>
          }
        </div>
        </ThemeProvider>
      </div>
    )
  }

export default ForgotPassword