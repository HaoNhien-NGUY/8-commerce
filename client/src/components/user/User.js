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
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery().get("content");

    useEffect(() => {
        switch (query) {
            case "history":
                console.log("history");
                setComponent(<History idUser={props.idUser} />);
                break;
            case "card":
                console.log("card");
                setComponent(<Card idUser={props.idUser} config={config} />);
                break;
            case "billing":
                console.log("billing");
                setComponent(<BillingAddress idUser={props.idUser} config={config} />);
                break;
            case "shipping":
                console.log("shipping");
                setComponent(<ShippingAddress idUser={props.idUser} config={config}/>);
                break;
            default:
                console.log("history(error)");
                setComponent(<Error />);
        }
    }, [query]);

    return (
        <>  
            <ToastContainer />
            <div className="mt-5 d-flex container">
                <div className="col-sm-3 pt-5">
                    <h5 className="authUser">{props.emailUser}</h5>
                    <a className="a-none" href="/user?content=history">
                        <h5 className={"listUser " + (query == "history" ? "StyleActive" : "")}>Order History</h5>
                    </a>
                    <a className="a-none" href="/user?content=shipping">
                        <h5 className={"listUser " + (query == "shipping" ? "StyleActive" : "")}>Shipping Address</h5>
                    </a>
                    <a className="a-none" href="/user?content=billing">
                        <h5 className={"listUser " + (query == "billing" ? "StyleActive" : "")}>Billing Address</h5>
                    </a>
                    <a className="a-none" href="/user?content=card">
                        <h5 className={"listUser lasCHild " + (query == "card" ? "StyleActive" : "")}>Bank card</h5>
                    </a>
                </div>
                <div className="col-sm-9">

                    {component}
                </div>
            </div>
        </>
    )
}

export default UserHome;