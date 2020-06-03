import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import ReactImageMagnify from 'react-image-magnify';

function ProductDescription() {
    let testProps = 'Everything you need for your day and night. The Apollo Backpack seamlessly transitions between day night giving you the functionality and space you need for your work and the style you curate. You’ll want the Apollo Backpack if your schedule is packed with a lot of different activities. It’s perfect for the office and back, but also for your morning gym session, your hydration needs as well as your night out in town. All in a good day’s work.';
    const propsImage = {
        img1: 'https://cdn.shopify.com/s/files/1/0017/9686/6113/products/2-Maroon-1-Backpack-haerfest-harvest-work-bag-laptop-travel-1-Side_900x.jpg?v=1576703571',
        img2: 'https://cdn.shopify.com/s/files/1/0017/9686/6113/products/2-Maroon-1-Backpack-haerfest-harvest-work-bag-laptop-travel-2-Front_900x.jpg?v=1576703583',
        img3: 'https://cdn.shopify.com/s/files/1/0017/9686/6113/products/2-Maroon-1-Backpack-haerfest-harvest-work-bag-laptop-travel-3-Back_900x.jpg?v=1576703571'
    }

    const [completeDes, setCompleteDes] = useState('.. More ⇒');
    const imageProduct = [];
    const miniImageProduct = [];
    const details = {
        title: 'Title Article',
        price: '$300',
        description_1: testProps.substr(0, 192),
        description_2: testProps.substr(192)
    };

    for (let [key, value] of Object.entries(propsImage)) {
        imageProduct.push(<ReactImageMagnify { ...showImage(value) }/>);
        miniImageProduct.push(<li><img className='imgIcone' src={value}/></li>);
    }

    function showImage(pathImg) {
        const imageProps = {
            smallImage: {
                alt: 'Phasellus laoreet',
                isFluidWidth: true,
                src: pathImg
            },
            largeImage: {
                src: pathImg,
                width: 2000,
                height: 1800
            },
            enlargedImageContainerStyle: { background: '#fff', zIndex: 9 },
            className: 'sizeImage imgScroll'
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
        <div>
            <div className='row'>
                <div className='divProduct'>
                    <div className='col-md-7 divImages'>
                            <ul className='ulImgProduct'>
                                {miniImageProduct}
                            </ul>
                        <div className='scroll'>
                            {imageProduct}
                        </div>
                    </div>

                    <div className='col-md-5'>
                        <div className='divDetails'>

                            <span>Path/to/category/article</span>
                            <h1>{details.title}</h1>
                            <h3 className='prix'>{details.price}</h3>
                            <p className='description'>
                                {details.description_1}
                                <span className='complete'>{details.description_2}</span>
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
                <h1>deded</h1>
                <h1>deded</h1>
                <h1>deded</h1>
                <h1>deded</h1>
                <h1>deded</h1>
                <h1>deded</h1>
                <h1>deded</h1>
                <h1>deded</h1>
            </div>
        </div>
    )
}

export default ProductDescription;