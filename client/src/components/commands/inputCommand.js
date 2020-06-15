import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import './command.css';

function EnterCommand() {
    const [idCommand, setIdCommand] = useState([]);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const onChange = (event) => {
        let res = event.target.value.trim();
        let invalids = {};

        if (res != "" && !Number(res)) {
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
            if (!Number(idCommand)) {
                invalids.error = "Your order must be only numbers"
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

            // axios
        }
    }, [isReady]);

    return (
        <>
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

export default EnterCommand;