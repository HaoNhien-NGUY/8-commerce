import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import axios from 'axios';
import './Category.css';

function CreateProduct() {
    const [formControl, setFormControl] = useState(null);

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

        if (formControl !== null) {
            $("#category").removeClass("errorInput");
            $("#category").addClass("inputeStyle");
            
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const body = JSON.stringify({ ...formControl });

            axios.post("http://127.0.0.1:8000/api/category/create/" + formControl.category, body, config ).then( res => {
                alert('Category correctly added!');
            }).catch( err => {
                console.log(err)
            });
        }
        else {
            $("#category").removeClass("inputeStyle");
            $("#category").addClass("errorInput");
            alert("Your name contains invalid characters");
        }
    }

    return (
        <div className='container'>
            <h1 className="text-center">Create Category !</h1>
            <div className="btnLink">
                <button onClick={() => window.location.href='/admin'} className='btn btn-warning margin-right'> Back to dashboard </button>
                <button onClick={() => window.location.href='/admin/createSubCategory'} className='btn btn-warning'> Create SubCategory </button>
            </div>
            <form id="formCategory">
                <div className="form-group">
                    <label htmlFor="category">Category name</label>
                    <input id="category" className="inputeStyle form-control errorInput" type="text" name="category" placeholder="Category" onChange={handleChange}/>
                </div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Create</button>
            </form>
        </div>
    )
}

export default CreateProduct;