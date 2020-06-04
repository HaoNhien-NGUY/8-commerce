import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import PropTypes from "prop-types";
import './AccessUpdateProduct.css';
import UpdateProduct from './UpdateProduct';

const AccessUpdateProduct = ({auth}) => {
  
  if(!auth.authenticated)
  {
    if(auth.user !== null && auth.user.role === 'admin')
    {
        return(
            <UpdateProduct />
        )
    }
    else
    {
       return(<div id='error403'> <h2> Error page 403 access forbiden </h2></div>)
    }
  }
  else
  {
      return(<div>Loading...</div>)
  }

}

AccessUpdateProduct.propTypes = {
    auth: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(AccessUpdateProduct)