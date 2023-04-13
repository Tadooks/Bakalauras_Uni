import { createContext } from "react";

//Visual cart count global value
export const CartContext = createContext({
  cartCount: 0,
  setCartCount : () => {},
});
