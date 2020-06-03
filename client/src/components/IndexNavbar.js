import React, { Component, Fragment } from 'react'
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap'
import RegisterModal from './auth/RegisterModal'
import LoginModal from './auth/LoginModal'
import Logout from './auth/Logout'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { searchPost } from '../actions/postActions'
import { BrowserRouter as Router } from 'react-router-dom'

class IndexNavbar extends Component {

    state = {
        isOpen: false,
        search: ''
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    render() {
        const { posts } = this.props.post

        const { user, isAuthenticated, isLoading } = this.props.auth

        let id = window.location.href.split('/')
        id = id[id.length - 1]

        const authLinks = (
            <Fragment>
                <Router>
                    <NavItem>
                        <span className="navbar-text">{user ? `Welcome ${user.email}` : null}</span>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            href={user ? '/' + user._id : null}
                        >
                            Profile
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            href="/search/user/posts/"
                        >
                            Search posts
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <Logout />
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


        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Mern-pool</NavbarBrand>
                    <Nav className="mr-auto" navbar>
                        {!isLoading ? isAuthenticated ? authLinks : guestLinks : null}
                    </Nav>
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
