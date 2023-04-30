import { useContext } from 'react';
import { CartContext } from './CartContext';
import {Link} from 'react-router-dom'


export default function Cert() {
    const { cartCount } = useContext(CartContext);
    return <Link to="cart">Cart: {cartCount}  </Link>;
  }