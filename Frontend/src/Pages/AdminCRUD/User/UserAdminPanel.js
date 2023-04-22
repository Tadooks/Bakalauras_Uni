import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Link } from "react-router-dom";

import {auth} from '../../../firebase_config'




const UserAdminPanel = () => {

    //Add states

    //----------User data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);


    function getCurrentUser(auth) {
      return new Promise((resolve, reject) => {
         const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
         }, reject);
      });
    }


    const tes= async ()=>{
      await getCurrentUser(auth);
        
      fetch(`http://localhost:3001/users`,{
          method: "GET",
            headers: {
            'Content-Type': 'application/json',
            'user': auth.currentUser.uid
          },
        })
        .then(response => response.json())
        .then((usefulData) => {
          console.log(usefulData);
          setData(usefulData);
          setLoading(false);
        })
        .catch((e) => {
          console.error(`An error occurred: ${e}`)
        });
        setRefresh(false);
  }
    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {

        tes();
    }, [refresh]);
    // //------------------------------------------


    
    const handleDeleteUser=(user)=>{
        console.log("handleDeleteUser was clicked!");
        console.log(user.uid);
        if(window.confirm("Are you sure you want to delete " + user.email + " ?")){
            
            fetch(`http://localhost:3001/users/${user.uid}`,{
                method: "DELETE",
                headers: {
                  'Content-Type': 'application/json',
                  'user': auth.currentUser.uid
                },
                body: JSON.stringify(
                  { 
                    authid: user.authid,
                    uid: user.uid,
                  }
              )
            })
            .then(response => response.json())
            .then((usefulData) => {
                //console.log(usefulData);
                setData(usefulData);
                setRefresh(true);
                setLoading(false);
            })
            .catch((e) => {
                setRefresh(true);
                console.error(`An error occurred: ${e}`)
            });

        
            
        }
        setRefresh(true);
        
        return;
    }









    return(
        <div style={{ color: 'white'}}>

            {/* <Link to='/createuser'>
                <button>Add neeeew user</button>
            </Link> */}
            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
            

            <br></br>Commands su users: ?? reikia susiet su firebase, kad keiciant keistus ir auth database
            <br></br> Priskirt admin permissions
            <br></br> email verification status bool
            <table>
                    <thead>
                      <tr>
                        <th>Firebase uid</th>
                        <th>Auth id</th>
                        <th>Email</th>
                        <th>Verified</th>
                        <th>Permissions</th>
                      </tr>
                    </thead>
                    <tbody>

                      {console.log("Before mapping")}
                      {console.log(data)}
                      {Array.isArray(data) && data &&
                        data?.map((user) => (
                          <tr key={user.id}>
                            <td>{user.uid}</td>
                            <td>{user.authid}</td>
                            <td>{user.email}</td>
                            <td>{""+user.verified}</td>
                            <td>{user.permissions}</td>



                            <Link to={`/edituser/${user.uid}`}>
                                <button>Edit</button>
                            </Link>
                            {/* <button onClick={()=>OpenEditDialogWindow(user)}>Edit</button>  */}
                            <button onClick={()=>handleDeleteUser(user)}>Delete</button>
                            
                            

                          </tr>
                        ))}
                    </tbody>
            </table>

            
            

            </>
            )}
        </div>
    )
}

export default UserAdminPanel;