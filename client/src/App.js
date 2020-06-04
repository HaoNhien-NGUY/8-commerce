import React from 'react';
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/authActions'
import { Container } from 'reactstrap'
import IndexNavbar from './components/IndexNavbar'
import UserPosts from './components/posts/UserPosts'
import PostDetail from './components/posts/PostDetail'
import SearchPost from './components/posts/SearchPost'
import UserList from './components/user/UserList'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Product from './components/products/product.details'
import Home from './components/home/home'
import Admin from './components/Admin/Admin'
import NotFound from './components/NotFound/NotFound'

class App extends React.Component {

    async componentDidMount() {
        if(localStorage.getItem('token')) await store.dispatch(loadUser());

    }

    render() {
        console.log(store.getState().auth);
        return (
            //<Product />
            
            <Provider store={store}>
                <Router>
                <IndexNavbar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/product/:id" component={Product} />
                        <Route exact path="/admin" component={Admin} />
                        <Route path='*' exact={true} component={NotFound} />
                    </Switch>
                </Router>
            </Provider>
        
        )
    }
}

export default App;