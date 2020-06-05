import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Parallax, Background } from "react-parallax";
import axios from 'axios';
import './SubCategory.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateProduct() {
    const [formControl, setFormControl] = useState(null);
    const [allCategory, setAllCategory] = useState([]);
    const optionCategory = [];

    useEffect( () => {
        axios.get("http://127.0.0.1:8000/api/category").then( e => {
            setAllCategory(e.data);
        });
    }, []);
    
    allCategory.map( category => {
        optionCategory.push(<option key={category.id} value={category.name}>{category.name}</option>)
    });

    function handleChange(event) {
        if (!event.target.value.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/) && event.target.value != "") {
            let str = event.target.value.toLowerCase();
            let category = str.charAt(0).toUpperCase() + str.slice(1);
            setFormControl({ [event.target.name]: category });
        }
        else {
            setFormControl(null);
        }
    }

    function formSubmit(e) {
        e.preventDefault();
        let category = $("#selectCategory").val();

        if (!category == "") {
            $("#selectCategory").removeClass("erroSelect");

            if (formControl !== null) {
                const config = {
                    headers: {
                        "Content-type": "application/json"
                    }
                }
                const body = JSON.stringify({ ...formControl });
    
                axios.post("http://127.0.0.1:8000/api/subcategory/create/" + category + "/" + formControl.subCategory, body, config)
                    .then( res => {
                        toast.success('SubCategory correctly added!', {position: "top-center"});
                    }).catch( err => {
                        console.log(err)
                    });
            }
            else {
                toast.error("Your name contains invalid characters", {position: "top-center"});
            }
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
                <button onClick={() => window.location.href = '/admin'} className='btn btn-warning margin-right'> Back to dashboard </button>
                <button onClick={() => window.location.href = '/admin/createCategory'} className='btn btn-warning'> Create Category </button>
            </div>
            <form id="formCategory">
                <div className="form-group">
                    <label htmlFor="subCategory">SubCategory name</label>
                    <input className="inputeStyle form-control" type="text" name="subCategory" placeholder="subCategory" onChange={handleChange} />
                </div>
                <select className="form-control form-control-lg" id="selectCategory">
                    <option value="">--- CHOICE CATEGORY ---</option>
                    {optionCategory}
                </select>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Create</button>
            </form>
        </div>
    )
}

export default CreateProduct;