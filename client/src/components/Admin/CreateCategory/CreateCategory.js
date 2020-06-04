import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import axios from 'axios';
import './Category.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateProduct() {
    const [fromControl, setFormControl] = useState(null);

    function handleChange(event) {
        if (!event.target.value.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/) && event.target.value != "") {
            let str = event.target.value.toLowerCase();
            let category = str.charAt(0).toUpperCase() + str.slice(1);
            setFormControl({[event.target.name]: category});
        }
        else {
            setFormControl(null);
        }
    }

    function formSubmit(e) {
        e.preventDefault();

        if (fromControl !== null) {
            console.log("fromControl");
            console.log(fromControl);
        }
        else {
          toast.error("Your name contains invalid characters", {position: "top-center"});
        }
    }

    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Create category !</h1>
            <div className="btnLink">
                <button onClick={() => window.location.href='/admin'} className='btn btn-warning margin-right'> Back to dashboard </button>
                <button onClick={() => window.location.href='/admin/createSubCategory'} className='btn btn-warning'> Create SubCategory </button>
            </div>
            <form id="formCategory">
                <div className="form-group">
                    <label htmlFor="category">Category name</label>
                    <input className="inputeStyle form-control" type="text" name="category" placeholder="Category" onChange={handleChange}/>
                </div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Create</button>
            </form>
        </div>
    )
}

export default CreateProduct;