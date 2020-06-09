import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import "./CreateOrder.css";

function cart(cartSubProduct) {
    console.log(cartSubProduct);

    return (
        <div className="container">
            <h1>test</h1>
        </div>
    )
}

export default cart;