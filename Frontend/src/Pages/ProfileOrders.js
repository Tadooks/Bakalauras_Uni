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

  import { ThemeProvider, createTheme } from '@mui/material/styles';


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
    
    ///------------part of get. We wait until we get a response.
    function getCurrentUser(auth) {
        return new Promise((resolve, reject) => {
           const unsubscribe = auth.onAuthStateChanged(user => {
              unsubscribe();//unsubscribes from further updates
              resolve(user);
           }, reject);
        });
    }
      
      
      //Putting this here so we could use async in useEffect (and avoid refresh crash)
      //Reason for this is that getCurrentUser function (Above) cant be executed without useEffect being called first.
      //Header auth.current.User.uid was getting called to slow
      const tes= async ()=>{
        await getCurrentUser(auth);
          
        fetch(`https://bakalaurasserverrender.onrender.com/userOrders/`+auth.currentUser.uid ,{
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
            alert('Error, contact support: ' + e.message);
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
        <Dialog  open={dialogOpenProducts} onClose={handleCloseProducts}>
            {/* Dialog content goes here */}
            <div className="DialogPopup" >
            <Button variant="contained" onClick={handleCloseProducts}>Close</Button>
            <h4 style={{ textAlign: 'center' }}><b>Product info</b></h4>
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
                            <td className="tableInfo">{item.name}</td>
                            <td className="tableInfo">{item.type}</td>
                            <td className="tableInfo">{item.amount}</td>
                            <td className="tableInfo">{item.productSize}</td>
                            <td className="tableInfo">{item.price} €</td>
                            <td className="tableInfo">{item.totalprice.toFixed(2)} €</td>
                          </tr>
                        ))
                      }
                    </tbody>
            </table>
            <br></br>
            Subtotal of all products: {tempSubtotal.toFixed(2)} €
            </div>
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
            <div className="DialogPopup" >
            <div>
              <Button variant="contained" onClick={handleCloseShipping}>Close</Button>
            </div>
            <h4 style={{ textAlign: 'center' }}><b>Shipping info</b></h4>
            <table>
                    <thead>
                      <tr>
                        
                        <th>Country</th>
                        <th>City</th>
                        <th>Address</th>
                        <th>Postal code</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Phone</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                            <td className="tableInfo">{shippingDialogStuff.country}</td>
                            <td className="tableInfo">{shippingDialogStuff.city}</td>
                            <td className="tableInfo">{shippingDialogStuff.address}</td>
                            <td className="tableInfo">{shippingDialogStuff.post}</td>
                            <td className="tableInfo">{shippingDialogStuff.name}</td>
                            <td className="tableInfo">{shippingDialogStuff.surname}</td>
                            <td className="tableInfo">{shippingDialogStuff.phone}</td>
                    </tr>
                    </tbody>
            </table>
            </div>
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
              
          <span className="clickableTextDark" onClick={()=>OpenProductsDialog(params.row.products)}>Products</span >
        ),
    
      },
      { field: 'shippinginfo', headerName: 'Shipping info', flex: 1, cellClassName: 'vertical-line',
        renderCell: (params) => (
            
          <span className="clickableTextDark" onClick={()=>OpenShippingDialog(params.row.shippinginfo)}>Shipping info</span >
        ),
      },


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


    
        //---------------------MAIN RETURN---------------------------
      return(
        <div style={{ color: 'white'}}>
            <h1 style={{ textAlign: 'center' }}>My orders</h1>
            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
            <ThemeProvider theme={theme}>
            {console.log(data)}
            <div className="OrderInfoProfile">
              After every order you make, you will receive a order confirmation email in 24 hours which will include payment information.<br></br>
              <Link to='/InfoPage'>
                <div className="clickableText">
                MORE INFO
                </div>
              </Link>
              <br></br>
              <b>When sending your payment, please write your order number which you are paying for</b><br></br><br></br>
              If you are having trouble with your order, contact support here: <b> tadasdevenas00@gmail.com </b>
              <br></br><br></br>
            </div>
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
            <ProductsVisual/>
            <ShippingVisual/>
            </ThemeProvider>
            </>
            )}
        </div>
    )
}
export default ProfileOrders;