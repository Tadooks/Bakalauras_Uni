import {useAuthValue} from './AuthContext'
import { signOut } from 'firebase/auth' 
import { auth } from '../firebase_config'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'


function Profile() {
  const navigate = useNavigate()
  if(auth.currentUser==null)
  {
    navigate("/login")
  }
  useEffect(() => {
    if(auth.currentUser==null)
    {
         navigate("/login")
    }

  }, [])

  
  
  //add loading
  return (
      <div style={{ background: 'white'}} className='center'>
        <div className='profile'>
          <h1>Profile</h1>
          <p><strong>Email: </strong>{auth.currentUser.email}</p>
          <p>
            <strong>Email verified: </strong>
            {`${auth.currentUser.emailVerified}`}
            
          </p>
          <p><Link to='/changepassword'>Change password</Link></p>
          <span onClick={() => {signOut(auth); navigate("/login"); window.location.reload(true)}}>Sign Out</span>
        </div>
        
      </div>
  )
}

export default Profile