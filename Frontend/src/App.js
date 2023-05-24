import './App.css';
import {BrowserRouter as Router, Link, Routes, Route, useNavigate, Navigate} from 'react-router-dom'
import Home from './Pages/Home';
import Request from './Pages/Request';
import Shop from './Pages/Shop';
import Cart from './Pages/Cart';
import Product from './Details/Product';
import Login from './Pages/Login';
import { createContext, useEffect, useState,useContext,useMemo } from "react";
import { auth } from './firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
//import { AuthProvider } from './Pages/AuthContext';
import Register from './Pages/Register';
import VerifyEmail from './Pages/VerifyEmail';
import Profile from './Pages/Profile';
import { async } from '@firebase/util';
import ForgotPassword from './Pages/ForgotPassword';
import ChangePassword from './Pages/ChangePassword';
import Cert from './Pages/CartCount';
import AdminPanelNav from './Pages/AdminNav';
import ProfileNew from './Pages/ProfileWow';
import {CartContext} from './Pages/CartContext';

import Checkout from './Pages/Checkout';
import CreateProduct from './Pages/AdminCRUD/Product/CreateProduct';
import EditProduct from './Pages/AdminCRUD/Product/EditProduct';
import ProductAdminPanel from './Pages/AdminCRUD/Product/ProductAdminPanel';
import UserAdminPanel from './Pages/AdminCRUD/User/UserAdminPanel';
import EditUser from './Pages/AdminCRUD/User/EditUser';

import { AuthContext } from './Pages/AuthContextNew';
import OrderAdminPanel from './Pages/AdminCRUD/Orders/OrderAdminPanel';
import EditOrder from './Pages/AdminCRUD/Orders/EditOrder';
import ProfileOrders from './Pages/ProfileOrders';
import io from 'socket.io-client';
import ReviewAdminPanel from './Pages/AdminCRUD/Reviews/ReviewAdminPanel';
import RequestAdminPanel from './Pages/AdminCRUD/Request/RequestAdminPanel';
import InfoPage from './Pages/InfoPage';

