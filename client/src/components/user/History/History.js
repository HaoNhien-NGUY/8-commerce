import axios from "axios";
import React, { useState, useEffect } from "react";

function ShowOrder(props) {
    const [history, setHistory] = useState([]);

    let date = new Date("2020-06-15T18:01:59+02:00");

    function getDate(date) {
        let d = new  Date(date);
        return d.getDate() + "/" + (d.getMonth()+1) + "/" +  d.getFullYear();
    }

    useEffect(() => {
        axios.get("http://localhost:8000/api/user/" + props.idUser + "/orders").then(res => {
                console.log(res.data.userOrders);
                const newDataHistory = res.data.userOrders.map(e => 
                        <tr>
                            <td className="titleHistory">{e.trackingNumber}</td>
                            <td className="titleHistory">{ e.status != "" ? e.status : " In transition"}</td>
                            <td className="titleHistory">{e.packaging ? e.packaging : " without"}</td>
                            <td className="titleHistory">{e.cost}</td>
                            <td className="titleHistory"> {getDate(e.createdAt)}</td>
                            <td className="titleHistory text-center">
                                <button className="btn btn-outline-dark" onClick={() => window.location.href = '/command?order=' + e.trackingNumber}>Show Order</button>
                            </td>
                        </tr>
                    )
                setHistory(newDataHistory);
            }).catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <>

            <div className="mt-5">
                <table className="productinCart tableHistory">
                    <thead className="allHistory">
                        <th colspan="6">
                            <h3 className="text-center">All Orders</h3>
                        </th>
                    </thead>
                    <tbody>
                        <th className="titleHistory">TrackingNumber</th>
                        <th className="titleHistory">Status</th>
                        <th className="titleHistory">Packaging</th>
                        <th className="titleHistory">Price</th>
                        <th className="titleHistory">Date</th>
                        <th className="titleHistory">Details</th>
                        {history}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ShowOrder;