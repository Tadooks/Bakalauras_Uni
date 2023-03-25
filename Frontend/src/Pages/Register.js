
// import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut } from 'firebase/auth';
// import { useEffect, useState } from "react";
// import { auth } from '../firebase_config';


// const Register = () => {

//   const [registerEmail, setRegisterEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");

//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");

//   const [user, setUser] = useState({});



//   const register = async () => {
//     try {
//       const user = await createUserWithEmailAndPassword(
//         auth,
//         registerEmail,
//         registerPassword
//       );
//       console.log(user);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };



//   const login = async () => {
//     try {
//       const user = await signInWithEmailAndPassword(
//         auth,
//         loginEmail,
//         loginPassword
//       );
//       console.log(user);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };



//   const logout = async () => {
//     await signOut(auth);
//   };
  

//   return (
//     <div style={{ color: 'white'}}>


//     {/* Register */}
//     <div>

//         <h3> Register User </h3>


//         <label>Email:</label> &nbsp; <br></br>
//         <input
//           placeholder="Your email"
//           onChange={(event) => {
//             setRegisterEmail(event.target.value);
//           }}
//         />

//         <br></br><br></br>

//         <label>Password:</label> &nbsp; <br></br>
//         <input
//           placeholder="Your password"
//           onChange={(event) => {
//             setRegisterPassword(event.target.value);
//           }}
//         />

//         <button onClick={register}> Create User</button>
//       </div>

//       {/* Login */}
//       <div>
        
//         <h3> Login </h3>

//         <label>Email:</label> &nbsp; <br></br>
//         <input
//           placeholder="Your email"
//           onChange={(event) => {
//             setLoginEmail(event.target.value);
//           }}
//         />

//         <br></br><br></br>
        
//         <label>Password:</label> &nbsp; <br></br>
//         <input
//           placeholder="Your password"
//           onChange={(event) => {
//             setLoginPassword(event.target.value);
//           }}
//         />
//         <button onClick={login}> Login</button>
//       </div>

//       <h4> User Logged In: </h4>
//       {user?.email}

//       <button onClick={logout}> Sign Out </button>
        

//     </div>
// )
// }
  
// export default Login


//       {/* <div className=''>
//         <h1>Login</h1>
//         <form onSubmit={""}>
//                     <label>Email:</label> &nbsp;
//                     <br></br>
//                     <input type='text' name="name" className='textboxName'/>
//                     <br></br>
//                     <label>Password:</label> &nbsp; 
//                     <br></br>
//                     <input type='text' name="name" className='textboxName'/>
//                     <br></br>
//                     <button>Login</button>
//         </form>

//       </div> */}