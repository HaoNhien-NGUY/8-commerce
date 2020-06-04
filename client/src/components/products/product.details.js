import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { useRouteMatch } from "react-router-dom";
import ReactImageMagnify from 'react-image-magnify';

function ProductDescription() {
    const [product, setProduct] = useState([]);
    const [chosenProductSize, setChosenProductSize] = useState('');
    const [chosenProductColor, setChosenProductColor] = useState('');
    const [chosenSubProduct, setChosenSubProduct] = useState();

    //tant que taille et couleur ne sont pas choisies, ne pas afficher de prix...

    let id = useRouteMatch("/product/:id").params.id;
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/product/' + id).then(resp => {
            setProduct(resp.data);
        });
        return () => {
        }
    }, []);

    console.log(product)
    const [completeDes, setCompleteDes] = useState('.. More ⇒');
    const imageProduct = [];
    const miniImageProduct = [];
    const loadingScreen = [];
    let propsImage = {}
    let countstockAll = 0;
    let SizeOption = [];
    let ColorOption = [];
    let testProps = "";

    if (product.length == 0) {
        loadingScreen.push(<div className="loading-screen"></div>);
    }
    else {
        testProps = product.description;
        let count = 0;
        for (let i = 0; i < product.subproducts.length; i++) {
            countstockAll = countstockAll + product.subproducts[i].stock;
            if (!(SizeOption.find(fruit => fruit.props.value === product.subproducts[i].size)))
                SizeOption.push(<option value={product.subproducts[i].size}>{product.subproducts[i].size}</option>);

            if (!(ColorOption.find(fruit => fruit.props.value === product.subproducts[i].color)))
                ColorOption.push(<option value={product.subproducts[i].color}>{product.subproducts[i].color}</option>);

            for (let j = 0; j < product.subproducts[i].images.length; j++) {
                propsImage["img-" + count] = product.subproducts[i].images[j].image;
                count++;
            }
        }
    }

    const details = {
        title: product.title,
        price: product.price,
        description_1: testProps.substr(0, 192),
        description_2: testProps.substr(192)
    };

    const CheckSize = (e) => {
        e.preventDefault()
        let test = product.subproducts.find(fruit => fruit.size === e.target.value)
    }

    for (let [key, value] of Object.entries(propsImage)) {
        const ref = React.createRef();
        const handleClick = () =>
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        imageProduct.push(<span ref={ref}><ReactImageMagnify {...showImage(value)} /></span>);
        miniImageProduct.push(<li onClick={handleClick}><img className='imgIcone' src={value} /></li>);
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

    const setChosenProduct = async () => {
        console.log('Seeting chosen product')
        await setChosenProductColor('') //permet de ne pas boucler inf
        await setChosenSubProduct(product.subproducts.filter(item => item.size == chosenProductSize && item.color == chosenProductColor)[0])
    }

    const verifyIfAProductIsChosen = () => {
        console.log(chosenSubProduct)
        if (chosenSubProduct && chosenSubProduct != null && Object.keys(chosenSubProduct).length > 0) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div id="maincontainer" className="container-fluid m-0 p-0">
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
                            <h3 className='prix'>{verifyIfAProductIsChosen() ? chosenSubProduct.price : details.price} €</h3> 
                            {/* le code pour afficher le produit choisit  {verifyIfAProductIsChosen() ? chosenSubProduct.price : details.price}   */}
                            <p className='description'>
                                {details.description_1}
                                <span className='complete'>{details.description_2}</span>
                            </p>
                            <p className="more" onClick={Complete}>{completeDes}</p>
                            <p>il reste {verifyIfAProductIsChosen() ? chosenSubProduct.stock : countstockAll} pièces disponibles</p>
                         {chosenProductSize != '' && chosenProductColor != '' ? setChosenProduct() : ''}
                          
                            <select id='selectSize' onChange={e => e.preventDefault() + setChosenProductSize(e.target.value) + console.log('size')}>
                                <option value='' className='selectChoice'>--- SIZE ---</option>
                                {SizeOption}
                                {/* <option value='S'>S</option>
                                <option value='M'>M</option>
                                <option value='L'>L</option>
                                <option value='XL'>XL</option> */}
                            </select>

                            <select id='selectColor' onChange={e => e.preventDefault() + setChosenProductColor(e.target.value) + console.log('color')}>
                                <option value='' className='selectChoice'>--- COLOR ---</option>
                                {ColorOption}

                                {/* <option value='black'>Black</option>
                                <option value='white'>White</option>
                                <option value='grey'>Grey</option>
                                <option value='khaki'>Khaki</option> */}
                            </select>

                            <button className='btn-cart'>Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <br /> <br /> <br /> <br /> <br /> <br /> <br />   <br /> <br /> <br /> <br /> <br /> <br /> <br />   <br /> <br /> <br /> <br /> <br /> <br /> <br />
            </div>
        </div>
    )
}

export default ProductDescription;  