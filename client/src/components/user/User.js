import './User.css';
import axios from "axios";
import Card from './Card/Card';
import Error from './Error404';
import History from './History/History';
import Address from './Address/Address';
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import {  useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

function UserHome(props) {
    const [component, setComponent] = useState([]);

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery().get("content");

    useEffect(() => {
        switch (query) {
            case "history":
                console.log("history");
                setComponent(<History />);
                break;
            case "card":
                console.log("card");
                setComponent(<Card />);
                break;
            case "address":
                console.log("address");
                setComponent(<Address />);
                break;
            default:
                console.log("history(error)");
                setComponent(<Error />);
        }
    }, [query]);

    return (
        <>  
            <div className="mt-5 d-flex">
                <div className="col-sm-3 pt-5">
                    <h3 className="listUser">Order History</h3>
                    <h3 className="listUser">Shipping Address</h3>
                    <h3 className="listUser">Bank card</h3>
                </div>
                <div className="col-sm-9">
                    {component}
                </div>
            </div>
        </>
    )
}

export default UserHome;