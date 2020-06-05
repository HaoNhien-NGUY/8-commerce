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
import AccessCreateCategory from './components/Admin/CreateCategory/AccessCreateCategory'
import AccessCreateSubCategory from './components/Admin/CreateCategorySub/AccessCreateSubCategory'
import AccessCreateProduct from './components/Admin/CreateProduct/AccessCreateProduct'
import AccessUpdateProduct from './components/Admin/UpdateProduct/AccessUpdateProduct'
import AccessCreateSubProduct from './components/Admin/CreateSubProduct/AccessCreateSubProduct'
import SubProductInterface from './components/Admin/SubProduct/SubProductInterface'
import AccessUpdateSubProduct from './components/Admin/UpdateSubProduct/AccessUpdateSubProduct'


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
                        <Route exact path="/admin/subproduct/:id" component={SubProductInterface} />
                        <Route exact path="/admin/subproduct/:id/create" component={AccessCreateSubProduct} />
                        <Route exact path="/admin/subproduct/:id/update" component={AccessUpdateSubProduct} />
                        <Route exact path="/admin/create" component={AccessCreateProduct} />
                        <Route exact path="/admin/createCategory" component={AccessCreateCategory} />
                        <Route exact path="/admin/createSubCategory" component={AccessCreateSubCategory} />
                        <Route exact path="/admin/update/:id" component={AccessUpdateProduct} />
                        <Route path='*' exact={true} component={NotFound} />
                    </Switch>
                </Router>
            </Provider>
        
        )
    }
}

export default App;