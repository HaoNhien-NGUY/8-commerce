import React, { useState } from 'react';
import $ from 'jquery';

function ProductDescription() {
    const [completeDes, setCompleteDes] = useState('.. More ⇒');

    function Complete(e) {
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
            <div className='divProduct'>
                <div className='col-md-7 divImages'>
                        <ul className='ulImgProduct position-fixed'>
                            <li><img className='imgIcone' src='https://cdn.shopify.com/s/files/1/0017/9686/6113/products/2-Maroon-1-Backpack-haerfest-harvest-work-bag-laptop-travel-1-Side_900x.jpg?v=1576703571'/></li>
                            <li><img className='imgIcone' src='https://cdn.shopify.com/s/files/1/0017/9686/6113/products/2-Maroon-1-Backpack-haerfest-harvest-work-bag-laptop-travel-2-Front_900x.jpg?v=1576703583'/></li>
                            <li><img className='imgIcone' src='https://cdn.shopify.com/s/files/1/0017/9686/6113/products/2-Maroon-1-Backpack-haerfest-harvest-work-bag-laptop-travel-3-Back_900x.jpg?v=1576703571'/></li>
                        </ul>
                    <div className='scroll'>
                        <img className='imgScroll' src='https://cdn.shopify.com/s/files/1/0017/9686/6113/products/2-Maroon-1-Backpack-haerfest-harvest-work-bag-laptop-travel-1-Side_900x.jpg?v=1576703571'/>
                        <img className='imgScroll' src='https://cdn.shopify.com/s/files/1/0017/9686/6113/products/2-Maroon-1-Backpack-haerfest-harvest-work-bag-laptop-travel-2-Front_900x.jpg?v=1576703583'/>
                        <img className='imgScroll' src='https://cdn.shopify.com/s/files/1/0017/9686/6113/products/2-Maroon-1-Backpack-haerfest-harvest-work-bag-laptop-travel-3-Back_900x.jpg?v=1576703571'/>
                    </div>
                </div>

                <div className='col-md-5'>
                    <div className='divDetails position-fixed'>
                        <spam>Path/to/category/article</spam>
                        <h1>Title Article</h1>
                        <h3 className='prix'>$300</h3>
                        <p className='description'>Everything you need for your day and night. The Apollo Backpack seamlessly transitions between day night giving you the functionality and space you need for your work and the style you curate.
                        <span className='complete'> You’ll want the Apollo Backpack if your schedule is packed with a lot of different activities. It’s perfect for the office and back, but also for your morning gym session, your hydration needs as well as your night out in town. All in a good day’s work.</span></p>

                        <p class="more" onClick={Complete}>{completeDes}</p>
                        
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
    )
}

export default ProductDescription;