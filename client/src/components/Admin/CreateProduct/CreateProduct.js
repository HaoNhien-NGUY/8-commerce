import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import './CreateProduct.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateProduct() {
    const [btnSex, setBtnSex] = useState('');
    const [formControl, setFormControl] = useState({});
    const [isReady, setIsReady] = useState(false);
    const [statusState, setStatusState] = useState(true);

    function handleChange(event) {
        if (parseInt(event.target.value) || event.target.value == 0) {
            setFormControl({ ...formControl, [event.target.name]: parseInt(event.target.value) });
        }
        else {
            setFormControl({ ...formControl, [event.target.name]: event.target.value });
        }
    }
    
    function formSubmit(e) {
        e.preventDefault();
        setFormControl({ ...formControl, ['sex']: btnSex , ['status']: statusState});
        
        setIsReady(true);
    }
    
    useEffect( () => {
        if (isReady) {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            setIsReady(false);
            const body = JSON.stringify({ ...formControl })
            console.log(body);
            axios.post("http://127.0.0.1:8000/api/product", body, config ).then( e => {
                toast.success('Product correctly added!', { position: "top-center"})
            }).catch( err => {
                console.log(err)
            });
        }
    }, [isReady]);

    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Create your Product !</h1>
            <button onClick={() => window.location.href='/admin'} className='float-right btn btn-warning mb-3'> Back to dashboard </button>
            <form id="formItem">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input className="inputeStyle form-control" type="text" name="title" placeholder="Title Article" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label><br/>
                    <textarea className="inputeStyle" name="description" id="description" form="formItem" placeholder="Your item description .." onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="subcategory">SubCategory</label>
                    <input className="inputeStyle form-control" type="text" name="subcategory" placeholder="subcategory" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input className="inputeStyle form-control" type="number" name="price" placeholder="ex: 123" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Promo</label>
                    <input className="inputeStyle form-control" type="number" name="promo" min="0" max="100" placeholder="0 - 100" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="status">Active</label>
                    <input type="checkbox" className="ml-2" id="status" onChange={() => setStatusState(!statusState)} checked={statusState}/>
                </div>
                <div className="row divBtnSex">
                    <input type="button" className={`btn btn-ligt mr-5 ${btnSex == "F" ? "css-man" : ''}`} id="Women" value="Women" onClick={() => setBtnSex("F")}/>
                    <input type="button" className={`btn btn-ligt ${btnSex == "H" ? "css-man" : ''}`} id="Men" value="Men" onClick={() => setBtnSex("H")}/>
                </div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Submit</button>

            </form>
        </div>
    )
}

export default CreateProduct;