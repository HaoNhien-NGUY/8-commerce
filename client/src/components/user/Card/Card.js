import axios from "axios";
import React, { useState, useEffect } from "react";
import logocb from "../../../img/logocb.png";

function Card(props) {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/cardcredentials/user/" + props.idUser).then(res => {
            console.log(res);
            const newDataCards = res.data.map(e => 
                    <div className="divCard row">
                        <div className="cards" key={e.id}>
                            <h5 className="titleCard ">Card <img className="logocb" src={logocb}/></h5>
                            <h5 className="titleCard text-center">{e.cardNumbers}</h5>
                            <span className="titleCard">{e.expirationDate}</span>
                            <h6 className="titleCard">{e.firstname} {e.lastname}</h6>
                        </div>
                        <div>
                            <p className="pccv"><h6 className="colorblack"></h6><span className="spanccv">{e.ccv}</span></p>
                            <button className="btn btn-outline-danger cardDelete">Delete Card</button>
                        </div>
                    </div>
                )
            setCards(newDataCards);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <>
            <div className="container ">
                <div className="YourCards">
                    <h1 className="TitleCards">Your Cards</h1>
                    {cards}
                </div>
            </div>
        </>
    )
}

export default Card;