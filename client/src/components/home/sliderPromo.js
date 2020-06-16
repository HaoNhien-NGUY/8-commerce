import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import './sliderPromo.css';


export default function SliderPromo() {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState([]);
  const [isDataReady, setDataReady] = useState(false);
    
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    let jsonRequest = {
      "promoted": true
    }

    const header = { "Content-Type": "application/json" };

    axios
      .get(
        "http://localhost:8000/api/product?promoted=true"
      )
      .then(res => {
        console.log(res.data.data);
        setData(res.data.data);
        setDataReady(true);

        console.log(data);
      })
  }, [isDataReady])  

  let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";

  const SliderData = data.map(product => {
    return (<div className="slider-bg text-center m-auto row p-3">
          <div className="col-2"></div>
          <div className="col-4">
            <img src={product.images && product.images[0] ? process.env.REACT_APP_API_LINK + product.images[0]  : imageDefault} className="img-div p-3"/>
          </div>
          <div className="col-4 text-left">
            <h1 className="">{product.title}</h1>
            <p>{product.description}</p>
            <a href={"/product/" + product.id}><button className='btn-cart'>View Product</button></a>
          </div>
          <div className="col-2"></div>
          <img src={product.images && product.images[0] ? process.env.REACT_APP_API_LINK + product.images[0]  : imageDefault} className="slider-bg blur-bg"/>
    </div>
  )})

  return (
    <div className='container-fluid' id="slider">
      <AwesomeSlider>
        {SliderData}
      </AwesomeSlider>
    </div>
  )
}
