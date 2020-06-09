import React, { Component } from 'react'
import $ from 'jquery'
import axios from 'axios'
import './SuggestionSearch.css'
import { Dropdown, Form, Button, FormControl } from "react-bootstrap";

export default class SuggestionSearch extends Component {
  constructor() {
    super()

    this.state = {
      input: '',
      show: false
    }

    this.handleInput = this.handleInput.bind(this)
  }

  async handleInput(e) {
    await this.setState({input: e.target.value})
      
    if (this.state.input) {
      this.setState({show: true}) 
      this.getSuggestions()
    } 
    else {
      this.setState({show: false})
    } 
  }

  getSuggestions() {
    let request = {
      search: this.state.input
    }

    const header = { "Content-Type": "application/json" };

    axios
      .post("http://localhost:8000/api/product/search", request, {headers: header})
      .then((res) => {
        console.log(res.data);
        // this.setState({ categories: res.data.data, isCategoryReady: true, isResultsReady: false });

        // res.data.data.map(cat => {
        //   if ( this.state.category == cat.name ) {
        //     this.setState({ subcategories: cat.subCategories, isCategoryReady: true });
        //   }
        // })
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  // componentDidUpdate(this.state.isOpen) {
  //   if (this.state.input) {
  //     this.setState({show: true}) 
  //   } 
  //   else {
  //     this.setState({show: false})
  //   } 
  //   this.getSuggestions()
  // }
  

  render() {    
    const show = this.state.show

    const imgRef = "https://cdn.shopify.com/s/files/1/0745/1299/products/40l.jpg?v=1582732692"

    return (
      <div>
        {/* <div className="card border-dark" id="global-div">
          Test<br/>
          TEST
        </div> */}
          {/* <Dropdown.Toggle id="dropdown-custom-components"> */}
          {/* <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components"> */}
            <Form inline>
              <FormControl type="text" placeholder="Quick Search" className="mr-sm-2" onChange={this.handleInput}  />
            </Form>
          {/* </Dropdown.Toggle> */}

        <Dropdown>
          <Dropdown.Menu id="dropdown" show={show}>
          {/* <Dropdown.Menu as={CustomMenu}> */}
            <Dropdown.Header>Products</Dropdown.Header>
            <Dropdown.Item eventKey="1"><img src={imgRef} className="img_sugg mr-2"></img>Red</Dropdown.Item>
            <Dropdown.Item eventKey="2"><img src={imgRef} className="img_sugg mr-2"></img>Blue</Dropdown.Item>
            <Dropdown.Item eventKey="3"><img src={imgRef} className="img_sugg mr-2"></img>Orange</Dropdown.Item>
            
            <Dropdown.Header>Categories</Dropdown.Header>
            <Dropdown.Item eventKey="4">Haut</Dropdown.Item>
            <Dropdown.Item eventKey="5">Bas</Dropdown.Item>
            <Dropdown.Item eventKey="6">Accessories</Dropdown.Item>

            <Dropdown.Header>Subcategories</Dropdown.Header>
            <Dropdown.Item eventKey="4">T Shirt</Dropdown.Item>
            <Dropdown.Item eventKey="5">Pull</Dropdown.Item>
            <Dropdown.Item eventKey="6">Sweat</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}