import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"
import { DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector } from '@mui/x-data-grid';
  
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { IconButton } from "@material-ui/core";
import {auth} from '../../../firebase_config'

//https://www.npmjs.com/package/react-player
import ReactPlayer from "react-player";

const ProductAdminPanel = () => {


    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [displayData, setDisplayData] = useState(null);

    const [refresh,setRefresh] = useState(false);

    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        
        fetch(`http://localhost:3001/products`,{
            method: "GET"
        })
          .then(response => response.json())
          .then((usefulData) => {
            //console.log(usefulData);
            setData(usefulData);
            console.log("then ivyko")
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
    }, [refresh]);
    // //------------------------------------------


    

    //delete not always doing its delete thing
    const handleDeleteProduct=(product)=>{
        console.log("handleDeleteProduct was clicked!");
        console.log(product.uid);
        if(window.confirm("Are you sure you want to delete " + product.name + " ?")){
            
            fetch(`http://localhost:3001/products/${product.uid}`,{
              method: "DELETE",
              headers: {
                'Content-Type': 'application/json',
                'user': auth.currentUser.uid
              },
              body: JSON.stringify({ uid: product.uid, user: auth.currentUser.uid })
            })
            .then(response => response.json())
            .then((usefulData) => {
                console.log("ResponseEEEEEEEEEEEEEEEEEEEEEEEEEE");
                console.log(usefulData);
                setLoading(false);
                setData(usefulData);
                setRefresh(true);
                console.log("ResponseEEEEEEEEEEEEEEEEEEEEEEEEEE");
            })
            .catch((e) => {
                setRefresh(true);
                console.error(`An error occurred: ${e}`)
            });      
        }
        setRefresh(true);
        
        return;
    }
    //another for filtering array :OO wowzers

    var columns = [
      
      { field: 'id', headerName: 'Count',  flex: 1,minWidth: 200, cellClassName: 'vertical-line' },
      { field: 'uid', headerName: 'Firebase uid',  flex: 1,minWidth: 210, cellClassName: 'vertical-line' },
      { field: 'name', headerName: 'Product name',  flex: 1,minWidth: 150, cellClassName: 'vertical-line' },

      { 
        field: 'price', 
        headerName: 'Price', 
        type: 'number', 
        flex: 1,minWidth: 90,
        valueFormatter: ({ value }) => `${value} €`,
        cellClassName: 'vertical-line'
      },

      { field: 'desc', headerName: 'Description',   flex: 1,minWidth: 250, cellClassName: 'vertical-line'},
      { field: 'type', headerName: 'Product type',  flex: 1,minWidth: 150, cellClassName: 'vertical-line'},
      { 
        field: 'image', 
        headerName: 'Image', 
        flex: 1,minWidth: 100, 
        cellClassName: 'vertical-line',
        renderCell: (params) => (
          
          <a href={params.value}>
            <img src={params.value} width={40} height={40}></img>
          </a>
        ),
      },
      {
        field: 'audio', 
        headerName: 'Audio', 
        flex: 1,minWidth: 250, 
        cellClassName: 'vertical-line',
        renderCell: (params) => {
          if (params.value != "None") {
            return (
              <ReactPlayer
                url={params.value}
                width="100%"
                height="50px"
                playing={false}
                controls={true}
              />
            );
          } else {
            return (
              <>
                None
              </>
            );
          }
        },
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,minWidth: 250,
        
        renderCell: (params) => {
          return (
            <div>
              <Link to={`/editproduct/${params.row.uid}`}>
              <Button>Edit</Button>
              </Link>

              {/* params.row gives the object */}
              <Button onClick={() => handleDeleteProduct(params.row)}>Delete</Button>
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
        <Link to='/createproduct'>
          <Button>Add product</Button>
        </Link>
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



    
// console.log("displayData");
// console.log(displayData);


    return(
        <div style={{ color: 'white'}}>

            {/* when empty this will get stuck on loading. */}
            <h1 style={{ textAlign: 'center' }}>Products</h1>
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
                  slots={{ 
                    toolbar: CustomToolbar,
                  }}
                />
              </div>

              </ThemeProvider>
            </>
            )}
        </div>
    )
}

export default ProductAdminPanel;
