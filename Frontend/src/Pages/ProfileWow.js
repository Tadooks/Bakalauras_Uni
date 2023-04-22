import { useContext } from 'react';
import {Link} from 'react-router-dom'
import { AuthContext } from './AuthContextNew';


export default function ProfileNew() {
    const { user } = useContext(AuthContext);
    console.log(user[0])
    console.log(Object.keys(user[0]).length)
    return (
            <div>
                {user[0] && Object.keys(user[0]).length !== 0?(
                    <Link to="profile">Profile: {user[0].email}</Link>
                ) :(
                <>
                    <Link to="login">Non no</Link>
                </>
                )}
            </div>
    )
    
  }