import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import './command.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {  useLocation } from "react-router-dom";

function CommandTracking() {
    const [total, setTotal] = useState(false);
    const [city, setCity] = useState(false);
    const [country, setCountry] = useState(false);
    const [lastname, setLastname] = useState(false);
    const [firstname, setFirstname] = useState(false);
    const [packaging, setPackaging] = useState(false);
    const [adressLivraison, setAdressLivraison] = useState(false);
    const [divOrderProduct, setDivOrderProduct] = useState([]);
    const [isDelivred, setIsDelivred] = useState(false);

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    
    let idOrder = useQuery().get("order");

    useEffect(() => {
        axios.get("http://localhost:8000/api/user/order/" + idOrder, config).then(res => {
            console.log(res.data);
            setCity(res.data.shippingAddress.city);
            setCountry(res.data.shippingAddress.country);
            setLastname(res.data.shippingAddress.firstname);
            setFirstname(res.data.shippingAddress.lastname);
            setAdressLivraison(res.data.shippingAddress.address);
            setPackaging(res.data.packaging);
            setTotal(res.data.cost);

            if (Number(res.data.status) == 1) {
                setIsDelivred(true);
            }

            const newProduct = res.data.subproducts.map(product => 
                <div className="divOrderCart pl-3 pr-3" >
                    <table className="productinCart">
                        <tbody>
                            <tr>
                                <td rowSpan="3" className="tableborder paddright">
                                    <img className="imgOrder" src={`http://127.0.0.1:8000/api/image/${product.subproduct.product.id}/default/1.jpg`}/>
                                </td>
                                <td>
                                    <span><b>Title:</b> { product.subproduct.product.title}</span>
                                </td>
                            </tr>
                            <tr className="tableborder">
                                <td className="detailsproduct">
                                    <span><b>Color:</b> {product.subproduct.color.name}</span>
                                    <span><b>Size:</b> {product.subproduct.size}</span>
                                    <span><b>Sex:</b> {product.subproduct.product.sex}</span>
                                    { product.promo != 0 ? 
                                        <span><b>Price:</b> <s className="text-danger">{product.price} €</s> - {product.price - (product.price * (product.promo / 100))} €</span>
                                        :<span><b>Price:</b> {product.price} €</span>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>   
            );
            setDivOrderProduct(newProduct);
        }).catch(error => {
            console.log(error);
        });
    }, []);


console.log(divOrderProduct);
    return (
        <>
            <div className="container mt-5">
                <h1>Order number: {idOrder}</h1>
            </div>
            <div className="container d-flex">
                <div className="col-sm-7 border-right pr-4">
                    <h2 className="text-center mb-4">Personal information</h2>
                    <div>
                        <table className="bordertable tablOrder">
                            <tbody>
                                <tr className="bordertable">
                                    <th className="bordertable titleTable p-2"><h6><b>Firstname:</b></h6></th>
                                    <td className="text-right p-2"><span>{firstname}</span></td>
                                </tr>
                                <tr className="bordertable">
                                    <th className="bordertable titleTable p-2"><h6><b>Lastname:</b></h6></th>
                                    <td className="text-right p-2"><span>{lastname}</span></td>
                                </tr>
                                <tr className="bordertable">
                                    <th className="bordertable titleTable p-2"><h6><b>Country:</b></h6></th>
                                    <td className="text-right p-2"><span>{country}</span></td>
                                </tr>
                                <tr className="bordertable">
                                    <th className="bordertable titleTable p-2"><h6><b>City:</b></h6></th>
                                    <td className="text-right p-2"><span>{city}</span></td>
                                </tr>
                                <tr className="bordertable">
                                    <th className="bordertable titleTable p-2"><h6><b>Delivery address:</b></h6></th>
                                    <td className="text-right p-2"><span>{adressLivraison}</span></td>
                                </tr>
                                <tr className="bordertable">
                                    <th className="bordertable titleTable p-2"><h6><b>Packaging:</b></h6></th>
                                    <td className="text-right p-2"><span>{packaging}</span></td>
                                </tr>
                                <tr className="bordertable">
                                    <th className="bordertable titleTable p-2"><h6><b>Total Price:</b></h6></th>
                                    <td className="text-right p-2"><span>{total} €</span></td>
                                </tr>
                            </tbody>
                        </table>
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
            <div className="container mb-5">
                <h2 className="text-center mb-3">Your articles</h2>
                {divOrderProduct}
            </div>
        </>
    )
}

export default CommandTracking;