function App() {

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("https://bakalaurasserverrender.onrender.com");
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);






  //-------visual header cart update-------
  const [cartCount, setCartCount] = useState([window.localStorage.getItem("cartVisualCount") ? localStorage.getItem("cartVisualCount") : 0]);
  const cartCountValue = useMemo(
    () => ({ cartCount, setCartCount }), 
    [cartCount]
  );
  //--------------------------------------

  const [user, setUser] = useState([window.localStorage.getItem("userAccount") ? JSON.parse(localStorage.getItem("userAccount")) : {}]);
  const userValue = useMemo(
    () => ({ user, setUser }), 
    [user]
  );

  //----------User data states----------
  const [data, setData] = useState(null)
  const [error, setError] = useState(null);
  //---------------------------------------

  const [currentUser, setCurrentUser] = useState(null)
  const [timeActive, setTimeActive] = useState(false)
  //const navigate = useNavigate()

  const [refresh,setRefresh] = useState(false);

  const [loading, setLoading] = useState(true);




    ////Get current signed in user data
  //-------GET PRODUCT DATA FROM API------------
  useEffect(() => {
    if(currentUser){
        console.log("pries fetch")
        console.log(auth.currentUser.uid);
        //i need realtimedatabase id
        fetch(`https://bakalaurasserverrender.onrender.com/users/${auth.currentUser.uid}`,{
          method: "GET"
        })
        .then(response => response.json())
        .then((usefulData) => {
          //setting fetched data
          setData(usefulData);
          setLoading(false);//stop loading once data is fetched.
          console.log("Cia fetched data:")
          console.log(usefulData);
        })
        .catch((e) => {
          console.error(`An error occurred: ${e}`)
        });

        setRefresh(false);
  }
    
}, [refresh]);
// //------------------------------------------


  
  useEffect(() => {

    
    //-----Account stuff------
    onAuthStateChanged(auth, (user) => {
      //setCurrentUser(user)
      console.log("I WORKED FIRST??")

      if (user) {
        // User logged in already or has just logged in.
        setCurrentUser(user)
        setLoading(false);
        console.log(user.uid);
      } else {
        // User not logged in or has just logged out.
        setLoading(false);
        console.log("elsee")
      }

    })

    setRefresh(false);
  },[refresh])


  //rerouting to login page if user not logged in
  const ProtectedRouteProfile = ({ children }) => {
    
    //Loading padaryt kaip product data 
    // console.log("Protected Route current user:");
    // console.log(currentUser);
    // console.log(auth.currentUser.emailVerified);
    // console.log(auth.currentUser.uid);

    if(currentUser==null){
      alert("User is not logged in");
      console.log("Not logged in")
      return <Navigate to={"/login"}/>
    }
    else if(auth.currentUser.emailVerified==false){
      alert("User email is not verified");
      auth.signOut();
      return <Navigate to={"/login"}/>
    }
    else
    {
      console.log("Signed in successfully")
      console.log(auth.currentUser);

      return children
    }
    
  };


  //protected route for admin panels
  const ProtectedRouteAdmin = ({ children }) => {
    
    //Loading padaryt kaip product data 
    console.log("Protected Route current user:!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
    console.log(currentUser);
    console.log(user[0]);
    console.log(user[0].permissions);
    
    if(currentUser==null || user[0].permissions=="None" ){
      console.log("no perms to access this pagerino")
      alert("No permissions")
      return <Navigate to={"/login"}/>
    }
    else
    {
      console.log("Signed in successfully")
      console.log(auth.currentUser);

      return children
    }
    
  };

  // const ProtectedRouteShopper = ({ children }) => {
    
  //   //Loading padaryt kaip product data 
  //   console.log("Protected Route current user:");
  //   console.log(currentUser);
  //   console.log(auth.currentUser);
    
  //   if(currentUser==null){
  //     console.log("WOWWOWOWOWOWO")
  //     return <Navigate to={"/login"}/>
  //   }
  //   else
  //   {
  //     console.log("Signed in successfully")
  //     console.log(auth.currentUser);

  //     return children
  //   }
    
  // };

  
  return (
    
    <div className="App">
      <Router>
      <AuthContext.Provider value={userValue}>
        <>
        <CartContext.Provider value={cartCountValue} >


        {/* -NAV BAR- */}
        <nav>
          {/* Left navbar items */}
          <div className='ArtistNav' >
            <Link to="shop">Artist</Link>
          </div>

          {/* Center navbar items */}
          <div>
            
            <div className='ArtistNav' >
            <Link to="shop">Shop</Link>
            <Link to="request">Custom request</Link>
            <Link to="infopage">Info</Link>
            </div>
            {/* ALL ADMIN PANEL Link GO HERE */}
            <div>
            <AdminPanelNav/>
            </div>
          
          </div>

          {/* Right navbar items */}
          <div className='ArtistNav' >
            <div >
              
            </div>
            <div>
              <Cert/>
              <ProfileNew/>
            </div>
          </div>  
          
        </nav>






        <Routes>
          

          <Route path="request" element={<Request />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="productdetails/:id" element={<Product socket={socket}/>} />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />
          <Route path="verifyemail" element={<VerifyEmail/>} />
          <Route path="forgotpassword" element={<ForgotPassword/>} />
          <Route path="changepassword" element={<ChangePassword/>} />
          <Route path="infopage" element={<InfoPage/>} />
          <Route path="/" element={<Home/>} />


          

       
          
          
          
          {/* ------------------------PROTECTED ADMIN PANELS-------------- */}

          {/* ---------Product admin--------- */}
          <Route 
            path="productadminpanel"
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              <ProtectedRouteAdmin>  
                <ProductAdminPanel/>
              </ProtectedRouteAdmin>
            )} 
          />
          <Route 
            path="createproduct"
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              <ProtectedRouteAdmin>  
                <CreateProduct/>
              </ProtectedRouteAdmin>
            )} 
          />
          <Route 
            path="editproduct/:id"
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              <ProtectedRouteAdmin>  
                <EditProduct/>
              </ProtectedRouteAdmin>
            )} 
          />
          
   
          {/* ---------Order admin--------- */}
          <Route 
            path="orderadminpanel"
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              <ProtectedRouteAdmin>  
                <OrderAdminPanel/>
              </ProtectedRouteAdmin>
            )} 
          />
          <Route 
            path="editorder/:id"
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              <ProtectedRouteAdmin>  
                <EditOrder/>
              </ProtectedRouteAdmin>
            )} 
          />



         
          {/* ---------Review admin--------- */}
          <Route 
            path="reviewadminpanel"
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              <ProtectedRouteAdmin>  
                <ReviewAdminPanel/>
              </ProtectedRouteAdmin>
            )} 
          />

          
          {/* ---------Request admin--------- */}
          <Route 
            path="requestadminpanel"
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              <ProtectedRouteAdmin>  
                <RequestAdminPanel/>
              </ProtectedRouteAdmin>
            )} 
          />


          {/* ---------User admin--------- */}
          <Route 
            path="useradminpanel"
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              <ProtectedRouteAdmin>  
                <UserAdminPanel/>
              </ProtectedRouteAdmin>
            )} 
          />
          <Route 
            path="edituser/:id"
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              <ProtectedRouteAdmin>  
                <EditUser/>
              </ProtectedRouteAdmin>
            )} 
          />



          {/* ------------------------------------------End of protected admin-------------- */}
          

          <Route 
            path="profile" 
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              
              <ProtectedRouteProfile>  
                <Profile/>
              </ProtectedRouteProfile>
              
            )} 
          />
          
          <Route 
            path="checkout" 
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              
              <ProtectedRouteProfile>  
                <Checkout/>
              </ProtectedRouteProfile>
              
            )} 
          />

          
          {/* <Route path="profile" element={<Profile/>} /> */}

          

          <Route 
            path="profile" 
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              
              <ProtectedRouteProfile>  
                <Profile/>
              </ProtectedRouteProfile>
              
            )} 
          />
          <Route 
            path="profileorders" 
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              
              <ProtectedRouteProfile>  
                <ProfileOrders/>
              </ProtectedRouteProfile>
              
            )} 
          />


        </Routes>
        </CartContext.Provider>
        </>
        </AuthContext.Provider>
     </Router>



      {/* <footer className='footerbar'>
        Footer
      </footer> */}
    </div>
  );
}

export default App;
