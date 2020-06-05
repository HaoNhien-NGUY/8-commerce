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

const AdminInterface = () => {

    const [products, setProducts] = useState([]);
    const [limit, setLimit] = useState(2);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    const [postData, setPostData] = useState();

    useEffect(() => {
        receivedData()
    }, [offset, products])

    const receivedData = () => {
        axios.get(`http://localhost:8000/api/product?offset=${offset}&limit=${limit}`)
            .then(async res => {
                await setPageCount(Math.ceil(res.data.nbResults / limit))
                const newPostData = res.data.data.map((product) =>
                    <tr key={product.id}>
                        <td><p className="m-2 align-items-center">{product.id}</p></td>
                        <td><p className="m-2">{product.title}</p></td>
                        <td><p className="m-2">{product.price} €</p></td>
                        <td><p className="m-2">{product.sex}</p></td>
                        <td> <button onClick={() => window.location.href = 'admin/update/' + product.id} className="btn btn-outline-info m-2">Modify</button></td>
                        <td> <button onClick={() => deleteProduct(product.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                    </tr>
                )
                setPostData(newPostData)
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * limit;
        setOffset(newOffset)
    };

    const deleteProduct = (id) => {
        axios.delete("http://localhost:8000/api/product/" + id)
            .then(res => {
                axios.get("http://localhost:8000/api/product")
                    .then(res => {
                        setProducts(res.data.data);
                    })
                    .catch(error => {
                        console.log(error.response)
                    });
                toast.success(res.data.message, { position: "top-center" });
            })
            .catch(error => {
                console.log(error.response)
            });
    }

    const redirectCreate = () => {
        window.location.href = '/admin/create';
    }

    return (
        <div className="container">
            <ToastContainer />
            <h1 className="mb-5">
                <img src="https://img.icons8.com/windows/32/000000/speedometer.png" /> ADMIN - Dashboard
            </h1>
            <div className="row justify-content-end mb-2">
                <h3 className="mr-auto ml-2">All Products</h3>

                <div className="divBtnCategory">
                    <button onClick={() => window.location.href = '/admin/createCategory'} className="btn btn-dark mr-3">+ New Category</button>
                    <button onClick={() => window.location.href = '/admin/createSubCategory'} className="btn btn-dark">+ New SubCategory</button>
                </div>

                <button onClick={redirectCreate} className="btn btn-dark">
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
                        </tr>
                    </thead>
                    <tbody>
                        {postData}
                    </tbody>
                </table>
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
            </div>
        </div>

    )
}

export default AdminInterface;