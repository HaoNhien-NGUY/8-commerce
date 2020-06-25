import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Parallax, Background } from "react-parallax";
import SliderPromo from './sliderPromo'
import videoSource from "../../img/total.mp4";
import walkingvideo from "../../img/walking.mp4";
import techlab1 from "../../img/techlab1.mp4";
import backpack from "../../img/crofton.png";
import Footer from '../footer/Footer';



const image1 = "https://i.imgur.com/wtIes8O.jpg";
function Home() {

    const [products, setProducts] = useState([]);
    let imageDefault = "https://i.ibb.co/j5qSV4j/missing.jpg";
    let nbrArctPop = 6;

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_LINK + '/api/product?clicks=true&limit=' + nbrArctPop).then(resp => {
            //Display Lowest Price Image
            let prices = {}
            let promos = {}
            let products_temp = resp.data.data
            let unavailable_msg = 'Available Soon...'
            $.each(products_temp, (i, product) => {
                prices[product.id] = []
                promos[product.id] = []
                if (isEmpty(product.subproducts)) {
                    //Product doesnt have subproducts, display unavailable_msg
                    prices[product.id].push(unavailable_msg)
                } else {
                    //Product has subproducts
                    product.subproducts.map(p => {
                        prices[product.id].push(p.price)
                        if (p.promo > 0) {
                            promos[product.id].push(p.promo)
                        }
                    })
                }
            })

            //Boucler sur l'objet pour voir si il y a un prix minimal ou si il n'est pas disponible
            if (Object.keys(prices).length > 0) {
                const entries = Object.entries(prices)
                for (const [id, prices_list] of entries) {
                    for (let j = 0; j < products_temp.length; j++) {
                        if (products_temp[j].id == id) {
                            if (prices_list[0] == unavailable_msg) {
                                products_temp[j]['lowest_price'] = unavailable_msg
                            } else {
                                let price = Math.min.apply(Math, prices_list)
                                if (isEmpty(promos[id])) {
                                    products_temp[j]['lowest_price'] = 'Starts at ' + price + ' €'
                                }
                                else {
                                    //let promo = (price) - (price * (promos[id] / 100))
                                    products_temp[j]['lowest_price'] = <span>Starts at {products_temp[j].price} € <s className="text-danger">{products_temp[j].basePrice} €</s></span>
                                }
                            }
                        }
                    }
                }
            }
            setProducts(products_temp)
        });
        return () => {
        }
    }, []);

    const isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    return (
        <div className="container-fluid  bg-gray p-0 m-0">
            <Parallax strength={500}>
                <div className="HomeJumbotron firstJumbo">
                    <div>be the change.</div>
                </div>
                <Background className="custom-bg">
                    <video autoPlay="autoplay" loop="loop" muted className="" >
                        <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
                </Background>
            </Parallax >

            <div className="row  justify-content-center  m-0 mt-5 p-0">
                <div className="bloc_1_home">
                    <div className='bloc_a'>
                        <div>
                            <div className="frame"></div>
                            <span>Discover the techlab</span>

                            <video autoPlay="autoplay" loop="loop" muted className="" >
                                <source src={techlab1} type="video/mp4" />
                                 Your browser does not support the video tag.
                        </video>
                        </div>
                    </div>
                    <a href="/search?subcategory=Jacket" className="linkwhite bloc_b"><img src={backpack} /> <div><span>Crofton 30L</span> <p>Discover the techlab</p></div></a>
                    <div className="bloc_c">

                        <div className="box_1">
                            <a href="/product/8" className="linkwhite "> <span>New<br /> Jackets</span></a>
                        </div>
                        <div className="box_2">
                            <div><span>Plant the change</span>
                                <p>for every 120$ purchase<br />1 tree will be planted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center align-items-center bloc_2_home m-0 mt-5 mb-5 p-0">
                <div className="col-md-1 m-0">
                    <title_home>Categories</title_home>
                </div>
                <div className="col-md-8 m-0">
                    <div className="row categories_home justify-content-center">
                        <a href="/search?subcategory=Jacket"><div className="jacket"><p>Jacket</p></div></a>
                        <a href="/search?subcategory=Backpack"><div className="backpack"><p>Backpack</p></div></a>
                        <a href="/search?subcategory=Sweatshirt"><div className="sweatshirt"><p>Sweatshirt</p></div></a>
                        <a href="/search?subcategory=Bag"><div className="bag"><p>Handbags</p></div></a>
                    </div>
                    {/* <div className="row justify-content-center"><a href="/search">See More</a></div> */}
                </div>
            </div>
            <div className="row justify-content-center m-0 p-0 pt-3">
                <SliderPromo />
            </div>
            <div className="row m-0 mt-5 p-0 justify-content-center">
                <div className="col-md-8 trending p-0 m-0">
                    <title_home>Trending Now</title_home>
                    <div className="homemadejumbo">
                        <div className="text_box">
                            <h3>M86 Fieldproof Shirt</h3>
                            <h4>UV resistant, sweatproof</h4>
                            <a href="/http://localhost:4242/product/12">shop now</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row bg-gray m-0 p-0 justify-content-center">
                <div className="col-md-9 m-0 p-4">
                    <div className="row m-0 p-0 ">

                        {products.map((e) => {
                            return (
                                <div className="col-md-4 m-0 p-0" key={e.id}>
                                    <div className='m-4'>
                                        <span className="HomeArticleTItle">{e.title.length > 50 ? e.title.substr(0, 50) + '...' : e.title}</span>
                                        <p>{e.lowest_price}</p>
                                        {e.images && e.status === true &&
                                            <> <a href={"/product/" + e.id}>
                                                <div className="ProductHomeImgContainer">
                                                    {<img className="ProductHomeImg" src={e.images ? process.env.REACT_APP_API_LINK + '' + e.images[1] : imageDefault}></img>}
                                                    {<img className="ProductHomeImg ProductHomeImg2" src={e.images && e.images.length > 1 ? process.env.REACT_APP_API_LINK + '' + e.images[0] : imageDefault}></img>}
                                                </div>
                                            </a>
                                                <a href={"/product/" + e.id}><button className='btn-cart'>View Product</button></a>
                                            </>
                                        }
                                        {e.images && e.status === false &&
                                            <> <a href={"/product/" + e.id}>
                                                <div className="ProductHomeImgContainer unavailable">
                                                    <img className="ProductHomeImg" src={process.env.REACT_APP_API_LINK + '' + e.images[0]}></img>
                                                    {e.images && e.images.length > 1 &&
                                                        <img className="ProductHomeImg ProductHomeImg2" src={process.env.REACT_APP_API_LINK + '' + e.images[1]}></img>
                                                    }
                                                </div>
                                            </a>
                                                <a href={"/product/" + e.id}> <button className='btn-cart unavailable' disabled>Product unavailable</button></a>
                                            </>
                                        }
                                        {!e.images &&
                                            <>
                                                <img className="ProductHomeImg" src="https://etienneetienne.com/wp-content/uploads/2013/08/square-blank.png"></img>
                                                <button className='btn-cart unavailable' disabled>Coming Soon</button>
                                            </>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="row m-3 seemore justify-content-center"><span><a href="/search">see more</a></span></div>
                </div>
            </div>
            <Parallax strength={500}>
                <div className="HomeJumbotron">
                    <div>We can do anything,
                    <br />Together.</div>
                </div>
                <Background className="custom-bg">
                    <video autoPlay="autoplay" loop="loop" muted className="" >
                        <source src={walkingvideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                </Background>
            </Parallax >




            <div className="row m-0 p-0 p-5 bg-light justify-content-center">  <Footer /></div>
        </div >
    )
}

export default Home;