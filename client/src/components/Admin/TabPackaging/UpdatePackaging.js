import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-date-picker';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

function UpdatePackaging({config, closeModal, idPack}) {

    return (
        <>
            <Modal.Header closeButton>Update Packaging !</Modal.Header>
            <Modal.Body>
                <h1>deded</h1>
                <Button color="dark" className="mt-4" onClick={closeModal} block>Cancel</Button>
            </Modal.Body>
        </>
    )
}

export default UpdatePackaging;