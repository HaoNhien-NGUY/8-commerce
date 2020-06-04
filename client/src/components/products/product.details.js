import React, { useState, useEffect,useRef } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { useRouteMatch } from "react-router-dom";
import ReactImageMagnify from 'react-image-magnify';

function ProductDescription() {
    
   
    const [product, setProduct] = useState([]);
    let id = useRouteMatch("/product/:id").params.id;

    useEffect(() => {  
    axios.get('http://127.0.0.1:8000/api/product/'+ id).then(resp => {
        setProduct(resp.data);
        });
        return () => {
        }
    }, []);
   
    const [completeDes, setCompleteDes] = useState('.. More ⇒');
    const imageProduct = [];
    const miniImageProduct = [];
    const loadingScreen = [];

    const details = {
        title: product.title,
        price: product.price,
        description: product.description,
        // description_1: testProps.substr(0, 192),
        // description_2: testProps.substr(192)
    };

    let propsImage = {}
    if (product.length == 0)
    {
      loadingScreen.push(<div className="loading-screen"></div>);  
    }
    else {
       let count= 0;
        for (let i = 0; i < product.subproducts.length; i++)
        {
            for (let j = 0; j < product.subproducts[i].images.length; j++)
            {
                propsImage["img-"+count] = product.subproducts[i].images[j].image;
                count++;
            }
        }
    }

    
    for (let [key, value] of Object.entries(propsImage)) {
        const ref = React.createRef();
 
        const handleClick = () =>
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

        imageProduct.push(<span ref={ref}><ReactImageMagnify { ...showImage(value) }/></span>);
        miniImageProduct.push(<li onClick={handleClick}><img className='imgIcone' src={value}/></li>);
        console.log(key)
    }

    function showImage(pathImg) {
        const imageProps = {
            smallImage: {
                alt: '',
                isFluidWidth: true,
                src: pathImg
            },
            largeImage: {
                src: pathImg,
                width: 2200,
                height: 2200
            },
            enlargedImageContainerStyle: { background: '#fff', zIndex: 9 },
            className: 'imgScroll',
            imageClassName: 'styleImage'
        };

        return imageProps;
    }

    function Complete() {
        $('.complete').slideToggle('fast');
        if (completeDes == ".. More ⇒") {
            setCompleteDes('Less ⇐');
        }
        else if (completeDes == "Less ⇐") {
            setCompleteDes('.. More ⇒');
        }
    }

    return (
        <div id="maincontainer" className="container-fluid">
            {loadingScreen}
            <div className=''>
                <div className='divProduct'>
                    <div className='col-md-7 divImages'>
                            <ul className='ulImgProduct'>
                                {miniImageProduct}
                            </ul>
                        <div className=''>
                            {imageProduct}
                        </div>
                    </div>
                    <div className='col-md-5 bg-white'>
                        <div className='divDetails'>
                            <span>Path/to/category/article</span>
                            <h1>{details.title}</h1>
                            <h3 className='prix'>{details.price} €</h3>
                            <p className='description'>
                                {/* {details.description_1}
                                <span className='complete'>{details.description_2}</span> */}
                                {details.description}
                            </p>
                            <p className="more" onClick={Complete}>{completeDes}</p>
                            <select id='selectSize'>
                                <option value='' className='selectChoice'>--- SIZE ---</option>
                                <option value='S'>S</option>
                                <option value='M'>M</option>
                                <option value='L'>L</option>
                                <option value='XL'>XL</option>
                            </select>

                            <select id='selectColor'>
                                <option value='' className='selectChoice'>--- COLOR ---</option>
                                <option value='black'>Black</option>
                                <option value='white'>White</option>
                                <option value='grey'>Grey</option>
                                <option value='khaki'>Khaki</option>
                            </select>

                            <button className='btn-cart'>Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
               <br/> <br/> <br/> <br/> <br/> <br/> <br/>   <br/> <br/> <br/> <br/> <br/> <br/> <br/>   <br/> <br/> <br/> <br/> <br/> <br/> <br/>
            </div>
        </div>
    )
}

export default ProductDescription;