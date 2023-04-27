import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Link } from "react-router-dom";

import {auth} from '../../../firebase_config'




const RequestAdminPanel = () => {

    //Add states

    //----------Request data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);


    ///------------part of get
    function getCurrentRequest(auth) {
      return new Promise((resolve, reject) => {
         const unsubscribe = auth.onAuthStateChanged(request => {
            unsubscribe();
            resolve(request);
         }, reject);
      });
    }

    //Putting this here so we could use async in useEffect (and avoid refresh crash)
    //Reason for this is that getCurrentRequest function (Above) cant be executed without useEffect being called first.
    //Header auth.current.Request.uid was getting called to slow
    const tes= async ()=>{
      await getCurrentRequest(auth);
        
      fetch(`http://localhost:3001/requests`,{
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


    
    const handleDeleteRequest=(request)=>{
        console.log("handleDeleteRequest was clicked!");
        console.log(request.uid);
        if(window.confirm("Are you sure you want to delete " + request.email + " ?")){
            
            fetch(`http://localhost:3001/requests/${request.uid}`,{
                method: "DELETE",
                headers: {
                  'Content-Type': 'application/json',
                  'user': auth.currentUser.uid
                },
                body: JSON.stringify(
                  { 
                    authid: request.authid,
                    uid: request.uid,
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

            {/* <Link to='/createrequest'>
                <button>Add neeeew request</button>
            </Link> */}
            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
            

            <br></br>Commands su requests: ?? reikia susiet su firebase, kad keiciant keistus ir auth database
            <br></br> Priskirt admin permissions
            <br></br> email verification status bool
            <table>
                    <thead>
                      <tr>
                        <th>Firebase uid</th>
                        <th>Email</th>
                        <th>Budget</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Genre</th>
                        <th>Sound pack type</th>
                        <th>Synth preset pack</th>
                        <th>Include project</th>
                      </tr>
                    </thead>
                    <tbody>

                      {console.log("Before mapping")}
                      {console.log(data)}
                      {Array.isArray(data) && data &&
                        data?.map((request) => (
                          <tr>
                            <td>{request.uid}</td>
                            <td>{request.email}</td>
                            <td>{request.budget}</td>
                            <td>{request.type}</td>
                            <td>{request.description}</td>
                            <td>{request.genre}</td>
                            <td>{request.soundpacktype}</td>
                            <td>{request.synthpresetpack}</td>
                            <td>{request.includeproject}</td>
                            
                            


                            <button onClick={()=>handleDeleteRequest(request)}>Delete</button>
                            
                            

                          </tr>
                        ))}
                    </tbody>
            </table>

            
            

            </>
            )}
        </div>
    )
}

export default RequestAdminPanel;