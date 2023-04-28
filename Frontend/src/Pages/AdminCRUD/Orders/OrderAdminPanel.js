import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"

import Dialog from '@material-ui/core/Dialog';

import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";

import {auth} from '../../../firebase_config'

//https://www.npmjs.com/package/react-player
import ReactPlayer from "react-player";
import { ContactlessOutlined } from "@material-ui/icons";

const OrderAdminPanel = () => {


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
          
        fetch(`http://localhost:3001/orders`,{
            method: "GET",
              headers: {
              'Content-Type': 'application/json',
              'user': auth.currentUser.uid
            },
          })
          .then(response => response.json())
          .then((usefulData) => {
            setData(usefulData);
            console.log("MMmm watcha saaaay aaay, ");
            console.log(usefulData[0]);

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



    //delete not always doing its delete thing
    const handleDeleteOrder=(order)=>{
        console.log("handleDeleteOrder was clicked!");
        if(window.confirm("Are you sure you want to delete " + order.ordernumber + " ?")){
            
            fetch(`http://localhost:3001/orders/${order.uid}`,{
              method: "DELETE",
              headers: {
                'Content-Type': 'application/json',
                'user': auth.currentUser.uid
              },
              body: JSON.stringify({ uid: order.uid, user: auth.currentUser.uid })
            })
            .then(response => response.json())
            .then((usefulData) => {
                console.log(usefulData);
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

      let tempSubtotal=0.00;
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
            Order number:
            <table>
                    <thead>
                      <tr>
                        
                        <th>Name</th>
                        <th>Type</th>
                        <th>Amount</th>
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
                            <td>{item.price} €</td>
                            <td>{item.totalprice.toFixed(2)} €</td>
                          </tr>
                        ))
                      }
                    </tbody>
            </table>
            Subtotal of all products: {tempSubtotal} €
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
            Order number:
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
      return totalItemSum.toFixed(2);
    };

    return(
        <div style={{ color: 'white'}}>

            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
            {console.log(data)}

            <table>
                    <thead>
                      <tr>
                        
                        <th>Order number</th>
                        <th>Email</th>
                        <th>Products</th>
                        <th>Shipping info</th>
                        <th>Total price</th>
                        <th>Total product count</th>
                        <th>Payment status</th>
                        <th>Delivery status</th>
                        <th>Order date</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {data && 
                        data?.map((order) => (
                          
                          <tr key={order.id}>
                            <td>{order.ordernumber}</td>
                            <td>{order.email}</td>

                            <td><span className="clickableText" onClick={()=>OpenProductsDialog(order.products)}>Products info</span > </td>
                            <td><span className="clickableText" onClick={()=>OpenShippingDialog(order.shippinginfo)}>Shipping info</span > </td>
                            
                            
                            <td>{CalculateTotal(order.products)} €</td>
                            <td>{order.totalproductcount}</td>
  
                            <td>{order.paymentstatus}</td>
                            <td>{order.deliverystatus}</td>
                            <td>{new Date(order.orderdate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour:"numeric",minute:"numeric"}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}</td>
                            {/* Add the open single order  */}

                            <Link to={`/editorder/${order.uid}`}>
                                <button>Edit</button>
                            </Link>

                            <button onClick={()=>handleDeleteOrder(order)}>Delete</button>

                          </tr>
                        ))}
                    </tbody>
            </table>
            <ProductsVisual/>
            <ShippingVisual/>
            </>
            )}
        </div>
    )
}

export default OrderAdminPanel;
