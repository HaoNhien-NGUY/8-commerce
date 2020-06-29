import './User.css';
import axios from "axios";
import Card from './Card/Card';
import Error from './Error404';
import History from './History/History';
import BillingAddress from './Address/Billing/BillingAddress';
import ShippingAddress from './Address/Shipping/ShippingAddress';
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import store from './../../store';
import { Link } from "react-router-dom";

function UserHome(props) {
    const [component, setComponent] = useState([]);

    const token = store.getState().auth.token

    const config = {
      headers: {
        "Content-type": "application/json",
        "Authorization": 'Bearer '+token
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
                setComponent(<ShippingAddress idUser={props.idUser} config={config} />);
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
                    <ul className="list-group">
                        <li className={"list-group-item list-group-item-action list-group-item-secondary"}>{props.emailUser}</li>
                        <Link className="a-none" to="/user?content=history"><li className={"list-group-item list-group-item-action" + (query == "history" ? " active" : "")}> Order History</li></Link>
                        <li className={"list-group-item list-group-item-action" + (query == "shipping" ? " active" : "")}> <Link className="a-none" to="/user?content=shipping">Shipping Address</Link></li>
                        <li className={"list-group-item list-group-item-action" + (query == "billing" ? " active" : "")}><Link className="a-none" to="/user?content=billing">Billing Address</Link></li>
                        <li className={"list-group-item list-group-item-action" + (query == "card" ? " active" : "")}><Link className="a-none" to="/user?content=card">Bank card</Link></li>
                    </ul>
                </div>
                <div className="col-sm-9">
                    {component}
                </div>
            </div>
            
        </>
    )
}

export default UserHome;