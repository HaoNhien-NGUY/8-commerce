import React, { useState, useEffect } from 'react';
import { Parallax, Background } from "react-parallax";
import axios from 'axios';
import './SubCategory.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateSubCategory() {
    const [formControl, setFormControl] = useState({});
    const [allCategory, setAllCategory] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const [categorySelected, setCategorySelected] = useState('');
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
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let subCategory = str.charAt(0).toUpperCase() + str.slice(1);
        setFormControl({ [event.target.name]: subCategory.replace(/[\s]{2,}/g, " ") });
    }
    
    function handleSelect(event) {
        setCategorySelected(event.target.value);
    }

    function formSubmit(e) {
        e.preventDefault();
        let invalids = {};

        if (formControl.subCategory) {
            if (formControl.subCategory.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/) ) {
                invalids.subCategory = "Charactere invalid";
            }
        } else {
            invalids.subCategory = "Please enter a subCategory";
        }

        if (!categorySelected) {
            invalids.category = "Select category";
        }

        if (Object.keys(invalids).length === 0) {
            setIsInvalid(invalids);
            setIsReady(true)
        } else {
            setIsInvalid(invalids);
        }
    }

    useEffect( () => {
        if (isReady) {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const body = JSON.stringify({ ...formControl });
            
            axios.post("http://127.0.0.1:8000/api/subcategory/create/" + categorySelected + "/" + formControl.subCategory, body, config)
                .then( res => {
                    alert('SubCategory correctly added!');
                }).catch( err => {
                    console.log(err);
                });
        }
    }, [isReady]);

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
                    <input className={"form-control " + (isInvalid.subCategory ? 'is-invalid' : 'inputeStyle')} type="text" name="subCategory" placeholder="subCategory" onChange={handleChange} />
                    <div className="invalid-feedback">{ isInvalid.subCategory }</div>
                </div>
                <select className={"form-control form-control-lg " + (isInvalid.category ? 'is-invalid' : 'inputeStyle')} id="selectCategory" onChange={handleSelect}>
                    <option value="">--- CHOICE CATEGORY ---</option>
                    {optionCategory}
                </select>
                <div className="invalid-feedback">{ isInvalid.category }</div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Create</button>
            </form>
        </div>
    )
}

export default CreateSubCategory;