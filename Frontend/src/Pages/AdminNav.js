import { useContext } from 'react';
import {Link} from 'react-router-dom'
import { AuthContext } from './AuthContextNew';


export default function AdminPanelNav() {
    const { user } = useContext(AuthContext);
    console.log(user[0])
    console.log(Object.keys(user[0]).length)
    return (
            <div>
                {user[0] && Object.keys(user[0]).length !== 0 && user[0].permissions == "admin"?(
                    <>
                        <Link to="productslist">Product list</Link>
                        <Link to="productadminpanel">Product Admin panel</Link>
                        <Link to="useradminpanel">User Admin user</Link>
                        <Link to="orderadminpanel">Order Admin panel</Link>
                        <Link to="reviewadminpanel">Review Admin panel</Link>
                        <Link to="requestadminpanel">Request admin panel</Link>
                    
                    </>
                ) :(
                <>
                    
                </>
                )}
            </div>
    )
    
  }