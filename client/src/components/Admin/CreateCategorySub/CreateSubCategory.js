import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import axios from 'axios';
import './SubCategory.css';

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
            alert("Your name contains invalid characters");
        }
    }

    return (
        <div className='container'>
            <h1 className="text-center">Create category !</h1>
            <div className="btnLink">
                <button onClick={() => window.location.href='/admin'} className='btn btn-warning margin-right'> Back to dashboard </button>
                <button onClick={() => window.location.href='/admin/createCategory'} className='btn btn-warning'> Create Category </button>
            </div>
            <form id="formCategory">
                <div className="form-group">
                    <label htmlFor="subCategory">SubCategory name</label>
                    <input className="inputeStyle form-control" type="text" name="subCategory" placeholder="subCategory" onChange={handleChange}/>
                </div>
                <select class="form-control form-control-lg">
                    <option value="">--- CHOICE CATEGORY ---</option>
                </select>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Create</button>
            </form>
        </div>
    )
}

export default CreateProduct;