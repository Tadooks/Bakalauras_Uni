import {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import {signInWithEmailAndPassword, sendEmailVerification, signOut} from 'firebase/auth'
import {auth, signInWithGoogle} from '../firebase_config'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from './AuthContextNew'


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
      //i need realtimedatabase id
      fetch(`http://localhost:3001/auth/${auth.currentUser.uid}`,{
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
      navigate('/')
    }
    })
    .catch(err => setError(err.message))
  }

  return(
    <div style={{ color: 'white'}} className='center'>
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

          <button type='submit'>Login</button>
        </form>
        <p>
          Don't have and account? 
          <Link to='/register'>Create one here</Link>
        </p>

        <div>Sign in with gmail</div>
        <button class="login-with-google-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        
        <p>Forgot your password?</p> <Link to='/forgotpassword'>Reset password</Link>
      
        
      </div>
    </div>
  )
}

export default Login