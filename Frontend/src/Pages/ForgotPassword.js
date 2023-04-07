import {useState} from 'react'
import {auth} from '../firebase_config';
import {useNavigate, Link} from 'react-router-dom'
import {createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged,sendPasswordResetEmail} from 'firebase/auth'
import {useAuthValue} from './AuthContext'
import userEvent from '@testing-library/user-event';
import {signOut,passwordR} from 'firebase/auth'



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
    
    return (
      <div style={{ color: 'white'}} className='center'>
        <div className='auth'>
          {
            emailMessage ?
            <h3>The Email has been sent; Check your Inbox!</h3> : 
            <form onSubmit={handleSubmit}>
              <input 
                type="email" 
                name="email"
                placeholder="name@email.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div>
                <button type='submit'>Reset Your Password</button>
              </div>
            </form>
          }
        </div>
      </div>
    )
  }

export default ForgotPassword