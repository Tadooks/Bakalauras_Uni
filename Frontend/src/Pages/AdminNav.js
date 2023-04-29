import { useContext } from 'react';
import {Link} from 'react-router-dom'
import { AuthContext } from './AuthContextNew';


export default function AdminPanelNav() {
    const { user } = useContext(AuthContext);
    // console.log(user[0])
    // console.log(Object.keys(user[0]).length)
    return (
            <div className="AdminNav">
                {user[0] && Object.keys(user[0]).length !== 0 && user[0].permissions == "admin"?(
                    <>
                    <div>
                        <Link to="productadminpanel">Product panel</Link>
                        <Link to="useradminpanel">User panel</Link>
                        <Link to="orderadminpanel">Order panel</Link>
                        <Link to="reviewadminpanel">Review panel</Link>
                        <Link to="requestadminpanel">Request panel</Link>
                    </div>    
                    
                    </>
                ) :(
                <>
                    
                </>
                )}
            </div>
    )
    
  }