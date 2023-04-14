import { firebaseDatabase } from "../firebase_config"
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"

const initialState={
    name:"",
    email:"",
}


const AdminPanel = () => {

    const [name, setName] = useState('')

    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        
        fetch(`http://localhost:3001/products`,{
            method: "GET"
        })
          .then(response => response.json())
          .then((usefulData) => {
            //console.log(usefulData);
            setLoading(false);
            setData(usefulData);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });
        
    }, []);
    // //------------------------------------------

    const handleSubmit = (event) => {



    };
    console.log("Something");

    return(
        <div style={{ color: 'white'}}>

            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
            <button>Add new product</button><br></br><br></br>
            <table>
                    <thead>
                      <tr>
                        <th>Firebase uid</th>
                        <th>Product id</th>
                        <th>Product type</th>
                        <th>Product name</th>
                        <th>Price</th>
                        <th>Description</th>
                        {/* <th>image</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {data && 
                        data.map((product) => (
                          <tr key={product.id}>
                            <td>{product.uid}</td>
                            <td>{product.id}</td>
                            <td>{ }</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.desc}</td>

                            {/* on edit, open Single product, with screen to edit it? */}
                            <button>Edit</button> 
                            <button>Delete</button>
                            {/* <td>{product.image}</td> */}
                          </tr>
                        ))}
                    </tbody>
            </table>
            </>
            )}










            <h1>Add edit</h1>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input 
                    type='name' 
                    value={name}
                    required
                    placeholder="Enter your name"
                    onChange={e => setName(e.target.value)}
                />

                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default AdminPanel;