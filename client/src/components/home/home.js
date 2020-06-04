import React, { useState } from 'react';
import $ from 'jquery';
import { Parallax,Background } from "react-parallax";

const image1 = "https://i.imgur.com/wtIes8O.jpg";


const imageProduit1 = "https://cdn.shopify.com/s/files/1/0017/9686/6113/products/Haerfest-Final-White-Silver-01_large.jpg"; 
const imageProduit2 = "https://cdn.shopify.com/s/files/1/0017/9686/6113/products/Haerfest-Hook-silver-02_large.jpg"


function Home() {
    function changeImgProduit(e) {
       if ( e.target.src == imageProduit2)
         e.target.src = imageProduit1
       else 
         e.target.src = imageProduit2
       
    }
    return (
    <div className="container-fluid h-100 p-0 m-0">
       <Parallax bgImage={image1} strength={500}>
       <div className="HomeJumbotron">
        <div>Bringing our community of visionaries in motion.
        <br/>Together.</div>
      </div>
    </Parallax>    

    <div className="row justify-content-around">
        <div className="col-md-4">
            <div className='ProductHome'>
                <div className='p-4 m-5 bg-gray'>
                    <span className="HomeArticleTItle">Un vetement de taré popopo</span>
                    <p>$30</p>
                    <a href="http://google.fr"> 
                        <div className="ProductHomeImgContainer">
                            <img className="ProductHomeImg" src={imageProduit1}></img>
                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                        </div>
                    </a>
                    <button className='btn-cart'>Add to cart</button>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className='ProductHome'>
                <div className='p-4 m-5 bg-gray'>
                    <span className="HomeArticleTItle">Un vetement de taré popopo</span>
                    <p>$30</p>
                    <a href="http://google.fr"> 
                        <div className="ProductHomeImgContainer">
                            <img className="ProductHomeImg" src={imageProduit1}></img>
                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                        </div>
                    </a>
                    <button className='btn-cart'>Add to cart</button>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className='ProductHome'>
                <div className='p-4 m-5 bg-gray'>
                    <span className="HomeArticleTItle">Un vetement de taré popopo</span>
                    <p>$30</p>
                    <a href="http://google.fr"> 
                        <div className="ProductHomeImgContainer">
                            <img className="ProductHomeImg" src={imageProduit1}></img>
                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                        </div>
                    </a>
                    <button className='btn-cart'>Add to cart</button>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className='ProductHome'>
                <div className='p-4 m-5 bg-gray'>
                    <span className="HomeArticleTItle">Un vetement de taré popopo</span>
                    <p>$30</p>
                    <a href="http://google.fr"> 
                        <div className="ProductHomeImgContainer">
                            <img className="ProductHomeImg" src={imageProduit1}></img>
                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                        </div>
                    </a>
                    <button className='btn-cart'>Add to cart</button>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className='ProductHome'>
                <div className='p-4 m-5 bg-gray'>
                    <span className="HomeArticleTItle">Un vetement de taré popopo</span>
                    <p>$30</p>
                    <a href="http://google.fr"> 
                        <div className="ProductHomeImgContainer">
                            <img className="ProductHomeImg" src={imageProduit1}></img>
                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                        </div>
                    </a>
                    <button className='btn-cart'>Add to cart</button>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className='ProductHome'>
                <div className='p-4 m-5 bg-gray'>
                    <span className="HomeArticleTItle">Un vetement de taré popopo</span>
                    <p>$30</p>
                    <a href="http://google.fr"> 
                        <div className="ProductHomeImgContainer">
                            <img className="ProductHomeImg" src={imageProduit1}></img>
                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                        </div>
                    </a>
                    <button className='btn-cart'>Add to cart</button>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className='ProductHome'>
                <div className='p-4 m-5 bg-gray'>
                    <span className="HomeArticleTItle">Un vetement de taré popopo</span>
                    <p>$30</p>
                    <a href="http://google.fr"> 
                        <div className="ProductHomeImgContainer">
                            <img className="ProductHomeImg" src={imageProduit1}></img>
                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                        </div>
                    </a>
                    <button className='btn-cart'>Add to cart</button>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className='ProductHome'>
                <div className='p-4 m-5 bg-gray'>
                    <span className="HomeArticleTItle">Un vetement de taré popopo</span>
                    <p>$30</p>
                    <a href="http://google.fr"> 
                        <div className="ProductHomeImgContainer">
                            <img className="ProductHomeImg" src={imageProduit1}></img>
                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                        </div>
                    </a>
                    <button className='btn-cart'>Add to cart</button>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className='ProductHome'>
                <div className='p-4 m-5 bg-gray'>
                    <span className="HomeArticleTItle">Un vetement de taré popopo</span>
                    <p>$30</p>
                    <a href="http://google.fr"> 
                        <div className="ProductHomeImgContainer">
                            <img className="ProductHomeImg" src={imageProduit1}></img>
                            <img className="ProductHomeImg ProductHomeImg2" src={imageProduit2}></img>
                        </div>
                    </a>
                    <button className='btn-cart'>Add to cart</button>
                </div>
            </div>
        </div>
        
    </div>
    
    <div className="row justify-content-center">
        <div className="col-2 text-center Pagination"><a href="">1</a> <a href="">2</a> <a href="">3</a> <a href="">→</a></div>
    </div>
    




    
    </div>


    )
}

export default Home;