import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Suppliers() {
    const [show, setShow] = useState(false);
    const [supplierName, setSupplierName] = useState([]);
    const [allSupplier, setAllSupplier] = useState([]);
    const optionSelect = [];

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/supplier", config).then(e => {
            setAllSupplier(e.data.data);
        });
    }, []);

    allSupplier.map(supp => {
        optionSelect.push(<option key={supp.id} value={supp.id}>{supp.name}</option>)
    });

    const onChange = (event) => {
        let res = event.target.value.trim();
        let str = res.toLowerCase();
        let supplier = str.charAt(0).toUpperCase() + str.slice(1);
        setSupplierName(supplier.replace(/[\s]{2,}/g, " "));
    }
    function onSubmit(e) {
        e.preventDefault();
        if (supplierName.length === 0) {
            return toast.error("You need to enter a name", { position: "top-center" });
        }
        if (supplierName.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
            return toast.error("Invalid charactere", { position: "top-center" });
        } else {
            const body = {
                "name" : supplierName
            };
            axios.post("http://127.0.0.1:8000/api/supplier", body, config).then( e => {
                toast.success("Supplier correctly added !", { position: "top-center" });
                setShow(false);
            }).catch( err => {
                toast.error('Error !', {position: 'top-center'});
            });
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="row justify-content-end mb-2">
                <button onClick={() => window.location.href = 'admin/order'} className="btn btn-success m-1">+ New Order</button>
                <button onClick={() => setShow(true)} className="btn btn-success m-1">+ New Supplier</button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>New Supplier !</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmit}>
                            <FormGroup>
                                <Label for="supplier">Suplier name</Label>
                                <Input
                                    type="text"
                                    name="supplier"
                                    id="supplier"
                                    onChange={onChange}/>
                                <Button color="dark" className="mt-4" block>Submit</Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="row border p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="m-2 align-items-center"> ID </p></th>
                            <th><p className="m-2"> Order </p></th>
                            <th><p colspan="3" className="m-1"> Actions </p></th>
                        </tr>
                    </thead>
                    {/* <tbody>{postDataCategories}</tbody> */}
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    {/* <ReactPaginate
                        previousLabel={"prev"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCountCategories}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClickCategories}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} /> */}
                </div>
            </div>
        </>
    )
}

export default Suppliers;