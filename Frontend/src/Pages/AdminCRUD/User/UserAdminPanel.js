import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"

import Dialog from '@material-ui/core/Dialog';
import { Link } from "react-router-dom";

import {auth} from '../../../firebase_config'

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Button } from "@mui/material";

import { DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector } from '@mui/x-data-grid';


const UserAdminPanel = () => {

    //Add states


    const [displayData, setDisplayData] = useState(null);
    //----------User data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);


    ///------------part of get
    function getCurrentUser(auth) {
      return new Promise((resolve, reject) => {
         const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
         }, reject);
      });
    }

    //Putting this here so we could use async in useEffect (and avoid refresh crash)
    //Reason for this is that getCurrentUser function (Above) cant be executed without useEffect being called first.
    //Header auth.current.User.uid was getting called to slow
    const tes= async ()=>{
      await getCurrentUser(auth);
        
      fetch(`https://bakalaurasserverrender.onrender.com/users`,{
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

          //add id number for data displays
          const dataWithIds = usefulData.map((item, index) => {
            return { ...item, id: index + 1 };
          });
          setDisplayData(dataWithIds);


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
            
            fetch(`https://bakalaurasserverrender.onrender.com/users/${user.uid}`,{
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




    var columns = [
      
      { field: 'id', headerName: 'Count', width: 150, cellClassName: 'vertical-line' },
      // { field: 'uid', headerName: 'Firebase uid', width: 210, cellClassName: 'vertical-line' },
      // { field: 'authid', headerName: 'Auth id', width: 200, cellClassName: 'vertical-line' },
      { field: 'email', headerName: 'Email',  width: 200, cellClassName: 'vertical-line'},
      { field: 'verified', headerName: 'Verified', width: 200, cellClassName: 'vertical-line'},
      { field: 'permissions', headerName: 'Permissions', width: 200, cellClassName: 'vertical-line'},
      
    
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        
        renderCell: (params) => {
          return (
            <div>
              <Link to={`/edituser/${params.row.uid}`}>
              <Button>Edit</Button>
              </Link>

              {/* params.row gives the object */}
              <Button onClick={() => handleDeleteUser(params.row)}>Delete</Button>
            </div>
          );
        },
        
      },
    ];

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />

        </GridToolbarContainer>
      );
    }


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
            <h1 style={{ textAlign: 'center' }}>Users</h1>
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
              <ThemeProvider theme={theme}>
                
              <div style={{ height: '100%', minHeight: 250, width: '100%'}}>
              <DataGrid style={{ 
                  background: 'rgba(255, 255, 255, 1)',
                  color: '#333'
                }}
                   checkboxSelection={false}
                  rows={displayData}
                  bulkActionButtons={false}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  slots={{ toolbar: CustomToolbar }}
                />
              </div>

              </ThemeProvider>
            </>
            )}
        </div>
    )
}

export default UserAdminPanel;