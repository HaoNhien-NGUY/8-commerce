import React, { Component, Fragment, useState } from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap'
import RegisterModal from './auth/RegisterModal'
import LoginModal from './auth/LoginModal'
import Logout from './auth/Logout'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { searchPost } from '../actions/postActions'
import { BrowserRouter as Router } from 'react-router-dom'
import './IndexNavbar.css'
import profileLogo from '../img/profile.png'
import searchLogo from '../img/search.png'
import adminLogo from '../img/gear.png'

class IndexNavbar extends Component {
    state = {
        isOpen: false,
        search: '',
        isAdmin: false,
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    render() {

        const { user, isAuthenticated, isLoading } = this.props.auth

        let id = window.location.href.split('/')
        id = id[id.length - 1]

        const authLinks = (
            <Fragment>
                <Router>
                    <NavItem>
                        <span className="navbar-text text-dark">{user ? user.username : null}</span>
                    </NavItem>
                </Router>
            </Fragment>
        )

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <LoginModal />
                </NavItem>
                <NavItem>
                    <RegisterModal />
                </NavItem>
            </Fragment>
        )

        const Example = (props) => {
            const [dropdownOpen, setDropdownOpen] = useState(false);
          
            const toggle = () => setDropdownOpen(prevState => !prevState);
          
            return (
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle id="profileLogo" caret>
                    Dropdown
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Header</DropdownItem>
                  <DropdownItem>Some Action</DropdownItem>
                  <DropdownItem disabled>Action (disabled)</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Foo Action</DropdownItem>
                  <DropdownItem>Bar Action</DropdownItem>
                  <DropdownItem>Quo Action</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            );
        }

        const productsInCart  = 0
        return (
            <div>
                <Navbar color="light" light expand="lg">
                    <NavbarBrand href="/" id="brandName">8-commerce</NavbarBrand>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="#">Homme</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">Femme</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">Accessoires</NavLink>
                        </NavItem>
                    </Nav>
                    <NavLink href="#" id="searchLogo">
                        <img src={searchLogo}/>
                    </NavLink>
                    <Nav>
                        {!isLoading ? isAuthenticated ? authLinks : guestLinks : null}
                    </Nav>
                    <NavLink href="#" id="profileLogo">
                        <img src={profileLogo} />
                    </NavLink>
                    { this.state.isAdmin ?  
                    <NavLink href="#" id="adminLogo">
                        <img src={adminLogo}/>
                    </NavLink> 
                    : null }
                    <NavLink href="#" className="mr-3" id="productsCart">
                        <img src="https://img.icons8.com/windows/32/000000/shopping-bag.png"/>
                        <p className="align-bottom">{productsInCart}</p>
                    </NavLink>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    post: state.post,
    auth: state.auth
})

export default connect(
    mapStateToProps,
    { searchPost }
)(IndexNavbar)
