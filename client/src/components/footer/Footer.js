import React, { Component } from 'react';

export default class Footer extends Component {


  render() {
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-1 footer-link">
              <p>Shop</p>
              <a href='/'>
                New Arrivals
              </a>
              <a href='/'>
                Best Sellers
              </a>
              <a href='/'>
                Gift Guide
              </a>
              <a href='/'>
                Sales
              </a>
              <a href='/'>
                Visit Us
              </a>
            </div>

            <div className="col-1 footer-link">
              <p>Explore</p>
              <a href='/'>
                About Us
              </a>
              <a href='/'>
                Collaborations
              </a>
              <a href='/'>
                Product Care
              </a>
              <a href='/'>
                Stories
              </a>
              <a href='/'>
                Lookbooks
              </a>
            </div>

            <div className="col-1 footer-link">
              <p>More</p>
              <a href='/'>
                My Account
              </a>
              <a href='/'>
                Custom Orders
              </a>
              <a href='/'>
                Size Guide
              </a>
              <a href='/'>
                Careers
              </a>
              <a href='/'>
                Contact
              </a>
            </div>

            <div className="ml-auto col-2">
              <p className="newsletter-font">Exclusive benefits</p>
              <input className="newsletter-input" type="email" placeholder="Enter email here →"></input>
              <p className="newsletter-font my-3">Apply for our free membership to receive exclusive deals, news and events.</p>
            </div>
          </div>
        </div>

        <div className="footer-link-sm my-4">
          <a href='/'>
            ©8-commerce 2020
          </a>
          <a href='/'>
            Terms of Service
          </a>
          <a href='/'>
            Privacy Policy
          </a>
          <a href='/'>
            Shipping and Returns
          </a>
          <a href='/'>
            FAQ
          </a>
        </div>
      </>
    )
  }
}
