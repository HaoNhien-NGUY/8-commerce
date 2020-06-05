import React, { Component } from 'react'
import {BrowserRouter as Router, 
  Link
} from "react-router-dom";
import "./AdminAllProducts.css";
import axios from 'axios';

export default class AdminAllProducts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      products: []
    }
  }

  componentDidMount() {
    axios.get("http://localhost:8000/api/product")
    .then(res => {
      const products = res.data;
      this.setState({ products });    
    })
    .catch(error => {
      console.log(error.response)
    });
    
  }
  

  render() {
    const products = this.state.products; 
    console.log(products)

    const content = products.map((product) =>
      // <div key={post.id}>
      //   <h3>{post.title}</h3>
      //   <p>{post.content}</p>
      // </div>
      // <div>
      <div>
        <p className="m-2 align-items-center">{product.id}</p>
        <p className="m-2">{product.title}</p>
        <p className="m-2">{product.price} €</p>
        <p className="m-2">{product.sex}</p>
        <button className="btn btn-outline-dark m-2">Modify</button>
        <button className="btn btn-outline-dark m-2">Delete</button>
      </div>
    );
    // return (
    //   <div>
    //     {sidebar}
    //     <hr />
    //     {content}
    //   </div>
    // );


      return (
        <>
          <div className="container">
            <h1 className="mb-5">
              <img src="https://img.icons8.com/windows/32/000000/speedometer.png"/> ADMIN - Dashboard
            </h1>

            <div className="row justify-content-end mb-2">
              <h3 className="mr-auto ml-2">All Products</h3>
              <button className="btn btn-dark">
                + New Product
              </button>
            </div>
            <Router>
              <div className="row border p-2">
                <Link href="#" className="ProductRow">
                  {content}
                {/* <div>
                  <p className="m-2 align-items-center">{item.id}</p><p className="m-2">{item.title}</p><p className="m-2">{item.title} €</p><p className="m-2">{item.sex}</p><button className="btn btn-outline-dark m-2">Modify</button><button className="btn btn-outline-dark m-2">Delete</button>
                </div> */}
                </Link>
              </div>
            </Router>
          </div>
        </>
      )
    // })

    // return test;
  }
}
