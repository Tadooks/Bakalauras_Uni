
import { signOut } from 'firebase/auth' 
import { auth } from '../firebase_config'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom'

import { AuthContext } from './AuthContextNew';

function Profile() {
  const { user, setUser  } = useContext(AuthContext);

  const navigate = useNavigate()
  if(auth.currentUser==null && auth.currentUser.emailVerified==false)
  {
    navigate("/login");
    setUser([{}]);
    window.localStorage.setItem("userAccount",JSON.stringify({})) ;
  }
  useEffect(() => {
    if(auth.currentUser == null && auth.currentUser.emailVerified==false)
    {
      navigate("/login");
      setUser([{}]);
      window.localStorage.setItem("userAccount",JSON.stringify({})) ;
    }

  }, [])

    


  
  
  //add loading
  return (
    <div style={{ color: 'white'}}>
      <div style={{ background: 'white', color: 'black'}} className='center'>
        <div className='profile'>
          <h1>Profile</h1>
          <p><strong>Email: </strong>{auth.currentUser.email}</p>
          <p>
            <strong>Email verified: </strong>
            {`${auth.currentUser.emailVerified}`}
            
          </p>
          <p><Link to='/changepassword'>Change password</Link></p>
          <span onClick={() => {
            signOut(auth);
            setUser([{}]);
            
            window.localStorage.setItem("userAccount",JSON.stringify({}) );

             navigate("/login");
              window.location.reload(true);
              }}>Sign Out</span>
        </div>
        
      </div>
      
      <Link to="/ProfileOrders">
        My orders:
      </Link>
      </div>
  )
}

export default Profile