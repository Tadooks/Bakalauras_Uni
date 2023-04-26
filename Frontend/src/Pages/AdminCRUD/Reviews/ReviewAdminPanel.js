import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"



import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";

import {auth} from '../../../firebase_config'

//https://www.npmjs.com/package/react-player
import ReactPlayer from "react-player";

const ReviewAdminPanel = () => {


    //---------- data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);

    ///------------part of get
    function getCurrentUser(auth) {
      return new Promise((resolve, reject) => {
         const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
         }, reject);
      });
    }

    //Putting this here so we could use async in useEffect (and avoid refresh crash)
    //Reason for this is that getCurrentUser function (Above) cant be executed without useEffect being called first.
    //Header auth.current.User.uid was getting called to slow
    const tes= async ()=>{
      await getCurrentUser(auth);
        
      fetch(`http://localhost:3001/review`,{
          method: "GET",
            headers: {
            'Content-Type': 'application/json',
            'user': auth.currentUser.uid
          },
        })
        .then(response => response.json())
        .then((usefulData) => {
          setData(usefulData);
          console.log("DIS IS UZSEFUL ZDATA");
          console.log(usefulData);
          setLoading(false);
        })
        .catch((e) => {
          console.error(`An error occurred: ${e}`)
        });
        setRefresh(false);//needed for value refresh after clicking delete.
  }
    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {

        tes();
    }, [refresh]);
    // //------------------------------------------



    
    const handleDeleteReview=(tempReview)=>{
        console.log("handleDeleteReview was clicked!");
        console.log(tempReview);
        const combineForDelete={productID: tempReview.productID,reviewID:tempReview.reviewID}
        console.log(combineForDelete);
        if(window.confirm("Are you sure you want to delete " + tempReview + " ?")){
            
            fetch(`http://localhost:3001/review/${combineForDelete}`,{
              method: "DELETE",
              headers: {
                'Content-Type': 'application/json',
                'user': auth.currentUser.uid
              },
              body: JSON.stringify(combineForDelete)
            })
            .then(response => response.json())
            .then((usefulData) => {
                //console.log(usefulData);
                setLoading(false);
                setData(usefulData);
            })
            .catch((e) => {
                setRefresh(true);
                console.error(`An error occurred: ${e}`)
            });      
        }
        setRefresh(true);
        
        return;
    }



    return(
        <div style={{ color: 'white'}}>

            
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
            

            ????Search????
            <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>productID</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>ReviewID</th>
                        <th>Visable</th>

                      </tr>
                    </thead>
                    <tbody>

                    {Object.keys(data).map((productId) => (
                    Object.keys(data[productId]).map((tempreviewId) => (
                    <tr key={data[productId][tempreviewId].reviewID}>
                      <td>{data[productId][tempreviewId].name}</td>
                      <td>{data[productId][tempreviewId].productID}</td>
                      <td>{data[productId][tempreviewId].rating}</td>
                      <td>{data[productId][tempreviewId].review}</td>
                      <td>{data[productId][tempreviewId].reviewID}</td>
                      <td>{data[productId][tempreviewId].visable.toString()}</td>

                      <button onClick={()=>handleDeleteReview(data[productId][tempreviewId])}>Delete</button>

                    </tr>
                      ))
                    ))}
                    </tbody>
            </table>
            </>
            )}
        </div>
    )
}

export default ReviewAdminPanel;

// {data && 
//   data?.map((review) => (
//     <tr key={review.name}>
//       <td>{review.uid}</td>
//       <td>{review.productID}</td>
//       <td>{review.rating}</td>
//       <td>{review.review}</td>
//       <td>{review.reviewID}</td>
//       <td>{review.visable}</td>

//       {/* <button onClick={()=>OpenEditDialogWindow(review)}>Edit</button>  */}
//       <button onClick={()=>handleDeleteReview(review)}>Delete</button>

//       {/* <td>{review.image}</td> */}
//     </tr>
//   ))
// }