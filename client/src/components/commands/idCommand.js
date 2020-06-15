import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import './command.css';
import { useRouteMatch } from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';

function CommandTracking() {
    let idOrder = useRouteMatch("/command/:id").params.id;
    const [total, setTotal] = useState(false);
    const [adressLivraison, setAdressLivraison] = useState(false);
    const [adressFacturation, setAdressFacturation] = useState(false);
    const [divOrderProduct, setDivOrderProduct] = useState([]);

    const [isDelivred, setIsDelivred] = useState(false);

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    useEffect(() => {
        axios.get("http://localhost:8000/api/product/1", config).then(res => {
            const newProduct = res.data.subproducts.map(product => 
                console.log(product)
                // <div className="divOrderCart" >
                //     <table className="productinCart">
                //         <tbody>
                //             <tr>
                //                 <td rowSpan="3" className="tableborder paddright">
                //                     {/* <img className="imgOrder" src={`http://127.0.0.1:8000/api/image/${e.idProduct}/default/1.jpg`}/> */}
                //                 </td>
                //                 <td>
                //                     <span><b>Title:</b> { product.subProductTitle}</span>
                //                 </td>
                //             </tr>
                //             <tr className="tableborder">
                //                 <td className="detailsproduct">
                //                     <span><b>ID:</b> {product.idSubProduct}</span>
                //                     <span><b>Color:</b> {product.subProductColor}</span>
                //                     <span><b>Size:</b> {product.subProductSize}</span>
                //                     <span><b>Quantity:</b> {product.quantity}</span>
                //                     <span><b>Price:</b> {product.price * product.quantity} €</span>
                //                 </td>
                //             </tr>
                //         </tbody>
                //     </table>
                // </div>   
            );
            setDivOrderProduct(newProduct);
        }).catch(error => {
            console.log(error);
        });

        setTotal(1200);
        setAdressLivraison("123 boulevard victor hugo (Saint-Ouen)");
        setAdressFacturation("123 boulevard victor hugo (Saint-Ouen)");
        // setIsDelivred(true);
    }, []);



    return (
        <>
            <div className="container mt-5">
                <h1>Order number: {idOrder}</h1>
            </div>
            <div className="container d-flex">
                <div className="col-sm-7 border-right pr-4">
                    <h2 className="text-center mb-4">Personal information</h2>
                    <div>
                        <h5 className="borderBottomC"><b>Total Price:</b> <span className="resultCommand">{total} €</span></h5>
                        <h5 className="borderBottomC"><b>Billing address:</b> <span className="resultCommand">{adressFacturation}</span></h5>
                        <h5 className="borderBottomC"><b>Delivery address:</b> <span className="resultCommand">{adressLivraison}</span></h5>
                    </div>
                </div>
                <div className="col-sm-5 pl-4">
                    <h2 className="text-center mb-4">Delivery status</h2>
                    <h5><b>Status:</b><span className="resultCommand">{isDelivred ? 'Delivred' : 'In transition'}</span></h5>
                    { isDelivred ?
                        <div className="mt-4">
                            <i className="material-icons marg arrivedC">where_to_vote</i>
                            <ProgressBar striped variant="success" now={100}/>
                        </div>
                        : <div className="mt-4">
                            <i className="material-icons marg">where_to_vote</i>
                            <i className="material-icons marg intransition">room</i>
                            <i className="material-icons marg intransition disabledC">room</i>
                            <ProgressBar animated now={49} className="rotate90"/>
                        </div>
                    }
                </div>
            </div>
            <div className="container">
                {divOrderProduct}
            </div>
        </>
    )
}

export default CommandTracking;