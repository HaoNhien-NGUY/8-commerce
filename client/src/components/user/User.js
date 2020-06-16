import './User.css';
import Card from './Card/Card';
import Error from './Error404';
import History from './History/History';
import BillingAddress from './Address/Billing/BillingAddress';
import ShippingAddress from './Address/Shipping/ShippingAddress';

import {  useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

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