import './command.css';
import axios from "axios";
import IdCommand from './idCommand';
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import {  useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

function EnterCommand() {
    const [idCommand, setIdCommand] = useState([]);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [orderDefined, setOrderDefined] = useState(false);

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const onChange = (event) => {
        let res = event.target.value.trim();
        let invalids = {};

        if (res != "" && res.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]/)) {
            invalids.error = "Your order must be only numbers"
        }
        if (Object.keys(invalids).length === 0) {
            setIsInvalid(invalids);
        } else {
            setIsInvalid(invalids);
        }
        setIdCommand(res);
    }

    function onSubmit(e) {
        e.preventDefault();
        let invalids = {};

        if (idCommand != "") {
            if (idCommand.match(/[\\'"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]/)) {
                invalids.error = "Invalids characteres";
            }
        } else {
            invalids.error = "Enter your order number"
        }

        if (Object.keys(invalids).length === 0) {
            setIsInvalid(invalids);
            setIsReady(true);
        } else {
            setIsInvalid(invalids);
        }
    }

    useEffect(() => {
        if (isReady) {
            setIsReady(false);
            axios.get("http://localhost:8000/api/user/order/" + idCommand, config).then(res => {
                if (res.data == null) {
                    toast.error("Command not found: " + idCommand, { position: 'top-center' });
                } else {
                    window.location.href = "command?order=" + idCommand;
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }, [isReady]);

    useEffect(() => {
        if (query.get("order")) {
            axios.get("http://localhost:8000/api/user/order/" + query.get("order"), config).then(res => {
                if (res.data == null) {
                    setOrderDefined(false);
                    toast.error("Command not found: " + idCommand, { position: 'top-center' });
                } else {
                    setOrderDefined(true);
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }, []);
    
    if (query.get("order") && orderDefined) {
        return (
            <IdCommand />
        )
    } else {
        return (
            <>
                <ToastContainer />
                <div className="container">
                    <div className="formCommand">
                    <h1>Order Tracking <i className="material-icons md-36 marg">track_changes</i></h1>
                        <Form onSubmit={onSubmit}>
                            <FormGroup>
                                <Label for="command">ID Order:</Label>
                                <Input type="text" name="command" id="command" placeholder="ex: 10019" onChange={onChange}
                                    className={(isInvalid.error ? 'is-invalid' : 'inputeStyle')}
                                /><div className="invalid-feedback">{ isInvalid.error }</div>
                                
                                <Button color="success" className="mt-3" block>Submit</Button>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </>
        )
    }
}

export default EnterCommand;