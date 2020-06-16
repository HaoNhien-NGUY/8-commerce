import './User.css';
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import {  useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

function UserHome() {


    return (
        <>
            <div className="col-sm-3">
                <h3 className="listUser">Shipping Address</h3>
                <h3 className="listUser">Bank card</h3>
                <h3 className="listUser">Order History</h3>
            </div>
            <div className="col-sm-9">

            </div>
        </>
    )
}

export default UserHome;