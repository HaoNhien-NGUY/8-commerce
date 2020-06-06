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
import { Spinner } from 'react-bootstrap'
import CreateColor from './CreateColor';

const AccessCreateColor = ({auth}) => {
  
  if (!auth.authenticated && !auth.isLoading) {
    if(auth.user !== null && auth.user.role === 'admin')
    {
        return(
            <CreateColor />
        )
    }
    else
    {
       return(<div id='error403'> <h2> Error page 403 access forbiden </h2></div>)
    }
  }
  else
  {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <Spinner style={{ top: '33%', margin: '0', position: 'absolute' }} className="" animation="grow" />
        </div>
      </div>
    )
  }

}

AccessCreateColor.propTypes = {
    auth: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(AccessCreateColor)