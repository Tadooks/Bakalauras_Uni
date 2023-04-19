
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"
import Button from '@material-ui/core/Button';

import { Link,useNavigate, useParams } from "react-router-dom";

import { IconButton } from "@material-ui/core";


const EditUser = () => {

    //Add states
    const [userAuthId, setUserAuthId] = useState('');
    const [userEmail, setUserEmail] = useState('');

    

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
            
            setUserAuthId(usefulData.authid);
            setUserEmail(usefulData.email);

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
            },
            body: JSON.stringify(
                { 
                    uid: idFromURL,
                    authid: userAuthId,
                    email: userEmail,
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

    return(
        <div style={{ color: 'white'}}>

            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
                
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
    
                {/* Dialog content goes here */}
                <div>Edit window content</div>

                <Link to='/useradminpanel'>
                    <Button variant="contained">Back</Button>
                </Link>
                

                <form onSubmit={handleEditUser} >
                authid:
                <input 
                    type='text' 
                    value={userAuthId}
                    placeholder="Auth ID"
                    required
                    onChange={e=>setUserAuthId(e.target.value)}
                />
                email:
                <input 
                    type='text' 
                    value={userEmail}
                    placeholder="Email"
                    required
                    onChange={e=>setUserEmail(e.target.value)}
                />

                <Button variant="contained" type='submit'>Save changes</Button>
                </form>


            
        

            </>
            )}
        </div>
    )
}

export default EditUser;