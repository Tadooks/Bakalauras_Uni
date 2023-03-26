import './App.css';
import {BrowserRouter as Router, Link, Routes, Route, useNavigate, Navigate} from 'react-router-dom'
import Home from './Pages/Home';
import SongRequest from './Pages/SongRequest';
import Shop from './Pages/Shop';
import ProductsList from './Pages/ProductList';
import Cart from './Pages/Cart';
import Product from './Details/Product';
import Login from './Pages/Login';
import { useEffect, useState } from "react";
import { auth } from './firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './Pages/AuthContext';
import Register from './Pages/Register';
import VerifyEmail from './Pages/VerifyEmail';
import Profile from './Pages/Profile';



//Need to fix flashing
function App() {

  const [currentUser, setCurrentUser] = useState(null)
  const [timeActive, setTimeActive] = useState(false)
  //const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])


  //rerouting to login page if user not logged in
  const ProtectedRoute = ({ children }) => {
    if (currentUser==null) {
      return <Navigate to={"/login"}/>
    }
    else
    {
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
            <Link to="cart">Cart</Link>
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
          {/* <Route path="profile" element={<Profile/>} /> */}
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
              
            } />


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
