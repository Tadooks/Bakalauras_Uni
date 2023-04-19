
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"
import Button from '@material-ui/core/Button';

import { Link,useNavigate } from "react-router-dom";

import { IconButton } from "@material-ui/core";


const CreateUser = () => {

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


    
    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        
        fetch(`http://localhost:3001/users`,{
            method: "GET"
        })
          .then(response => response.json())
          .then((usefulData) => {
            //console.log(usefulData);
            setLoading(false);
            setData(usefulData);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });
          setRefresh(false);
    }, [refresh]);
    // //------------------------------------------

    //------------CREATE PRODUCT------------
    const handleCreateUser=e=>{
        e.preventDefault()
        console.log("handleCreateUser was clicked!");

        fetch(`http://localhost:3001/users`,{
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(
                { 
                    authid: userAuthId,
                    email: userEmail,

                }
            )
        })
          .then(response => {
            alert('Created successfully');
            navigate('/useradminpanel')
          })
          .then((usefulData) => {
            setData(usefulData);
            setLoading(false);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });

    
          setRefresh(true);
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
                <div>Create Content</div>

                <Link to='/useradminpanel'>
                <Button variant="contained">Close</Button>
                </Link>
                

                <form onSubmit={handleCreateUser} >
                <input 
                    type='text' 
                    value={userAuthId}
                    placeholder="User id"
                    required
                    onChange={e => setUserAuthId(e.target.value)}
                />

                <input 
                    type='email' 
                    value={userEmail}
                    placeholder="Email"
                    required
                    onChange={e=>setUserEmail(e.target.value)}
                />


                <Button variant="contained" type='submit'>Add new</Button>
                </form>

            </>
            )}
        </div>
    )
}

export default CreateUser;