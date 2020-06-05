import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, 
    Link
  } from "react-router-dom";
import axios from 'axios';
import './SubProductInterface.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";

const SubProductInterface = () => {

    const [subProducts, setSubProducts] = useState([]);
    const [titleProduct, setTitleProduct] = useState('');
    let id = useRouteMatch("/admin/subproduct/:id").params.id;
    console.log(id)
    useEffect(() => {
        axios.get("http://localhost:8000/api/product/"+id)
        .then(res => {
                setTitleProduct(res.data.title)
                console.log(res.data.subproducts)
                setSubProducts(res.data.subproducts);    
        })
        .catch(error => {
          toast.error('Error !', {position: 'top-center'});
        });
    }, [])
    console.log(subProducts);

    const deleteProduct = (idSub) => {
        console.log(idSub);
        axios.delete("http://localhost:8000/api/subproduct/"+idSub)
        .then(res => {
            axios.get("http://localhost:8000/api/product/"+id)
                .then(res => {
                setSubProducts(res.data.subproducts);
                 })
                .catch(error => {
                    toast.error('Error !', {position: 'top-center'});
                 });
            toast.success(res.data.message, {position: "top-center"}); 
        })
        .catch(error => {
          toast.error('Error !', {position: 'top-center'});
        });
    }

    const redirectCreate = () => {
        window.location.href='/admin/subproduct/'+id+'/create';
    }

    return(
        <div className="container">
            <ToastContainer />
            <h1 className="mb-5">
              <img src="https://img.icons8.com/windows/32/000000/speedometer.png"/> ADMIN - Dashboard
            </h1>
            <div className="row justify-content-end mb-2">
              <h3 className="mr-auto ml-2">All Subproducts of <b>{titleProduct}</b></h3>
              <button onClick={() => window.location.href='/admin/update/'+id} className='btn btn-outline-info m-2'> modify the product </button>
              <button onClick={() => window.location.href='/admin'} className='float-right btn m-2 btn-warning'> Back to dashboard </button>
              <button onClick={redirectCreate} className="btn btn-dark">
                + New Subproduct for <b>{titleProduct}</b>
              </button>
            </div>
            <div className="row border p-2">
            <table>
                <thead>
                    <tr>
                        <th><p className="m-2 align-items-center"> ID </p></th>
                        <th><p className="m-2"> Price </p></th>
                        <th><p className="m-2"> Color </p></th>
                        <th><p className="m-2"> Size </p></th>
                        <th><p className="m-2"> Weight </p></th>
                    </tr>
                </thead>
                <tbody>
                    
                    {subProducts.length > 0 ? subProducts.map((subproduct) => 
                    <tr key={subproduct.id}>
                        {console.log(subproduct)}
                        <td><p className="m-2 align-items-center">{subproduct.id}</p></td>
                        <td><p className="m-2">{subproduct.price} €</p></td>
                        <td><p className="m-2">{subproduct.color}</p></td>
                        <td><p className="m-2">{subproduct.size}</p></td>
                        <td><p className="m-2">{subproduct.weight}</p></td>
                        <td> <button onClick={() => window.location.href='/admin/subproduct/'+id+'/'+subproduct.id+'/update'}className="btn btn-outline-info m-2">Modify</button></td>
                        <td> <button onClick={() => deleteProduct(subproduct.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                    </tr>
                    ) : null}
                </tbody>
            </table>
            </div>
        </div>
        
    )
}

export default SubProductInterface;