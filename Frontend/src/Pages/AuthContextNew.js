import { createContext } from "react";

//Visual cart count global value
export const AuthContext = createContext({
  user: [{}],
  setUser : () => {},
});