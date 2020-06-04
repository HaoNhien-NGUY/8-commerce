import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import './UpdateProduct.css';
import axios from 'axios';
import { useRouteMatch } from "react-router-dom";

const UpdateProduct = () => {
    let idProduct = useRouteMatch("/admin/update/:id").params.id;
    console.log(idProduct)
    const [btnSex, setBtnSex] = useState('');
    const [formControl, setFormControl] = useState({});
    const [isReady, setIsReady] = useState(false);
    const [product, setProduct] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(1);
    const [promo, setPromo] = useState(0);
    const [category, setCategory] = useState(1);
    const [sex, setSex] = useState('');

    function formSubmit(e) {
        e.preventDefault();

        setIsReady(true);
    }
    useEffect(() => {
        axios.get("http://localhost:8000/api/product/"+idProduct)
        .then(res => {
            console.log(res.data);
                setProduct(res.data);   
                setTitle(res.data.title);
                setDescription(res.data.description);
                setPrice(res.data.price);
                if (res.data.promo === null) setPromo(0);
                else setPromo(res.data.promo);
                setCategory(res.data.category)
                setSex(res.data.sex)
        })
        .catch(error => {
          console.log(error.response)
        });
    }, [])
    useEffect( () => {
        if (isReady) {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const body = {
                "title": title,
                "description": description,
                "category": category.id,
                "price": parseInt(price),
                "promo": parseInt(promo),
                "sex": sex
            }
            console.log(body);
            axios.put("http://localhost:8000/api/product/"+idProduct, body, config ).then( e => {
                alert('Product correctly updated!')
                setIsReady(false);
            }).catch( err => {
                console.log(err)
            });
        }
    }, [isReady]);
    return (
        <div className='container'>
            <h1 className="text-center">Update your Product !</h1>
            <button onClick={() => window.location.href='/admin'} className='float-right btn-warning'> Back to dashboard </button>
            <form id="formItem">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input className="inputeStyle form-control" type="text" name="title" placeholder="Title Article" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label><br/>
                    <textarea className="inputeStyle" name="description" id="description" form="formItem" placeholder="Your item description .." value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input className="inputeStyle form-control" type="text" name="category" placeholder="category" value={category.id} onChange={(e) => setCategory(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input className="inputeStyle form-control" type="number" name="price" placeholder="ex: 123" value={price} onChange={(e) => setPrice(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Promo</label>
                    <input className="inputeStyle form-control" type="number" name="promo" min="0" max="100" placeholder="0 - 100" value={promo} onChange={(e) => setPromo(e.target.value)}/>
                </div>
                <div className="row divBtnSex">
                    <input type="button" className={`btn btn-ligt mr-5 ${ sex == "F" ? "css-man" : ''}`} id="Women" value="Women" onClick={() => setBtnSex("F") + setSex("F")}/>
                    <input type="button" className={`btn btn-ligt ${ sex == "H" ? "css-man" : ''}`} id="Men" value="Men" onClick={() => setBtnSex("H") + setSex("H")}/>
                </div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default UpdateProduct;