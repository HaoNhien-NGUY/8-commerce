import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Shipping() {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };
// commencer par faire la page create new shipping company, make le lien dans app,js pour a page et creer le component CreateShipping
    return (
        <>
            <ToastContainer />
            <div className="row justify-content-end mb-2">
                <button onClick={() => window.location.href = 'admin/create/shipping'} className="btn btn-success m-1">+ New Shipping company</button>
                {/* <button className="btn btn-success m-1">+ New Supplier</button> */}


            </div>
        </>
    )
}

export default Shipping;