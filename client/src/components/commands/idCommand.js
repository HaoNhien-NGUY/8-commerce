import './command.css';
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';

function CommandTracking() {
    const [divOrderProduct, setDivOrderProduct] = useState([]);
    const [isDelivred, setIsDelivred] = useState(false);
    const [total, setTotal] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({});
    const [billingAddress, setBillingAddress] = useState({});

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
            setShippingAddress(res.data.shippingAddress);
            setBillingAddress(res.data.billingAddress);
            setTotal(res.data.cost);

            if (Number(res.data.status) == 1) {
                setIsDelivred(true);
            }

            const newProduct = res.data.subproducts.map((product, index) =>
                <tr className="tablebordertest" key={index}>
                    <td className="paddright">
                        <img className="imgOrder" src={`http://127.0.0.1:8000/api/image/${product.subproduct.product.id}/default/1.jpg`} />
                    </td>
                    <td>
                        <span className="ml-3"><b>Title:</b> {product.subproduct.product.title}</span><br />
                        <span className="ml-3"><b>Color:</b> {product.subproduct.color.name}</span>
                    </td>
                    <td>
                        <span><b>Size:</b> {product.subproduct.size}</span>
                    </td>
                    <td>
                        <span><b>Sex:</b> {product.subproduct.product.sex}</span>
                    </td>
                    <td>
                        {product.promo ?
                            <span><b>Price:</b> {product.price - (product.price * (product.promo / 100))} € - <s className="text-danger">{product.price} €</s></span>
                            : <span><b>Price:</b> {product.price} €</span>
                        }
                    </td>
                </tr>
            );
            setDivOrderProduct(newProduct);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    return (
        <>
            <div className="container mt-5">
                <h1>Order number: {idOrder}</h1>
            </div>
            <div className="container">
                <div className="d-flex">
                    <div className="col-sm-6 border-right pr-4">
                        <h2 className="text-center mb-4">Shipping Address</h2>
                        <div>
                            <table className="bordertable tablOrder">
                                <tbody>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>Firstname:</b></h6></th>
                                        <td className="text-right p-2"><span>{shippingAddress.firstname}</span></td>
                                    </tr>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>Lastname:</b></h6></th>
                                        <td className="text-right p-2"><span>{shippingAddress.lastname}</span></td>
                                    </tr>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>Country:</b></h6></th>
                                        <td className="text-right p-2"><span>{shippingAddress.country}</span></td>
                                    </tr>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>City:</b></h6></th>
                                        <td className="text-right p-2"><span>{shippingAddress.city}</span></td>
                                    </tr>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>Delivery address:</b></h6></th>
                                        <td className="text-right p-2"><span>{shippingAddress.address}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-6 pl-4">
                    <h2 className="text-center mb-4">Billing Address</h2>
                        <div>
                            <table className="bordertable tablOrder">
                                <tbody>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>Firstname:</b></h6></th>
                                        <td className="text-right p-2"><span>{billingAddress.firstname}</span></td>
                                    </tr>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>Lastname:</b></h6></th>
                                        <td className="text-right p-2"><span>{billingAddress.lastname}</span></td>
                                    </tr>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>Country:</b></h6></th>
                                        <td className="text-right p-2"><span>{billingAddress.country}</span></td>
                                    </tr>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>City:</b></h6></th>
                                        <td className="text-right p-2"><span>{billingAddress.city}</span></td>
                                    </tr>
                                    <tr className="bordertable">
                                        <th className="bordertable titleTable p-2"><h6><b>Delivery address:</b></h6></th>
                                        <td className="text-right p-2"><span>{billingAddress.address}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <h2 className="text-center mb-4 mt-5">Delivery status</h2>
                <h5><b>Status: </b><span>{isDelivred ? 'Delivred' : 'In transition...'}</span></h5>
                {isDelivred ?
                    <div className="mt-4">
                        <i className="material-icons marg arrivedC">where_to_vote</i>
                        <ProgressBar striped variant="success" now={100} />
                    </div>
                    : <div className="mt-4">
                        <i className="material-icons marg">where_to_vote</i>
                        <i className="material-icons marg intransition">room</i>
                        <i className="material-icons marg intransition2 disabledC">room</i>
                        <ProgressBar animated now={50} className="rotate90"/>
                    </div>
                }
            </div>
            <div className="container mb-5">
                <h2 className="text-center mb-3">Your articles</h2>
                <h5 className="text-right "><span className="cost"><b>Total: </b>{total} €</span></h5>
                <div className="divOrderCart pl-3 pr-3" >
                    <table className="productinCart">
                        <tbody>
                            {divOrderProduct}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default CommandTracking;