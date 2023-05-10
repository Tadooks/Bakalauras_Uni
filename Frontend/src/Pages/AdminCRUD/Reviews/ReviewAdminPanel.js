import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"

import { DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector } from '@mui/x-data-grid';
  import { Button } from "@mui/material";

import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";

import {auth} from '../../../firebase_config'

import { ThemeProvider, createTheme } from '@mui/material/styles';

//https://www.npmjs.com/package/react-player
import ReactPlayer from "react-player";

const ReviewAdminPanel = () => {


    //---------- data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);

    const [displayData, setDisplayData] = useState(null);

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
        
      fetch(`https://bakalaurasserverrender.onrender.com/review`,{
          method: "GET",
            headers: {
            'Content-Type': 'application/json',
            'user': auth.currentUser.uid
          },
        })
        .then(response => response.json())
        .then((usefulData) => {
          setData(usefulData);
          console.log("DIS IS UZSEFUL ZDATA");
          console.log(usefulData);

          const rows = [];
          let idCounter = 1;
          Object.keys(usefulData).forEach((productId) => {
            Object.keys(usefulData[productId]).forEach((tempreviewId) => {
              rows.push({
                id: idCounter,
                name: usefulData[productId][tempreviewId].name,
                productID: usefulData[productId][tempreviewId].productID,
                reviewID: usefulData[productId][tempreviewId].reviewID,
                rating: usefulData[productId][tempreviewId].rating,
                review: usefulData[productId][tempreviewId].review,
                email: usefulData[productId][tempreviewId].email,
              });
              idCounter++;
            });
          });

          //add id number for data displays
          const dataWithIds = rows.map((item, index) => {
            return { ...item, id: index + 1 };
          });
          setDisplayData(dataWithIds);


          
          setLoading(false);
        })
        .catch((e) => {
          console.error(`An error occurred: ${e}`)
        });
        setRefresh(false);//needed for value refresh after clicking delete.
  }
    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {

        tes();
    }, [refresh]);
    // //------------------------------------------



    
    const handleDeleteReview=(tempReview)=>{
        console.log("handleDeleteReview was clicked!");
        console.log("tempReview");
        console.log(tempReview);
        const combineForDelete={
          productID: tempReview.productID,
          reviewID:tempReview.reviewID
        }
        console.log(combineForDelete);
        if(window.confirm("Are you sure you want to delete " + tempReview + " ?")){
            
            fetch(`https://bakalaurasserverrender.onrender.com/review/${combineForDelete}`,{
              method: "DELETE",
              headers: {
                'Content-Type': 'application/json',
                'user': auth.currentUser.uid
              },
              body: JSON.stringify(combineForDelete)
            })
            .then(response => response.json())
            .then((usefulData) => {
                //console.log(usefulData);
                setLoading(false);
                setData(usefulData);
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
      
      { field: 'id', headerName: 'Count', flex: 1, minWidth: 150, cellClassName: 'vertical-line' },
      { field: 'productID', headerName: 'Product ID', flex: 1, minWidth: 250, autoWidth: true, cellClassName: 'vertical-line' },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 250, autoWidth: true, cellClassName: 'vertical-line' },
      { field: 'rating', headerName: 'Rating', flex: 1, minWidth: 50, autoWidth: true, cellClassName: 'vertical-line' },
      { field: 'review', headerName: 'Review', flex: 1, minWidth: 250, autoWidth: true, cellClassName: 'vertical-line' },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 250, autoWidth: true, cellClassName: 'vertical-line' },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,minWidth: 250,
        
        renderCell: (params) => {
          return (
            <div>

              {/* params.row gives the object */}
              {console.log(params.row)}
              <Button onClick={() => handleDeleteReview(params.row)}>Delete</Button>
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
            <h1 style={{ textAlign: 'center' }}>Reviews</h1>
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

export default ReviewAdminPanel;

