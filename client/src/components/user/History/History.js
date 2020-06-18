import axios from "axios";
import React, { useState, useEffect } from "react";

function ShowOrder(props) {
    const [history, setHistory] = useState([]);

    function getDate(date) {
        let d = new Date(date);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    }

    useEffect(() => {
        axios.get("http://localhost:8000/api/user/" + props.idUser + "/orders").then(res => {
            const newDataHistory = res.data.userOrders.map(e =>
                <tr key={e.id}>
                    <td scope="row" className=""><p className=" ml=3 mt-3 mb-3 align-items-center">{e.trackingNumber}</p></td>
                    <td className="text-nowrap"><p className=" m-3 align-items-center">{e.status != "" ? "Delivered" : " In transition"}</p></td>
                    <td className=""><p className=" mr-3align-items-center">{e.packaging ? e.packaging : " without"}</p></td>
                    <td className=""><p className=" m-3 align-items-center">{getDate(e.createdAt)}</p></td>
                    <td className="text-nowrap"><p className=" m-3 align-items-center">{e.cost} €</p></td>
                    <td className="text-nowrap">
                        <p className=" mt-3 mb-3 mr-3 align-items-center">    <button className="btn btn-outline-secondary m-0" onClick={() => window.location.href = '/command?order=' + e.trackingNumber}>Show Order</button></p>
                    </td>
                </tr >
            )
            setHistory(newDataHistory);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <>
            <h1>Order History</h1>
            <div className="mt-5 row border p-2">
                <table className="">
                    <tbody>
                        <tr className="">
                            <th className="">TrackingNumber</th>
                            <th className="">Status</th>
                            <th className="">Packaging</th>
                            <th className="">Date</th>
                            <th className="">Price</th>
                            <th className="">Details</th>
                        </tr>
                        {history.length > 0 ? history : null}
                    </tbody>
                </table>
                {history.length > 0 ? null : <h1 className="noOrder">No order set</h1>}
            </div>
        </>
    )
}

export default ShowOrder;