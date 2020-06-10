import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import "./CreateOrder.css";


function Cart(props) {
    const nbrProduct = [];
    const nbrPrice = [];
    const divOrder = [];
    let sumProduct = 0;
    let sumPrice = 0;
    
    const supplierOrder = [];

    const Shipping = (days) => {
        var result = new Date();
        result.setDate(result.getDate() + days);
        let dd = result.getDate();
        let mm = result.getMonth();
        let yy = result.getFullYear();
        let date = dd + "-" + mm + "-" + yy;
        return date;
    }

    props.handleCart.map((e) => {
        console.log(e);
        let obj = {
            "quantity": e.quantity,
            "subproduct_id": e.idSubProduct,
            "our_address" : e.ourAdress,
            "status" : false,
            "price" : e.price * e.quantity,
            "arrival_date" : Shipping(3),
            "supplier_id" : e.idSupplier
        }
        supplierOrder.push(obj);
        nbrProduct.push(e.quantity);
        nbrPrice.push(e.quantity * e.price);
        divOrder.push(
            <div className="divOrderCart">
                <table className="productinCart">
                    <tbody>
                        <tr>
                            <td rowSpan="3" className="tableborder">
                                <img src="http://127.0.0.1:8000/api/image/2/default/1.jpg"/>
                            </td>
                            <td>
                                <span><b>Title:</b> { e.subProductTitle}</span>
                            </td>
                        </tr>
                        <tr className="tableborder">
                            <td className="detailsproduct">
                                <span><b>ID:</b> {e.idSubProduct}</span>
                                <span><b>Color:</b> {e.subProductColor}</span>
                                <span><b>Size:</b> {e.subProductSize}</span>
                                <span><b>Quantity:</b> {e.quantity}</span>
                                <span><b>Price:</b> {e.price * e.quantity}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    })

    const submitOrder = (priceOrder) => {
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        
        let obj = {
            "our_address" : props.ourAdress,
            "status" : false,
            "price" : priceOrder,
            "arrival_date" : Shipping(3),
            "supplier_id" : props.idSupplier
        }

        axios.post("http://127.0.0.1:8000/api/supplier/order", obj, config).then( res => {
            toast.success('Order correctly submited !', { position: "top-center"});
            supplierOrder.map(order => {
                const body = {
                    "subproduct_id" : order.subproduct_id,
                    "quantity" : order.quantity
                }
                axios.post(`http://127.0.0.1:8000/api/supplier/order/${res.data.SupplierOrder.id}/add`, body, config).then(e => {
                    console.log(e);
                }).catch(error => {
                    console.log(error);
                });
            });
        }).catch( err => {
            toast.error('Error !', {position: 'top-center'});
        });

        // window.location.reload();
    }


    if (props.handleCart.length > 0) {
        return (
            <>
                <div className="container">
                    <ToastContainer />
                    {divOrder}
                    <div className="total">
                        <span>Products: {nbrProduct.map(e => {sumProduct = (Number(sumProduct) + Number(e))})}{sumProduct}</span>
                        <span>price {nbrPrice.map(e => {sumPrice = (Number(sumPrice) + Number(e))})}{sumPrice}€</span>
                    </div>
                    <button className="btn btn-success btnOrder" onClick={e => e.preventDefault() + submitOrder(sumPrice)}>Validate Order</button>
                </div>
            </>
        )
    } else {
        return false
    }

}

export default Cart;