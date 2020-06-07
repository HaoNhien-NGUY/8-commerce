import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, 
    Link
  } from "react-router-dom";
import $ from 'jquery';
import axios from 'axios';
import './SubProductInterface.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import { useRouteMatch } from "react-router-dom";
import store from '../../../store';
import {
    Button, Form, FormGroup, Label, Input, Alert
} from 'reactstrap'
import Modal from 'react-bootstrap/Modal';

const SubProductInterface = () => {
    const [show, setShow] = useState(false);
    const [picture, setPicture] = useState([]);
    const [idProduct, setIdProduct] = useState(null);
    const [idSubProduct, setIdSubProduct] = useState(null);
    const [colorId, setColorId] = useState('default');
    const [colors, setColors] = useState([]);

    const [limit, setLimit] = useState(2);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    const [postData, setPostData] = useState();
    const [getSubProducts, setGetSubProducts] = useState([]);
    const [subProducts, setSubProducts] = useState([]);
    const [titleProduct, setTitleProduct] = useState('');
    let id = useRouteMatch("/admin/subproduct/:id").params.id;
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

    // useEffect(() => {
    //     receivedData()
    // }, [offset, subProducts])
    useEffect(() => {
        axios.get("http://localhost:8000/api/product/"+id, config)
        .then(async res => {
          
            console.log(res.data);
            if(res.data.subproducts)
            {
                setTitleProduct(res.data.title)
                await setPageCount(Math.ceil(res.data.subproducts.length / limit))
                let arrSubProduct = [];
                let nbr;
                for(let i = 0; i !== limit; i++)
                {   
                    if(res.data.subproducts[offset+i]) arrSubProduct.push(res.data.subproducts[offset+i]);
                    console.log(arrSubProduct);
                }
                setSubProducts(arrSubProduct);  
            }
            else
            {
                console.log('palala');
                setTitleProduct(res.data.empty.title)
                setPageCount(0)
            }
  
        })
        .catch(error => {
            console.log(error);
          toast.error('Error !', {position: 'top-center'});
        });
    }, [offset])

    const deleteProduct = (idSub) => {
        axios.delete("http://localhost:8000/api/subproduct/"+idSub, config)
        .then(res => {
            axios.get("http://localhost:8000/api/product/"+id, config)
                .then(res => {
                setSubProducts(res.data.subproducts);
                 })
                .catch(error => {
                    toast.error('Error !', {position: 'top-center'});
                 });
            toast.success(res.data.message, {position: "top-center"}); 
        })
        .catch(error => {
          toast.error('Error !', {position: 'top-center'});
        });
    }

    const handlePageClick = (e) => {

        const selectedPage = e.selected;
        const newOffset = selectedPage * limit;
        setOffset(newOffset)
    };

    const redirectCreate = () => {
        window.location.href='/admin/subproduct/'+id+'/create';
    }
    // $.each(products_temp, (index, product) => {
    //     product.subproducts.map(item => arr.push(item.price))
    // });

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/color", config).then( allColors => {
            let optionColors = [];
            allColors.data.map(colorMap => {
                optionColors.push(<option key={colorMap.id} value={colorMap.id}>{colorMap.name}</option>)
            });
            setColors(optionColors);
        });
    }, [])
    
    const handleClose = () => setShow(false);
    const handleShow = (id , subProductId) => {
        setShow(true);
        setIdProduct(id);
        setIdSubProduct(subProductId);
    }
    const onChange = (event) => {
        let files = event.target.files;
        setPicture(files);
    }

    function onSubmit(e) {
        e.preventDefault();

        if (picture.length === 0) {
            return toast.error("You need to pick a photo", { position: "top-center" });
        }

        let fileExtension = picture[0].name.split('.').pop();
        let exts = ['jpg', 'jpeg', 'png'];

        if (!exts.includes(fileExtension)) {
            return toast.error("Your picture need to have the \'jpg\', \'jpeg\',\'png\' extension", { position: "top-center" });
        }
        
        const bodyFormData = new FormData();
        bodyFormData.append('image', picture[0]);
        bodyFormData.append('color', colorId);

        axios.post('http://localhost:8000/api/image/' + idProduct, bodyFormData, config)
            .then(response => {
                setPicture([]);
                setShow(false)
                toast.success("Image correctly added !", { position: "top-center" });
            }).catch((error) => {
                toast.error("Error !", { position: "top-center" });
            })
    }

    return(
        <div className="container">
            <ToastContainer />
            <h1 className="mb-5">
              <img src="https://img.icons8.com/windows/32/000000/speedometer.png"/> ADMIN - Dashboard
            </h1>
            <div className="row justify-content-end mb-2">
              <h3 className="mr-auto ml-2">All Subproducts of <b>{titleProduct}</b></h3>
              <button onClick={() => window.location.href='/admin/update/product/'+id} className='btn btn-outline-info m-2'> modify the product </button>
              <button onClick={() => window.location.href='/admin'} className='float-right btn m-2 btn-warning'> Back to dashboard </button>
              <button onClick={redirectCreate} className="btn btn-dark">
                + New Subproduct for <b>{titleProduct}</b>
              </button>
            </div>
            <div className="row border p-2">
            <table>
                <thead>
                    {pageCount > 0 &&
                        <tr>
                            <th><p className="m-2 align-items-center"> ID </p></th>
                            <th><p className="m-2"> Price </p></th>
                            <th><p className="m-2"> Color </p></th>
                            <th><p className="m-2"> Size </p></th>
                            <th><p className="m-2"> Weight </p></th>
                        </tr>
                    }
                </thead>
                <tbody>
                    {console.log(subProducts)}
                {subProducts && subProducts.length > 0 ? subProducts.map((subproduct) =>  
                    <tr key={subproduct.id}>
                        <td><p className="m-2 align-items-center">{subproduct.id}</p></td>
                        <td><p className="m-2">{subproduct.price} €</p></td>
                        <td><p className="m-2">{subproduct.color.name}</p></td>
                        <td><p className="m-2">{subproduct.size}</p></td>
                        <td><p className="m-2">{subproduct.weight}</p></td>
                        {/* <td> <button onClick={() => window.location.href='/admin/create/image/'+id+'/'+subproduct.id}className="btn btn-outline-success m-2">Add</button></td> */}
                        <td>
                            <button onClick={e => e.preventDefault() + handleShow(id, subproduct.id)}className="btn btn-outline-success m-2">Add</button>
                        </td>
                        <td> <button onClick={() => window.location.href='/admin/subproduct/'+id+'/'+subproduct.id+'/update'}className="btn btn-outline-info m-2">Modify</button></td>
                        <td> <button onClick={() => deleteProduct(subproduct.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                    </tr>
                    ) : null}
                    {/* {subProducts.length > 0 ? subProducts.map((subproduct) => 
                    <tr key={subproduct.id}>
                        {console.log(subproduct.map((e) => e.price))}
                        <td><p className="m-2 align-items-center">{subproduct.id}</p></td>
                        <td><p className="m-2">{subproduct.price} €</p></td>
                        <td><p className="m-2">{subproduct.color}</p></td>
                        <td><p className="m-2">{subproduct.size}</p></td>
                        <td><p className="m-2">{subproduct.weight}</p></td>
                        <td> <button onClick={() => window.location.href='/admin/subproduct/'+id+'/'+subproduct.id+'/update'}className="btn btn-outline-info m-2">Modify</button></td>
                        <td> <button onClick={() => deleteProduct(subproduct.id)} className="btn btn-outline-danger m-2">Delete</button></td>
                    </tr>
                    ) : null} */}

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            Download Image !
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={onSubmit}>
                                <FormGroup>
                                    <select name="color" className="form-control form-control-lg" onChange={(e) => setColorId(e.target.value)}>
                                        <option value="default">Default (product)</option>
                                        {colors}
                                    </select><br/>
                                    <Label for="image">Image</Label>
                                    <Input
                                        type="file"
                                        name="image"
                                        id="image"
                                        onChange={onChange}
                                    />
                                    <Button color="dark" className="mt-4" block>
                                        Submit
                                    </Button>
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                    </Modal>

                </tbody>
            </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    {pageCount > 0 &&
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
                    }
                    
                </div>
            </div>
        </div>
        
    )
}

export default SubProductInterface;