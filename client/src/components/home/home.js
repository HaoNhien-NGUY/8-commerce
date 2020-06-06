import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';

import { Parallax } from "react-parallax";

const image1 = "https://i.imgur.com/wtIes8O.jpg";


function Home() {

    const [products, setProducts] = useState([]);

    var imageProduit1 = '';
    var imageProduit2 = ''

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/product').then(resp => {            
            //Display Lowest Price Image
            let arr = []
            let products_temp = resp.data.data
            console.log(products_temp.subproducts);
            if(products_temp.subproducts && products_temp.subproducts.length > 0)
            {   
                $.each(products_temp, (index, product) => {
                    product.subproducts.map(item => arr.push(item.price))
                });
                for (let i = 0; i < products_temp.length; i++) {
                    products_temp[i]['lowest_price'] = arr[i];
                }
                setProducts(products_temp)
            }
            
        });
        return () => {
        }
    }, []);
    return (

        <div className="container-fluid h-100 p-0 m-0">
            <Parallax bgImage={image1} strength={500}>
                <div className="HomeJumbotron">
                    <div>We can do anything,
        <br />Together.</div>
                </div>
            </Parallax>

            <div className="row justify-content-around">

                {products.map((e) => {

                    console.log(e)

                    //     if(e.subproducts[0] && e.subproducts[0])
                    //     {
                    //         imageProduit1 = e.subproducts[0].images[0].image; 
                    //         if( e.subproducts[0]) {
                    //             imageProduit2 = e.subproducts[0];
                    //         }
                    //         else {
                    //             imageProduit2 = "https://cdn.shopify.com/s/files/1/0017/9686/6113/products/travel-backpack-large-leather-black-back-grey-haerfest-sidelugagge-carry-on-professional-work_large.jpg"
                    //         }
                    //    }
                    //     else {
                    imageProduit1 = "https://cdn.shopify.com/s/files/1/0017/9686/6113/products/travel-backpack-large-leather-black-front-grey-haerfest-sidelugagge-carry-on-professional-work_large.jpg";
                    imageProduit2 = "https://cdn.shopify.com/s/files/1/0017/9686/6113/products/travel-backpack-large-leather-black-back-grey-haerfest-sidelugagge-carry-on-professional-work_large.jpg";
                    //     }

                    return (
                        <div className="col-md-4" key={e.id}>
                            <div className='ProductHome'>
                                {/* <img src={'../../../../images/1/default/2020-06-0603-16-51.jpg'} />  */}
                                <div className='p-4 m-5 bg-gray'>
                                    <span className="HomeArticleTItle">{e.title}</span>
                                    <p>Starts at {e.lowest_price} €</p>
                                    <a href={"/product/" + e.id}>
                                        <div className="ProductHomeImgContainer">
                                            <img className="ProductHomeImg" src={imageProduit1}></img>
                                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                                        </div>
                                    </a>
                                    <button className='btn-cart'>Add to cart</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="row justify-content-center">
                {/* <div className="col-2 text-center Pagination"><a href="">1</a> <a href="">2</a> <a href="">3</a> <a href="">→</a></div> */}
            </div>
        </div>
    )
}

export default Home;