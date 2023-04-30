import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Link } from "react-router-dom";

import {auth} from '../../../firebase_config'

import { DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector } from '@mui/x-data-grid';

  import { ThemeProvider, createTheme } from '@mui/material/styles';
const RequestAdminPanel = () => {

    //Add states

    //----------Request data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);

    const [displayData, setDisplayData] = useState(null);


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



    var columns = [
      
      { field: 'id', headerName: 'Count',  flex: 1,minWidth: 150, cellClassName: 'vertical-line' },
      { field: 'email', headerName: 'Email',  flex: 1,minWidth: 200, cellClassName: 'vertical-line' },
      { 
        field: 'budget', 
        headerName: 'Budget', 
        type: 'number', 
        flex: 1,minWidth: 150,
        valueFormatter: ({ value }) => `${value} €`,
        cellClassName: 'vertical-line'
      },
      { field: 'type', headerName: 'Type',  flex: 1, minWidth: 150, cellClassName: 'vertical-line' },
      { field: 'description', headerName: 'Description',  flex: 1, minWidth: 250, cellClassName: 'vertical-line' },
      { field: 'genre', headerName: 'Genre',  flex: 1, minWidth: 140, cellClassName: 'vertical-line' },
      { field: 'synthpresetpack', headerName: 'Synth Preset Pack',  flex: 1, minWidth: 100, cellClassName: 'vertical-line' },
      { field: 'includeproject', headerName: 'Include project',  flex: 1, minWidth: 100, cellClassName: 'vertical-line' },
      
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,minWidth: 250,
        
        renderCell: (params) => {
          return (
            <div>
              <Button onClick={() => handleDeleteRequest(params.row)}>Delete</Button>
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
            <h1 style={{ textAlign: 'center' }}>Requests</h1>
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

export default RequestAdminPanel;