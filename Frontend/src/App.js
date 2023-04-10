import './App.css';
import {BrowserRouter as Router, Link, Routes, Route, useNavigate, Navigate} from 'react-router-dom'
import Home from './Pages/Home';
import SongRequest from './Pages/SongRequest';
import Shop from './Pages/Shop';
import ProductsList from './Pages/ProductList';
import Cart from './Pages/Cart';
import Product from './Details/Product';
import Login from './Pages/Login';
import { createContext, useEffect, useState } from "react";
import { auth } from './firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './Pages/AuthContext';
import Register from './Pages/Register';
import VerifyEmail from './Pages/VerifyEmail';
import Profile from './Pages/Profile';
import { async } from '@firebase/util';
import ForgotPassword from './Pages/ForgotPassword';
import ChangePassword from './Pages/ChangePassword';

import FunctionContextComponent from './FunctionContextComponent';
import Checkout from './Pages/Checkout';
export const ThemeContext = createContext();
function App() {

  //pls work
  const [darkTheme, setDarkTheme] = useState(true);
  function toggleTheme(){
    setDarkTheme(prevDarkTheme=>!prevDarkTheme);
  }

  ////////

  //----------PRODUCT data states----------
  const [cart, setCart] = useState([window.localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []]);

  //for cart count
  const [totalCart,setTotalCart] = useState();
  //----------------------------------------

  const [currentUser, setCurrentUser] = useState(null)
  const [timeActive, setTimeActive] = useState(false)
  //const navigate = useNavigate()

  const [refresh,setRefresh] = useState(false);

  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    if(window.localStorage.getItem("cart")){
      setCart(JSON.parse(window.localStorage.getItem("cart")));
    }//this if may cause issues. idk idk
    
    //---------Calculate total cart count---------- //or make a global variable xd
    console.log("Calculating Subtotal")
    const tempArray = JSON.parse(window.localStorage.getItem("cart"))[0];
    var tempCountTotal = 0;

    tempArray.forEach((value) =>{            
      var tempAmount = (Object(value)['amount']);
      console.log("Amount: "+ tempAmount);
      //convert to number

      tempCountTotal=tempAmount+tempCountTotal;

    })
    setTotalCart(tempCountTotal);

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
  const ProtectedRoute = ({ children }) => {
    
    //Loading padaryt kaip product data 

    if(currentUser==null){
      return <Navigate to={"/login"}/>
    }
    else
    {
      console.log("Signed in successfully")
      console.log(auth.currentUser);

      return children
    }
    
  };

  
  return (
    
    <div className="App">
      <Router>
        <AuthProvider value={{currentUser,timeActive,setTimeActive}}>
        <nav>
          {/* Left */}
          <div>
          <Link to="/">Melonter</Link>
          </div>
          {/* Center */}
          <div>
            <Link to="songs">Songs</Link>
            <Link to="shop">Shop</Link>
            <Link to="songrequest">Song Request</Link>
            <Link to="productslist">Product list</Link>
          </div>

          {/* Right */}
          <div>
            <Link to="cart">Cart count: {totalCart}  </Link>
            {/* Theme context */}

            <ThemeContext.Provider value={darkTheme} >
            <button onClick={toggleTheme}>Toggle</button>
            <FunctionContextComponent/>
            </ThemeContext.Provider>

            {/* <Link to="login">Login</Link> */}
            <Link to="profile">Profile</Link>
          </div>
          
        </nav>
        
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="songrequest" element={<SongRequest />} />
          <Route path="shop" element={<Shop />} />
          <Route path="productslist" element={<ProductsList />} />
          <Route path="cart" element={<Cart />} />
          <Route path="productDetails/:id" element={<Product/>} />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />
          <Route path="verifyemail" element={<VerifyEmail/>} />
          <Route path="forgotpassword" element={<ForgotPassword/>} />
          <Route path="changepassword" element={<ChangePassword/>} />
          <Route path="checkout" element={<Checkout/>} />
          
          {/* <Route path="profile" element={<Profile/>} /> */}

          

          <Route 
            path="profile" 
            element={
              loading ?(
                // <p>Loading...</p>
                <div>Loading...</div>
            ) : (
              
              <ProtectedRoute>  
                <Profile/>
              </ProtectedRoute>
              
            )} 
          />


        </Routes>
        </AuthProvider>
     </Router>



      <footer className='footerbar'>
        Footer
      </footer>
    </div>
  );
}

export default App;
