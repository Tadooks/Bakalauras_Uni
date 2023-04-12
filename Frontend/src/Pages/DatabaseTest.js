import { firebaseDatabase } from "../firebase_config"
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"

const initialState={
    name:"",
    email:"",
}


const DatabaseTest = () => {

    const [name, setName] = useState('')

    // const {name,email,contact} = info;

    const handleSubmit = (event) => {



    };
    console.log("Something");

    return(
        <div>
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

export default DatabaseTest;