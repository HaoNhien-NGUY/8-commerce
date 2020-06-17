import axios from "axios";
import React, { useState, useEffect } from "react";
import logocb from "../../../img/logocb.png";
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { ToastContainer, toast } from "react-toastify";
import CreateCard from './CreateCard';

function Card(props) {
    const [show, setShow] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [cards, setCards] = useState([]);
    const [idCard, setIdCard] = useState([]);
    const [readyDelete, setReadyDelete] = useState(false);

    function DeleteCard(id) {
        setShow(true);
        setIdCard(id);
    }

    useEffect(() => {
        if (readyDelete) {
            setReadyDelete(false);
            axios.delete("http://localhost:8000/api/cardcredentials/" + idCard).then(res => {
                toast.success(res.data.message, { position: "top-center"});
                setIdCard([]);
                getCard();
            }).catch(error => {
                console.log(error);
            });
        }
    }, [readyDelete]);

    const getCard = () => {
        axios.get("http://localhost:8000/api/cardcredentials/user/" + props.idUser).then(res => {
            const newDataCards = res.data.map(e => 
                    <div className="divCard row" key={e.id}>
                        <div className="cards" >
                            <h5 className="titleCard ">Card <img className="logocb" src={logocb}/></h5>
                            <h5 className="titleCard text-center">{e.cardNumbers}</h5>
                            <span className="titleCard">{e.expirationDate}</span>
                            <h6 className="titleCard">{e.firstname} {e.lastname}</h6>
                        </div>
                        <div>
                            <p className="cryptogramme mr-5">Cryptogramme:</p>
                            <p className="pccv"><h6 className="colorblack"></h6><span className="spanccv">{e.ccv}</span></p>
                        </div>
                        <button className="btn btn-outline-danger cardDelete" onClick={prev => prev.preventDefault + DeleteCard(e.id)}>Delete Card</button>
                    </div>
                )
            setCards(newDataCards);
        }).catch(err => {
            console.log(err);
        });
    }
    
    useEffect(() => {
        getCard();
    }, [showCreate]);

    const closeModal = () => {
        setShowCreate(false);
    }

    return (
        <>
            <ToastContainer />
            <div className="container ">
                <button className="btn btn-success addcard" onClick={() => setShowCreate(true)}>Add Card</button>
                <div className="YourCards">
                    <h1 className="TitleCards">Your Cards</h1>
                    {cards}
                </div>
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <h3>Delete Card</h3>
                </Modal.Header>
                <Modal.Body>
                    <h2>You are going to delete this card Are you sure ?</h2>
                    <Button color="warning" className="mt-4" onClick={() => setReadyDelete(false)+setShow(false)}>Cancel</Button>
                    <Button color="danger" className="mt-4" onClick={() => setReadyDelete(true)+setShow(false)} >Yes</Button>
                </Modal.Body>
            </Modal>
            <Modal show={showCreate} onHide={() => setShowCreate(false)}>
                <CreateCard idUser={props.idUser} config={props.config} closeModal={closeModal}/>
            </Modal>
        </>
    )
}

export default Card;