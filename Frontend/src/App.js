import './App.css';
import {BrowserRouter as Router, Link, Routes, Route, useNavigate, Navigate} from 'react-router-dom'
import Home from './Pages/Home';
import SongRequest from './Pages/SongRequest';
import Shop from './Pages/Shop';
import ProductsList from './Pages/ProductList';
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
import CreateUser from './Pages/AdminCRUD/User/CreateUser';
import { AuthContext } from './Pages/AuthContextNew';
import OrderAdminPanel from './Pages/AdminCRUD/Orders/OrderAdminPanel';
import EditOrder from './Pages/AdminCRUD/Orders/EditOrder';
import ProfileOrders from './Pages/ProfileOrders';
import io from 'socket.io-client';
import ReviewAdminPanel from './Pages/AdminCRUD/Reviews/ReviewAdminPanel';

function App() {

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("www.localhost:3001/");
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
        fetch(`http://localhost:3001/users/${auth.currentUser.uid}`,{
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
      alert("User is not logged");
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
    console.log("Protected Route current user:");
    console.log(currentUser);
    console.log(auth.currentUser);
    
    if(currentUser==null ){
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

        <nav>
          {/* Left */}
          <div>
          <Link to="/">Melonter</Link>
          </div>
          {/* Center */}
          <div>
            {/* <Link to="songs">Songs</Link> */}
            <Link to="shop">Shop</Link>
            <Link to="songrequest">Song Request</Link>

            {/* ALL ADMIN PANEL Link GO HERE */}
            <AdminPanelNav/>
          
          </div>

          {/* Right */}
          <div>
            <Cert/>


            {/* <Link to="login">Login</Link> */}
            <ProfileNew/>
          </div>
          
        </nav>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="songrequest" element={<SongRequest />} />
          <Route path="shop" element={<Shop />} />
          <Route path="productslist" element={<ProductsList />} />
          <Route path="cart" element={<Cart />} />
          <Route path="productdetails/:id" element={<Product socket={socket}/>} />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />
          <Route path="verifyemail" element={<VerifyEmail/>} />
          <Route path="forgotpassword" element={<ForgotPassword/>} />
          <Route path="changepassword" element={<ChangePassword/>} />
          {/* <Route path="checkout" element={<Checkout/>} /> */}

          {/* Product admin */}
          {/* <Route path="productadminpanel" element={<ProductAdminPanel/>} /> */}
          <Route path="createproduct" element={<CreateProduct/>} />
          <Route path="editproduct/:id" element={<EditProduct/>} />

          {/* User admin */}
          <Route path="useradminpanel" element={<UserAdminPanel/>} />
          <Route path="edituser/:id" element={<EditUser/>} />
          {/* <Route path="createuser" element={<CreateUser/>} /> */}

          {/* Order admin */}
          <Route path="orderadminpanel" element={<OrderAdminPanel/>} />
          
          <Route path="editorder/:id" element={<EditOrder/>} />
          
          {/* Review admin panel */}
          <Route path="reviewadminpanel" element={<ReviewAdminPanel/>}/>
          

          {/* Protected route product admin panel */}
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

          {/* Protected route product admin panel */}
          <Route 
            path="productadminpanel"
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



      <footer className='footerbar'>
        Footer
      </footer>
    </div>
  );
}

export default App;
