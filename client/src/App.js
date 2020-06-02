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
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Product from './components/products/product.details'

class App extends React.Component {

    componentDidMount() {
        store.dispatch(loadUser())
    }

    render() {
        return (
            <Product />
            // <Router>
            //     <Provider store={store}>
            //         <IndexNavbar />
            //         <Container>
            //             <Route path="/:id/:postid" exact component={PostDetail} />
            //             <Route path="/search/user/posts/" exact component={SearchPost} />
            //             <Route path="/:id" exact component={UserPosts} />
            //             <Route path="/" exact component={UserList} />
            //         </Container>
            //     </Provider>
            // </Router>
        )
    }
}

export default App;