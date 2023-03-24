import './App.css';
import {BrowserRouter as Router, Link, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home';
import SongRequest from './Pages/SongRequest';
import Shop from './Pages/Shop';
import ProductsList from './Pages/ProductList';
import Cart from './Pages/Cart';
import Product from './Details/Product';
import Login from './Pages/Login';



function App() {
  return (
    
    <div className="App">
      <Router>
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
            <Link to="login">Login</Link>
            <Link to="register">Register</Link>
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


        </Routes>
     </Router>



      <footer className='footerbar'>
        Footer
      </footer>
    </div>
  );
}

export default App;
