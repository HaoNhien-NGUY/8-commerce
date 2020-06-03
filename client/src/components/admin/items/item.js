import React, { useState } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";
import './item.css';

function Home() {
    function formSubmit(e) {
        e.preventDefault();
    }

    return (
        <div className='container'>
            <h1 className="text-center">Create your Item !</h1>
            <form id="formItem">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input className="inputeStyle form-control" type="text" id="title" aria-describedby="emailHelp" placeholder="Title Article"/>
                    {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
                </div>
                <div class="form-group">
                    <label for="description">Description</label><br/>
                    <textarea className="inputeStyle" id="description" form="formItem" placeholder="Your item description .."/>
                </div>
                <div class="form-group">
                    <label for="price">Price</label>
                    <input className="inputeStyle form-control" type="number" id="price" placeholder="ex: 123"/>
                </div>
                <div class="form-group">
                    <label for="price">Promo</label>
                    <input className="inputeStyle form-control" type="number" id="promo" min="0" max="100" placeholder="0 - 100"/>
                </div>
                <button type="submit" class="btn btn-dark" onClick={formSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Home;