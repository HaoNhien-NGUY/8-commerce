import './User.css';
import axios from "axios";
import Card from './Card/Card';
import Error from './Error404';
import History from './History/History';
import BillingAddress from './Address/Billing/BillingAddress';
import ShippingAddress from './Address/Shipping/ShippingAddress';
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
                setComponent(<History idUser={props.idUser}/>);
                break;
            case "card":
                console.log("card");
                setComponent(<Card idUser={props.idUser}/>);
                break;
            case "billing":
                console.log("billing");
                setComponent(<BillingAddress idUser={props.idUser}/>);
                break;
            case "shipping":
                console.log("shipping");
                setComponent(<ShippingAddress idUser={props.idUser}/>);
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
                    <a href="/user?content=history"><h3 className="listUser">Order History</h3></a>
                    <a href="/user?content=shipping"><h3 className="listUser">Shipping Address</h3></a>
                    <a href="/user?content=billing"><h3 className="listUser">Billing Address</h3></a>
                    <a href="/user?content=card"><h3 className="listUser">Bank card</h3></a>
                </div>
                <div className="col-sm-9">
                    {component}
                </div>
            </div>
        </>
    )
}

export default UserHome;