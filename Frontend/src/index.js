import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


//will autoconfig redux dev tools. Lets you check whats in state.
// const store = configureStore({
//   reducer: {
//     products: productsReducer,
//   },
// });

// //starts the product fetch function from productSlice.js
// store.dispatch(productsFetch());


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();