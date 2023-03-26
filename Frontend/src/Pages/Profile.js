import {useAuthValue} from './AuthContext'
import { signOut } from 'firebase/auth' 
import { auth } from '../firebase_config'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";

function Profile() {
  const {currentUser} = useAuthValue()
  const navigate = useNavigate()

  useEffect(() => {
    // if(currentUser==null)
    // {
    //     navigate("/login")
    // }

  }, [])
  
  //add loading
  return (
      <div style={{ color: 'white'}} className='center'>
        <div className='profile'>
          <h1>Profile</h1>
          <p><strong>Email: </strong>{currentUser?.email}</p>
          <p>
            <strong>Email verified: </strong>
            {`${currentUser?.emailVerified}`}
          </p>
          <span onClick={() => signOut(auth)}>Sign Out</span>
        </div>
      </div>
  )
}

export default Profile