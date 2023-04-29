import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"
import { DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector } from '@mui/x-data-grid';

  import { DataGridPro,GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector } from '@mui/x-data-grid-pro';


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
                //console.log(usefulData);
                setLoading(false);
                setData(usefulData);
                setRefresh(true);
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
      
      { field: 'id', headerName: 'Count', width: 120 },
      { field: 'uid', headerName: 'Firebase uid', width: 210 },
      { field: 'name', headerName: 'Product name', width: 200 },
      { 
        field: 'price', 
        headerName: 'Price', 
        type: 'number', 
        width: 200,
        valueFormatter: ({ value }) => `${value} €` 
      },
      { field: 'desc', headerName: 'Description',  width: 200},
      { field: 'type', headerName: 'Product type', width: 200},
      { field: 'image', headerName: 'Image', width: 200},
      { field: 'audio', headerName: 'Audio', width: 200},
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => {
          return (
            <div>
              <Link to={`/editproduct/${params.row.uid}`}>
              <Button>Edit</Button>
              </Link>
              {console.log(params)}
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
    
console.log("displayData");
console.log(displayData);


    return(
        <div style={{ color: 'white'}}>

            <Link to='/createproduct'>
                <Button>Add product</Button>
            </Link>
            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
              <div style={{ height: 600, width: '100%', background: 'rgba(255, 255, 255, 1)'}}>
                <DataGrid style={{ }}
                   checkboxSelection={false}
                  rows={displayData}
                  bulkActionButtons={false}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  slots={{ toolbar: CustomToolbar }}
                  enableColumnResize={true}
                />
              </div>

            
            </>
            )}
        </div>
    )
}

export default ProductAdminPanel;
