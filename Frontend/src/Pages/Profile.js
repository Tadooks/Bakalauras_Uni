import {useAuthValue} from './AuthContext'
import { signOut } from 'firebase/auth' 
import { auth } from '../firebase_config'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";

function Profile() {
  const {currentUser} = useAuthValue()
  const navigate = useNavigate()

  const [refresh,setRefresh] = useState(false);

  useEffect(() => {
    // if(currentUser==null)
    // {
    //     navigate("/login")
    // }
    // setRefresh(false);
  }, [])


  
  //add loading
  return (
      <div style={{ background: 'white'}} className='center'>
        <div className='profile'>
          <h1>Profile</h1>
          <p><strong>Email: </strong>{currentUser?.email}</p>
          <p>
            <strong>Email verified: </strong>
            {`${currentUser?.emailVerified}`}
            
          </p>
          <span onClick={() => {signOut(auth); navigate("/login")}}>Sign Out</span>
        </div>
      </div>
  )
}

export default Profile