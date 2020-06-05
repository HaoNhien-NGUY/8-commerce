import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import './CreateSubProduct.css';
function CreateSubProduct() {
    const [isReady, setIsReady] = useState(false);
    const [price, setPrice] = useState(1);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [weight, setWeight] = useState(1);
    const [promo, setPromo] = useState(0);
    const [stock, setStock] = useState(0);
    const [titleProduct, setTitleProduct] = useState('');
    const lauch = (e) =>{
        e.preventDefault()
        setIsReady(true);
    }
    let id = useRouteMatch("/admin/subproduct/:id/create").params.id;
    console.log(id)

    useEffect(() => {
        axios.get("http://localhost:8000/api/product/"+id)
        .then(res => {
                setTitleProduct(res.data.title)
        })
        .catch(error => {
          console.log(error.response)
        });
    }, [])

    useEffect(() => {
        if (isReady) {
        
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            setIsReady(false)
            const body = {
                "product_id": id,
                "price": parseInt(price),
                "color": color,
                "size": size,
                "weight": parseInt(weight),
                "promo": parseInt(promo),
                "stock": parseInt(stock)
            }
            console.log(body);
            axios.post("http://127.0.0.1:8000/api/subproduct", body, config ).then( e => {
                toast.success('Product correctly added!', { position: "top-center"})
            }).catch( err => {
                console.log(err)
            });
        }
    }, [isReady]);
    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Create a new Subproduct for <b>{titleProduct}</b> !</h1>
            <button onClick={() => window.location.href='/admin'} className='float-right btn-warning'> Back to dashboard </button>
            <button onClick={() => window.location.href='/admin/subproduct/'+id} className='float-right btn-info'> Back to the Subproduct </button>
            <form id="formItem">
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input className="inputeStyle form-control" type="number" name="price" placeholder="ex: 123" onChange={(e) => setPrice(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="color">Color</label>
                    <input className="inputeStyle form-control" type="text" name="color" placeholder="Color article" onChange={(e) => setColor(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="size">Size</label>
                    <input className="inputeStyle form-control" type="text" name="size" placeholder="Size article" onChange={(e) => setSize(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="weight">Weight</label>
                    <input className="inputeStyle form-control" type="number" name="weight" placeholder="ex: 3" onChange={(e) => setWeight(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Promo</label>
                    <input className="inputeStyle form-control" type="number" name="promo" min="0" max="100" placeholder="0 - 100" onChange={(e) => setPromo(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="stock">stock</label>
                    <input className="inputeStyle form-control" type="number" name="stock" placeholder="ex: 500" onChange={(e) => setStock(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-dark" onClick={(e) => lauch(e)}>Submit</button>
            </form>
        </div>
    )
}

export default CreateSubProduct;