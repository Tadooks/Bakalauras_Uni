
// ????Search????
//             <table>
//                     <thead>
//                       <tr>
//                         <th>Firebase uid</th>
//                         <th>Product name</th>

//                         <th>Price</th>
//                         <th>Description</th>
//                         <th>Product type</th>
//                         <th>Image</th>
//                         <th>Audio</th>
                        
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {console.log(data)}
//                       {data && 
//                         data?.map((product) => (
                          
//                           <tr>
//                             <td>{product.uid}</td>
//                             <td>{product.name}</td>

//                             <td>{product.price} €</td>
//                             <td>{product.desc}</td>
//                             <td>{product.type}</td>
//                             <td><a href={product.image}>{product.image}</a></td>
//                             <td>
//                               <ReactPlayer
//                                 url={product.audio}
//                                 width="100%"
//                                 height="50px"
//                                 playing={false}
//                                 controls={true}
//                               />
//                             </td>
//                             {/* on edit, open Single product, with screen to edit it? */}
//                             {/* Add the open single product  */}

//                             <Link to={`/editproduct/${product.uid}`}>
//                                 <button>Edit</button>
//                             </Link>
//                             {/* <button onClick={()=>OpenEditDialogWindow(product)}>Edit</button>  */}
//                             <button onClick={()=>handleDeleteProduct(product)}>Delete</button>

//                             {/* <td>{product.image}</td> */}
//                           </tr>
//                         ))}
//                     </tbody>
//             </table>