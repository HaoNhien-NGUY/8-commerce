import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePackaging from './CreatePackaging';

function Packaging() {
    const [show, setShow] = useState(false);
    const [postDataPack, setPostDataPack] = useState(false);

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    useEffect(() => {
        receivedData();
    }, []);

    function receivedData() {
        axios.get(`http://127.0.0.1:8000/api/packaging`, config).then(async res => {
            // await setPageCount(Math.ceil(res.data.nbResults / limit));
            const newPostData = res.data.length > 0 ? res.data.map((pack) =>
                <tr key={pack.id}>
                    <td><p className="m-2 align-items-center">{pack.id}</p></td>
                    <td><p className="m-2">{pack.name.toUpperCase()}</p></td>
                </tr>
            ) : null
            setPostDataPack(newPostData);
        }).catch(error => {
            console.log(error);
            toast.error('Error !', { position: 'top-center' });
        })
    }

    function closeModal() {
        setShow(false);
    }

    return (
        <>
            <div className="row justify-content-end mb-2">
                <button onClick={() => setShow(true)} className="btn btn-success m-1">+ New Packaging</button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <CreatePackaging config={config} closeModal={closeModal} />
                </Modal>
            </div>
            <div className="row border p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="m-2 align-items-center">ID</p></th>
                            <th><p className="m-2">Name</p></th>
                            <th><p className="m-2">Date end</p></th>
                            <th><p className="m-2">Date end</p></th>
                            <th><p className="m-2">Spending</p></th>
                            <th><p className="m-2">Price</p></th>
                            <th><p colSpan="3" className="m-1">Actions</p></th>
                        </tr>
                    </thead>
                    <tbody>{postDataPack}</tbody>
                </table>
            </div>
        </>
    )
}

export default Packaging;