import React, { Component } from "react";
import axios from "axios";

export default class Footer extends Component {
  constructor() {
    super();

    this.state = {
      subcategories: null,
    };
  }

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_API_LINK + "/api/subcategory/")
      .then((res) => {
        console.log(res.data);
        // this.setState({ subcategories: res.data });

        let results = res.data.map((subcat, index) => {
          let name = subcat.name.charAt(0).toUpperCase() + subcat.name.slice(1);
          if (index < 8)
            return (
              <a href={"/search?subcategory=" + name} key={subcat.id}>
                {name}
              </a>
            );
        });

        this.setState({ subcategories: results });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  render() {
    const subcategories = this.state.subcategories;

    return (
      <>
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-1 footer-link">
              <p>Shop</p>
              {subcategories}
            </div>

            <div className="col-1 footer-link">
              <p>Explore</p>
              <a href="/">About Us</a>
              <a href="/">Collaborations</a>
              <a href="/">Product Care</a>
              <a href="/">Stories</a>
              <a href="/">Lookbooks</a>
            </div>

            <div className="col-1 footer-link">
              <p>More</p>
              <a href="/user?content=shipping">My Account</a>
              <a href="/user?content=history">Custom Orders</a>
              <a href="/">Size Guide</a>
              <a href="/">Careers</a>
              <a href="/">Contact</a>
            </div>

            <div className="ml-auto col-5 text-center">
              <a
                className="twitter-timeline"
                data-width="500"
                data-height="400"
                data-theme="light"
                href="https://twitter.com/Timberland?ref_src=twsrc%5Etfw"
              >
                Tweets by Timberland
              </a>
            </div>
          </div>
        </div>

        <div className="footer-link-sm my-2">
          <a href="/">©8-commerce 2020</a>
          <a href="/">Terms of Service</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Shipping and Returns</a>
          <a href="/">FAQ</a>
        </div>
      </>
    );
  }
}
