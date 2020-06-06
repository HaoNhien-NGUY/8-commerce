import React, { useState, useEffect } from 'react';
import { Parallax, Background } from "react-parallax";
import axios from 'axios';
import './CreateColor.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateColor() {
    const [formControl, setFormControl] = useState({});
    const [isReady, setIsReady] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);

    function handleChange(event) {
            let res = event.target.value.trim();
            let str = res.toLowerCase();
            let color = str.charAt(0).toUpperCase() + str.slice(1);
            setFormControl({[event.target.name]: color.replace(/[\s]{2,}/g, " ") });
    }

    function formSubmit(e) {
        e.preventDefault();
        let invalids = {};

        if (formControl.color) {
            if (formControl.color.match(/[-\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/) ) {
                invalids.color = "Charactere invalid";
            }
        } else {
            invalids.color = "Please enter a color";
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
            setIsReady(false);
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const body = JSON.stringify({ ...formControl });

            axios.post("http://127.0.0.1:8000/api/color/" + formControl.color, body, config ).then( res => {
                toast.success('Color correctly added!', {position: "top-center"});
            }).catch( err => {
                toast.error('Color already exist!', {position: 'top-center'});
            });
        }
    }, [isReady]);

    return (
        <div className='container'>
            <ToastContainer />
            <h1 className="text-center">Create Color !</h1>
            <div className="btnLink">
                <button onClick={() => window.location.href='/admin'} className='btn btn-warning'> Back to dashboard </button>
            </div>
            <form id="formColor">
                <div className="form-group">
                    <label htmlFor="color">Color name</label>
                    <input id="color" className={"form-control " + (isInvalid.color ? 'is-invalid' : 'inputeStyle')} type="text" name="color" placeholder="Color" onChange={handleChange}/>
                    <div className="invalid-feedback">{ isInvalid.color }</div>
                </div>
                <button type="submit" className="btn btn-dark" onClick={formSubmit}>Create</button>
            </form>
        </div>
    )
}

export default CreateColor;