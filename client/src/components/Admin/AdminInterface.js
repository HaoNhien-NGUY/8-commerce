import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, 
    Link
  } from "react-router-dom";
import axios from 'axios';
import './AdminInterface.css';

const AdminInterface = () => {

    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        axios.get("http://localhost:8000/api/product")
        .then(res => {
                setProducts(res.data);    
        })
        .catch(error => {
          console.log(error.response)
        });
    }, [])
    console.log(products.map((product)=> product.id));

    const deleteProduct = (id) => {
        console.log(id);
        axios.delete("http://localhost:8000/api/product/"+id)
        .then(res => {
            axios.get("http://localhost:8000/api/product")
                .then(res => {
                setProducts(res.data);
                 })
                .catch(error => {
                    console.log(error.response)
                 });
            alert(res.data.message); 
        })
        .catch(error => {
          console.log(error.response)
        });
    }

    const redirectCreate = () => {
        window.location.href='/admin/create';
    }

    return(
        <div className="container">
            <h1 className="mb-5">
              <img src="https://img.icons8.com/windows/32/000000/speedometer.png"/> ADMIN - Dashboard
            </h1>
            <div className="row justify-content-end mb-2">
              <h3 className="mr-auto ml-2">All Products</h3>

                <div className="divBtnCategory">
                    <button onClick={() => window.location.href='/admin/createCategory'} className="btn btn-dark mr-3">+ New Category</button>
                    <button onClick={() => window.location.href='/admin/createSubCategory'} className="btn btn-dark">+ New SubCategory</button>
                </div>

              <button onClick={redirectCreate} className="btn btn-dark">
                + New Product
              </button>
            </div>
            <div className="row border p-2">
            <table>
                <thead>
                    <tr>
                        <th><p className="m-2 align-items-center"> ID </p></th>
                        <th><p className="m-2"> Title </p></th>
                        <th><p className="m-2"> Price </p></th>
                        <th><p className="m-2"> Sex </p></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => 
                    <tr key={product.id}>
                        <td><p className="m-2 align-items-center">{product.id}</p></td>
                        <td><p className="m-2">{product.title}</p></td>
                        <td><p className="m-2">{product.price} €</p></td>
                        <td><p className="m-2">{product.sex}</p></td>
                        <td> <button onClick={() => window.location.href='admin/update/'+product.id}className="btn btn-outline-info m-2">Modify</button></td>
                        <td> <button onClick={() => deleteProduct(product.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                    </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
        
    )
}

export default AdminInterface;