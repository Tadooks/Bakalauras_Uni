import React,{useState, useEffect,useContext} from "react"

import Dialog from '@material-ui/core/Dialog';

import { Link } from "react-router-dom";
import {auth} from '../firebase_config'
import { AuthContext } from './AuthContextNew';

const ProfileOrders = () => {
    
    //getting user data from useContext
    const { user } = useContext(AuthContext);
    
    //if email matches, show the order


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
            usefulData?.map((item) => {
                console.log(item)
                if (item.email==user[0].email) {
                    
                }   
                
            })
            console.log(usefulData)

            setData(usefulData);
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
                            <td>{item.totalprice} €</td>
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
      return totalItemSum
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
            After every order you make, you will receive a order confirmation email which will include payment information.
            <Link to='/InfoPage'>
              MORE INFO
            </Link>
            <b>Please write your order number what you are paying for</b><br></br><br></br>
            If you are having trouble with your order, contact support here: tadastadas81@gmail.com
            <br></br><br></br>
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
export default ProfileOrders;