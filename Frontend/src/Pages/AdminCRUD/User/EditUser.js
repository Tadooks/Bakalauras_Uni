
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"


import { Link,useNavigate, useParams } from "react-router-dom";

import { IconButton } from "@material-ui/core";

import {auth} from '../../../firebase_config'


import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const EditUser = () => {

    //Add states
    const [userAuthId, setUserAuthId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userVerified, setUserVerified] = useState(false);
    const [userPermissions, setUserPermissions] = useState('None');

    

    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);

    const navigate = useNavigate()

    //get id from URL
    const idFromURL= window.location.pathname.split('/').pop();
    

    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        
        fetch(`http://localhost:3001/users/${idFromURL}`,{
            method: "GET"
        })
          .then(response => response.json())
          .then((usefulData) => {
            //setting fetched data
            setData(usefulData);
            //console.log(usefulData.verified)
            setUserAuthId(usefulData.authid);
            setUserEmail(usefulData.email);
            setUserVerified(usefulData.verified);
            setUserPermissions(usefulData.permissions);

            setLoading(false);//stop loading once data is fetched.
            
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });

          setRefresh(false);
    }, []);
    // //------------------------------------------

    

    //------------EDIT PRODUCT------------
    const handleEditUser=(e,user)=>{
        e.preventDefault()
        console.log("handleEditUser was clicked!");

        // console.log(user);
        fetch(`http://localhost:3001/users/${idFromURL}`,{
            method: "PUT",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'user': auth.currentUser.uid
            },
            body: JSON.stringify(
                { 
                    uid: idFromURL,
                    authid: userAuthId,
                    email: userEmail,
                    verified: userVerified,
                    permissions: userPermissions,
                }
            )
        })
          .then(response => {
            alert('Edited successfully');
            navigate('/useradminpanel')
          })
          .then((usefulData) => {
            setLoading(false);
            setData(usefulData);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });

    
        //   setRefresh(true);
        return;
    }
    //------------------------------------



    //--------------------CSS for MUI table-------------------------
    const theme = createTheme({
        palette: {
          primary: {
            main: '#5a0061',
          },
          secondary: {
            main: '#5a0061', 
          },
        },
      });
      //---------------------------------------------------------------
  

    return(
        <div style={{ color: 'white'}}>
            <ThemeProvider theme={theme}>
            <h1 style={{ textAlign: 'center' }}>Edit user</h1>
            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
                
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
                <div className="EditProduct-Screenerino">
                    <div>
                {/* Dialog content goes here */}
                <div style={{ textAlign: 'center' }}>
                    <Link to='/useradminpanel'>
                        <Button variant="contained">Back</Button><br></br><br></br>
                    </Link>
                </div>
                

                <form onSubmit={handleEditUser} >
                <div>
                    Email:
                    {userEmail}<br></br><br></br>
                </div>
                Verified:{""+ userVerified}<br></br><br></br>

                Permissions:
                <select id="permissions" name="permissions" value={userPermissions} onChange={e => setUserPermissions(e.target.value)}>
                    <option value="None">None</option>
                    <option value="admin">admin</option>
                </select><br></br><br></br>

                <div style={{ textAlign: 'center' }}>
                <Button variant="contained" type='submit'>Save changes</Button>
                </div>
                </form>


            
                </div>
                </div>
            </>
            )}
            </ThemeProvider>
        </div>
    )
}

export default EditUser;