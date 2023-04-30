import React,{useState, useEffect,useContext} from "react"

import Dialog from '@material-ui/core/Dialog';

import { Link } from "react-router-dom";
import {auth} from '../firebase_config'
import { AuthContext } from './AuthContextNew';
import { Button } from "@mui/material";

import { DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector } from '@mui/x-data-grid';

const ProfileOrders = () => {
    
    //getting user data from useContext
    const { user } = useContext(AuthContext);
    
    //if email matches, show the order

    const [displayData, setDisplayData] = useState(null);

    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [productDialogStuff, setProductDialogStuff] = useState("");
    const [shippingDialogStuff, setShippingDialogStuff] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOpenProducts, setDialogOpenProducts] = useState(false);
    const [dialogOpenShipping, setDialogOpenShipping] = useState(false);

    const [refresh,setRefresh] = useState(false);

    const [filteredPosts, setFilteredPosts] = React.useState([]);
    
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
          
        fetch(`http://localhost:3001/userOrders/`+auth.currentUser.uid ,{
            method: "GET",
              headers: {
              'Content-Type': 'application/json',
              'user': JSON.stringify(user[0])
            },
          })
          .then(response => response.json())
          .then((usefulData) => {


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
          //setRefresh(false);
    }
      // //-------GET PRODUCT DATA FROM API------------
      useEffect(() => {
  
          tes();
      }, [refresh]);
      // //------------------------------------------








      // Dialog close
    const handleCloseProducts = () => {
        setDialogOpenProducts(false);
    };
    const handleCloseShipping = () => {
        setDialogOpenShipping(false);
    };

    


    const OpenProductsDialog=async(orderarray)=>{

        await setProductDialogStuff(orderarray);
        setDialogOpenProducts(true);

    }
    const OpenShippingDialog=async(shippinginfo)=>{

      console.log("shippinginfo")
      console.log(shippinginfo)
      await setShippingDialogStuff(shippinginfo);
      setDialogOpenShipping(true);

    }

    const ProductsVisual=()=>{

      let tempSubtotal=0;
      if(productDialogStuff){
        productDialogStuff?.map((item) => (
          tempSubtotal=item.totalprice+tempSubtotal
        ))
      }
      

      return(
      <>
        <Dialog open={dialogOpenProducts} onClose={handleCloseProducts}>
            {/* Dialog content goes here */}
            
            <button variant="contained" onClick={handleCloseProducts}>Close</button>
            Products
            <table>
                    <thead>
                      <tr>
                        
                        <th>Name</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Size</th>
                        <th>Single product price</th>
                        <th>Combined price</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                    {productDialogStuff && 
                        productDialogStuff?.map((item) => (
                          <tr>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>{item.amount}</td>
                            <td>{item.productSize}</td>
                            <td>{item.price} €</td>
                            <td>{item.totalprice.toFixed(2)} €</td>
                          </tr>
                        ))
                      }
                    </tbody>
            </table>
            Subtotal of all products: {tempSubtotal.toFixed(2)} €
        </Dialog>
      </>
      );
    }


    const ShippingVisual=()=>{


      return(
      <>
        {/*-------------------Dialog EDIT window popup-------------------*/}
        <Dialog open={dialogOpenShipping} onClose={handleCloseShipping}>
            {/* Dialog content goes here */}
            
            <button variant="contained" onClick={handleCloseShipping}>Close</button>
            Shipping info
            <table>
                    <thead>
                      <tr>
                        
                        <th>Country</th>
                        <th>City</th>
                        <th>Post code</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Phone</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                            <td>{shippingDialogStuff.country}</td>
                            <td>{shippingDialogStuff.city}</td>
                            <td>{shippingDialogStuff.post}</td>
                            <td>{shippingDialogStuff.name}</td>
                            <td>{shippingDialogStuff.surname}</td>
                            <td>{shippingDialogStuff.phone}</td>
                    </tr>
                    </tbody>
            </table>
        </Dialog>
      </>
      );
    }


    const CalculateTotal=(item) => {
      let totalItemSum=0;
      item.map((temp) =>{
        totalItemSum=totalItemSum+temp.totalprice;
      })
      return totalItemSum.toFixed(2)
    };


    var columns = [
      
      { field: 'id', headerName: 'Count', flex: 1, cellClassName: 'vertical-line' },
      { field: 'ordernumber', headerName: 'Order number', flex: 1, autoWidth: true, cellClassName: 'vertical-line' },
      { field: 'email', headerName: 'Email', flex: 1,minWidth: 250, cellClassName: 'vertical-line' },
      { field: 'products', headerName: 'Products', flex: 1, cellClassName: 'vertical-line',
        renderCell: (params) => (
              
          <span className="clickableText" onClick={()=>OpenProductsDialog(params.row.products)}>Products</span >
        ),
    
      },
      { field: 'shippinginfo', headerName: 'Shipping info', flex: 1, cellClassName: 'vertical-line',
        renderCell: (params) => (
            
          <span className="clickableText" onClick={()=>OpenShippingDialog(params.row.shippinginfo)}>Shipping info</span >
        ),
      },


      // <span className="clickableText" onClick={()=>OpenShippingDialog(order.shippinginfo)}>Shipping info</span >
      { field: 'totalprice', headerName: 'Total price', flex: 1, type: 'number', sortable: false,
      renderCell: (params) => {
        
        return(
          <>
            {CalculateTotal(params.row.products)}
          </>
        );
      },
      cellClassName: 'vertical-line'
      },


      { field: 'totalproductcount', headerName: 'Total product count',type: 'number' ,flex: 1, cellClassName: 'vertical-line' },
      { field: 'paymentstatus', headerName: 'Payment status', flex: 1, cellClassName: 'vertical-line' },
      { field: 'deliverystatus', headerName: 'Delivery status', flex: 1, cellClassName: 'vertical-line' },
      { field: 'orderdate', headerName: 'Order date', flex: 1, cellClassName: 'vertical-line',
      renderCell: (params) => {
        
        return(
          <>
            {new Date(params.row.orderdate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour:"numeric",minute:"numeric"}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
          </>
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
    
    
      return(
        <div style={{ color: 'white'}}>
            <h1>My orders</h1>
            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
            {console.log(data)}
            After every order you make, you will receive a order confirmation email which will include payment information.<br></br>
            <Link to='/InfoPage'>
              MORE INFO
            </Link>
            <br></br>
            <b>Please write your order number which you are paying for</b><br></br><br></br>
            If you are having trouble with your order, contact support here: tadastadas81@gmail.com
            <br></br><br></br>
            <div style={{ height: 800, width: '100%', background: 'rgba(255, 255, 255, 1)'}}>
                <DataGrid style={{ }}
                   checkboxSelection={false}
                  rows={displayData}
                  bulkActionButtons={false}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  slots={{ toolbar: CustomToolbar }}
                  
                />
            </div>
            <ProductsVisual/>
            <ShippingVisual/>
            </>
            )}
        </div>
    )
}
export default ProfileOrders;