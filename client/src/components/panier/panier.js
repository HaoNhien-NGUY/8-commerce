import React, { Component, Fragment, useState } from "react";
import axios from "axios";
import { Parallax } from "react-parallax";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkout from './Checkout'


class Panier extends Component {
  constructor() {
    super();
    this.state = {
      productsCart: [],
      prixTotal: 0,
      nombreTotal: 0,
    };
  }

  componentDidMount() {
    const Message = [];
    let panier = JSON.parse(sessionStorage.getItem("panier", []));
    if (panier) {
      panier.map((e) => {
        axios
          .get("http://127.0.0.1:8000/api/subproduct/" + e.productid, {})
          .then((data) => {
            let somme = data.data.price * e.quantite;
            this.setState({ prixTotal: this.state.prixTotal + somme });
            this.setState({ nombreTotal: this.state.nombreTotal + e.quantite });
            axios
              .get(
                "http://127.0.0.1:8000/api/product/" + data.data.product.id,
                {}
              )
              .then((product) => {
                let img = product.data.images.find((o) => o.color_id === data.data.color.id.toString());
                if (img) img = { image: img.links[0] };
                else img = { image: product.data.images[0].links[0] };
                let total = Object.assign(data.data, img);
                let quantity = { quantity: e.quantite };
                total = Object.assign(data.data, quantity);
                this.setState({
                  productsCart: [...this.state.productsCart, total],
                });
              });
            if (e.quantite > data.data.stock) {
              let message = "Maximum quantity for " + data.data.product.title + " is : " + data.data.stock;
              toast.error(message, { position: "top-center" });
            }
          });
      });
    }
  }

  handleChange(e) {
    if (e.value != "") {
      let newprice = 0
      let newtotal = 0
      let somme = 0;
      let products = []
      let panier = [];
      this.state.productsCart.forEach(function (item) {
        if (item.id == e.id) {
          if (e.value > item.stock) {
            let message = "Maximum quantity for " + item.product.title + " is : " + item.stock;
            toast.error(message, { position: "top-center" });
          }
          else {
            item.quantity = parseInt(e.value)
          }
        }
        somme = item.quantity * item.price
        newprice = newprice + somme
        newtotal = newtotal + item.quantity
        panier.push({ 'productid': item.id, "quantite": item.quantity })
        sessionStorage.setItem("panier", JSON.stringify(panier));
        products.push(item)
      });
      this.setState({ productsCart: products, nombreTotal: newtotal, prixTotal: newprice })
    }
  }

  onsuppress(e) {
    let id = e.id.replace("button_", "")
    let newprice = 0
    let newtotal = 0
    let somme = 0;
    let products = []
    let panier = [];
    this.state.productsCart.forEach(function (item) {
      if (item.id != id) {
        somme = item.quantity * item.price
        newprice = newprice + somme
        newtotal = newtotal + item.quantity
        panier.push({ 'productid': item.id, "quantite": item.quantity })
        products.push(item)
        console.log("itemquantity", item.quantity)
        console.log("newtotal", newtotal)
      }
    });
    if (panier.length == 0) {
      sessionStorage.removeItem("panier");
    } else {
      sessionStorage.setItem("panier", JSON.stringify(panier));
    }
    this.setState({ productsCart: products, prixTotal: newprice, nombreTotal: newtotal })
    window.location.reload(true)
  }

  render() {
    const Message = [];
    if (this.state.nombreTotal == 0)
      Message.push(
        <div key="empty-cart" className="statutpanier col m-0 p-4">
          Your cart is currently empty
        </div>
      );
    const productsInCart = this.state.nombreTotal;
    return (
      <div key={this.state.key} className="h-100 container-fluid  m-0 p-0">
        <div className="row h-100 m-0 p-0">
          <div className="col-md-6 m-0 p-3"><Checkout /></div>
          <div className="col-md-6 order-first order-lg-last order-md-first order-sm-first productImgBg m-0 p-3">
            <ToastContainer />
            <div id="LargeCart" className="LargeCart">
              <h2>See your cart</h2>
              <hr />
              {Message}
              <table >
                {this.state.productsCart != [] &&
                  this.state.productsCart.map((e) => {
                    return (
                      <tbody key={"tbody" + e.id} className="bitch">
                        <tr>
                          <td rowSpan="2" className="tableborder ImageCart">
                            <img
                              className=""
                              src={"http://127.0.0.1:8000" + e.image}
                            />
                          </td>
                          <td className="productcarttitle">
                            <a href={"/product/" + e.product.id}>
                              {e.product.title}
                            </a>
                            <button value={e.id} id={"button_" + e.id} className="supbtn" onClick={e => this.onsuppress(e.target)}>X</button>
                          </td>
                        </tr>
                        <tr className="tableborder">
                          <td className="detailsproduct">
                            <div>price: {e.price}€<br />size: {e.size}</div>
                            <div>color: {e.color.name}<br />
                              quantity:
                                <input
                                type="number"
                                id={e.id}
                                name="tentacles"
                                defaultValue={e.quantity}
                                onChange={e => this.handleChange(e.target)}
                                min="1"
                                max="20"
                              ></input>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
              </table>
              <div className="total">
                <span>{this.state.nombreTotal} {this.state.nombreTotal > 1 ? 'produits' : 'produit'}</span>
                <span>Total : {this.state.prixTotal} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Panier;