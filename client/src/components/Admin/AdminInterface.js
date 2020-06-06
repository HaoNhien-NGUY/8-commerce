import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";
import axios from 'axios';
import './AdminInterface.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import store from '../../store';

const AdminInterface = () => {
    const [products, setProducts] = useState([]);
    const [limit, setLimit] = useState(2);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    const [postData, setPostData] = useState();

    const [categories, setCategories] = useState([]);
    const [limitCategories, setLimitCategories] = useState(2);
    const [offsetCategories, setOffsetCategories] = useState(0);
    const [pageCountCategories, setPageCountCategories] = useState();
    const [postDataCategories, setPostDataCategories] = useState();
    const [allColors, setAllColors] = useState([]);
    const [colorSelected, setColorSelected] = useState('');
    const optionColors = [];

    const token = store.getState().auth.token
    const config = {
        headers: {
                "Content-type": "application/json"
        }
    }
    useEffect(() => {
        if (token) {
            config.headers['x-auth-token'] = token
        }
    }, [token]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/color", config).then( e => {
            setAllColors(e.data);
        });
    }, []);

    useEffect(() => {
        receivedData()
    }, [offset, products])

    useEffect(() => {
        receivedDataCategories()
    }, [offsetCategories, categories])
    
    allColors.map( color => {
        optionColors.push(<option key={color.id} value={color.id}>{color.name}</option>)
    });

    const receivedData = () => {
        axios.get(`http://localhost:8000/api/product?offset=${offset}&limit=${limit}`, config)
            .then(async res => {
                console.log('i:', offset, ' limit:', limit)
                await setPageCount(Math.ceil(res.data.nbResults / limit))
                const newPostData = res.data.data.map((product) =>
                    <tr key={product.id}>
                        <td><p className="m-2 align-items-center">{product.id}</p></td>
                        <td><p className="m-2">{product.title}</p></td>
                        <td><p className="m-2">{product.price} €</p></td>
                        <td><p className="m-2">{product.sex}</p></td>
                        <td><button onClick={() => window.location.href='admin/create/image/'+product.id}className="btn btn-outline-success m-2">Add</button> </td>
                        <td> <button onClick={() => window.location.href='admin/subproduct/'+product.id}className="btn btn-outline-dark m-2">View subproduct</button></td>
                        <td> <button onClick={() => window.location.href = 'admin/update/product/' + product.id} className="btn btn-outline-info m-2">Modify</button></td>
                        <td> <button onClick={() => deleteProduct(product.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                    </tr>
                )
                setPostData(newPostData)
            })
            .catch(error => {
                toast.error('Error !', {position: 'top-center'});
            })
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limit;
        setOffset(newOffset)
    };

    const deleteProduct = (id) => {
        axios.delete("http://localhost:8000/api/product/" + id, config)
            .then(res => {
                axios.get("http://localhost:8000/api/product", config)
                    .then(res => {
                        setProducts(res.data.data);
                    })
                    .catch(error => {
                        toast.error('Error !', {position: 'top-center'});
                    });
                toast.success(res.data.message, { position: "top-center" });
            })
            .catch(error => {
                toast.error('Error !', {position: 'top-center'});
            });
    }

    const receivedDataCategories = () => {
        axios.get(`http://127.0.0.1:8000/api/category?offset=${offsetCategories}&limit=${limitCategories}`, config)
            .then(async res => {
                console.log(res.data);
                await setPageCountCategories(Math.ceil(res.data.nbResults / limitCategories))
                const newPostDataCategories = res.data.data.map((category) =>
                    <tr key={category.id}>
                        <td><p className="m-2 align-items-center">{category.id}</p></td>
                        <td><p className="m-2">{category.name}</p></td>
                        <td> <button onClick={() => window.location.href='/admin/subcategory/'+category.id}className="btn btn-outline-dark m-2">View subcategories</button></td>
                        <td> <button onClick={() => window.location.href = 'admin/update/category/' + category.id} className="btn btn-outline-info m-2">Modify</button></td>
                        <td> <button onClick={() => deleteCategory(category.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                    </tr>
                )
                setPostDataCategories(newPostDataCategories)
            })
            .catch(error => {
                toast.error('Error !', {position: 'top-center'});
            })
    }

    const handlePageClickCategories = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limitCategories;
        setOffsetCategories(newOffset);
    };
    
    const deleteCategory = (id) => {
        axios.delete("http://localhost:8000/api/category/" + id, config)
            .then(res => {
                axios.get("http://localhost:8000/api/category", config)
                    .then(res => {
                        setCategories(res.data.data);
                    })
                    .catch(error => {
                        toast.error('Error !', {position: 'top-center'});
                    });
                toast.success(res.data.message, { position: "top-center" });
            })
            .catch(error => {
                toast.error('Error !', {position: 'top-center'});
            });
    }

    const redirectCreate = (data) => {
        if(data === 'product') window.location.href = '/admin/create/product';
        if(data === 'category') window.location.href = '/admin/create/category';
        if(data === 'subcategory') window.location.href = '/admin/create/subcategory';
        if(data === 'color') window.location.href = '/admin/create/color';
    }

    const AllProducts = () => {
        return(
        <>
        <div className="row justify-content-end mb-2">
            
        <button onClick={() => redirectCreate('product')} className="btn btn-dark">
            + New Product
        </button>
            </div>
        <div className="row border p-2">
            <table>
                <thead>
                    <tr>
                        <th><p className="m-2 align-items-center"> ID </p></th>
                        <th><p className="m-2"> Title </p></th>
                        <th><p className="m-2"> Price </p></th>
                        <th><p className="m-2"> Sex </p></th>
                        <th><p className="m-2"> Image </p></th>
                        <th><p className="m-2"> Subproduct </p></th>
                    </tr>
                </thead>
                <tbody>
                    {postData}
                </tbody>
            </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    <ReactPaginate
                        previousLabel={"prev"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                </div>
            </div>
            </>
        )
    }
        const AllCategories = () => {
            return(
            <>
            <div className="row justify-content-end mb-2">
    
            <button onClick={() => redirectCreate('category')} className="btn btn-dark">
                + New Category
            </button>
             <button onClick={() => redirectCreate('subcategory')} className="btn btn-secondary">
            + New SubCategory
            </button>
                </div>
            <div className="row border p-2">
                <table>
                    <thead>
                        <tr>
                            <th><p className="m-2 align-items-center"> ID </p></th>
                            <th><p className="m-2"> Name </p></th>
                        </tr>
                    </thead>
                    <tbody>
                        {postDataCategories}
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCountCategories}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={2}
                            onPageChange={handlePageClickCategories}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />
                    </div>
                </div>
                </>
            )
    }

    const handleSelectColor = (e) => {
        setColorSelected(e.target.value);
    }

    const handleColorClick = () => {
        if (colorSelected) {
            axios.delete("http://localhost:8000/api/color/" + colorSelected, config).then( res => {
                    toast.success(res.data.message, { position: "top-center" });
                }).catch( err => {
                    toast.error('Error !', {position: 'top-center'});
                })
        } else {
            toast.error('Error ! No color selected', {position: 'top-center'});
        }
    }

    const AllColors = () => {
        return (
            <>
                <div className="row justify-content-end mb-2">
                    <button onClick={() => redirectCreate('color')} className="btn btn-dark">
                        + New Color
                    </button>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <div className="d-flex">
                            <select className="form-control form-control-lg" onChange={handleSelectColor}>
                                <option value="">--- SELECT COLOR ---</option>
                                {optionColors}
                            </select>
                            <button className="btn btn-outline-danger ml-4 deleteColor" onClick={handleColorClick}>Delete</button>
                        </div>
                    </li>
                </ul>
            </>
        )
    }

    return (
        <div className="container">
            <ToastContainer />
            <h1 className="mb-5">
                <img src="https://img.icons8.com/windows/32/000000/speedometer.png" /> ADMIN - Dashboard
            </h1>
            <Tabs forceRenderTabPanel={true}>
                <TabList>
                    <Tab><h3 className="mr-auto ml-2">All Products</h3></Tab>
                    <Tab><h3 className="mr-auto ml-2">All Categories</h3></Tab>
                    <Tab><h3 className="mr-auto ml-2">All Colors</h3></Tab>
                </TabList>
                <TabPanel>
                    {AllProducts()}
                </TabPanel>
                <TabPanel>
                    {AllCategories()}
                </TabPanel>
                <TabPanel>
                    {AllColors()}
                </TabPanel>
            </Tabs>
        </div>
    )
}
export default AdminInterface;