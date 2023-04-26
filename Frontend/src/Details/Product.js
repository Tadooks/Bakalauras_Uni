import {React, useState, useEffect } from "react";
import {  useParams,Link } from 'react-router-dom';

// import Rating from '@mui/material/Rating';
import { Rating } from "@mui/material";

import { auth } from "../firebase_config";

const Product = ({socket}) => {
    



    let { id } = useParams();//getting id from url

    const [inputs, setInputs] = useState({});

	  const handleChange = (event) => {
        console.log(event.target)
        if(event.target.name == "rating"){
            const name = event.target.name;
            const value = Number(event.target.value);
            setInputs(values => ({...values, [name]: value}))
        }else{
            const name = event.target.name;
            const value = event.target.value;
            setInputs(values => ({...values, [name]: value}))
        }
	  }
	
	  const handleSubmit = (event) => {
		event.preventDefault();
		console.log(inputs);
		if(inputs.name && inputs.review && inputs.rating){
			socket.emit('add_review',{
				productID: id,
				name: inputs.name,
				rating: inputs.rating,
				review: inputs.review,
                authid: auth.currentUser.uid,

			});
		}

	  }		

	const [list, setList] = useState(
		{
            rating: 0,
            listOfReviews: []
		}
	);

    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    
    

    const [dataID, setDataID] = useState();
    
    //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        fetch(`http://localhost:3001/products/` + id)
          .then(response => response.json())
          .then((usefulData) => {
            setLoading(false);
            setData(usefulData);
            setDataID(id);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });
    }, [id]);




    useEffect(() => {
		if( !socket) return;//fix crash on page refresh
		const allReviews = (message) => {
			let realRating = 0;
            let hasComment = false;
			message.forEach((el)=>{
				realRating += Number(el.rating);
                if(auth.currentUser != null && el.authid == auth.currentUser.uid){
                    hasComment = true;
                }
			})

            // SET STATE TO TRUE. TO NOT SHOW COMMENT FIELD !
            //hide form here


			setList({
				rating: realRating,
				listOfReviews: message
				});
		};

		const addedNewReview = (message) => {
			//Decending
			//setArray(oldArray => [...oldArray, message]);
			//Assending
			if(message.productID == id){
				setList((oldArray) =>{
					const newList = [message,...oldArray.listOfReviews];
					let realRating = 0;
					newList.forEach((el)=>{
						realRating += Number(el.rating);
					});
					return {rating: realRating , listOfReviews: newList}
				});
			}
		};

		socket.on('get_all_reviews_react', allReviews);
		socket.on('added_review', addedNewReview);

        if(auth.currentUser != null){
		    socket.emit('get_all_reviews',{"productID": id, "authid": auth.currentUser.uid});
        }
		else {
            socket.emit('get_all_reviews',{"productID": id, "authid": "None"});
        }

		return () => {
		  socket.off('get_all_reviews_react', allReviews);
		  socket.off('added_review', addedNewReview);
		};
	}, [socket]);




    
    
    return(
        <div style={{ color: 'white'}}>
        {loading ?(
            <p>Loading...</p>
        ) : error ? (
            <p>An error occured</p>
        ):(
        <>
            <div> Cia bus id: {dataID}
            <Link to={`/shop`} >
                <button>BACK</button>
            </Link>
            <div>Product name: {data.name}</div>
            <div>Product image: {data.image}</div>
            <div>Product description: {data.desc}</div>
            <div>Product price: {data.price} europiniu moneys</div>
            
            {/* <div>Amount: + 0 - </div>
            <button>Add to cart</button> */}
            </div>
<div>


            <br/>
		<h3>Leave some feedback!</h3>

		<form onSubmit={handleSubmit}>
		<Rating
			name="rating"
			value={inputs.rating || 5}
			onChange={handleChange}
      	/>
      <p>
		<label >&nbsp;Enter your name: &nbsp;
		<input 
			maxlength="20" 
			className="textboxName"
			type="text" 
			name="name" 
			value={inputs.name || ""} 
			onChange={handleChange}
		/>
		</label>
	  </p>
		<textarea
		  maxlength="100" 
		  className="textboxclass" 
		  id="review" 
		  name="review" rows="4" cols="50"
		  value={inputs.review || ""} 
		  onChange={handleChange}>
				Your review goes here
			</textarea>
		<p>
        <input className="button2 button1" type="submit" value="Post review"/>
		</p>
    	</form>

		<h3>Reviews:</h3>
		<div>Average user rating: &nbsp;
		{  
			Number.parseFloat(list.rating/list.listOfReviews.length).toFixed(2)
		}
		</div>
		Number of reviews: &nbsp;
		{  
			list.listOfReviews.length
		}

    <ul>
	{  
			list.listOfReviews.map((review) =>
				<li key={review.id}>
					<div>
						<b>Name: </b> {review.name}
						
					</div>
					<div>
						{/* <b>Rating:</b> {review.rating} */}
						<p>
							<Rating className='ReviewRating'
							name="rating"
							value={review.rating}
							onChange={handleChange}
							/>
						</p>
							
						<p></p>
					</div>
					<li>
						<div>
							<b> </b> {review.review}
						</div>
					</li>
				</li>
				)

            }
	</ul>


	</div>















        </>
        )}
        </div>
    );
};

export default Product;
