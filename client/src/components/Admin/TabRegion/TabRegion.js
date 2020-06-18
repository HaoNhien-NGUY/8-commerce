import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Region = () => {
    const [postDataRegions, setPostDataRegions] = useState([]); 
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [regionName, setRegionName] = useState('');
    const [regionId, setRegionId] = useState(0);
    const [limit, setLimit] = useState(2);
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState();
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    useEffect(() => {
        receivedData();
    }, [offset]);

    useEffect(() => {
      if (pageCount < offset) setOffset(0);
    }, [pageCount, offset]);

    const deleteRegion = (id) => {
      axios.delete("http://127.0.0.1:8000/api/region/"+id, config).then(res => {
        receivedData();
        toast.success(res.data.message, { position: 'top-center' });
          
      })
      .catch(error => {
          toast.error('Error !', { position: 'top-center' });
      })
    }

  const receivedData = () => {
    console.log('receivedData')
    axios.get(`http://127.0.0.1:8000/api/region?offset=${offset}&limit=${limit}`, config).then(async res => {
      console.log(res.data)
      await setPageCount(Math.ceil(res.data.nbResults / limit));
      const newPostDataRegions = res.data.data.length > 0 ? res.data.data.map((region) => 
        <tr key={region.id}>
          <td><p className="m-2 align-items-center">{region.id}</p></td>
          <td><p className="m-2">{region.name}</p></td>
          <td><button className="btn btn-outline-info m-1" onClick={() => {setRegionId(region.id); setRegionName(region.name); setShowUpdate(true)}}>Modify</button></td>
          {/* <td> <button className="btn btn-outline-danger m-1" onClick={() => deleteRegion(region.id)}> Delete </button></td> */}
        </tr>
        ) : null 
        setPostDataRegions(newPostDataRegions);
      })
      .catch(error => {
        console.log(error)
        toast.error('Error !', { position: 'top-center' });
      })
    } 

  const onSubmitRegion = (e) => {
    e.preventDefault();

    if (regionName.length === 0) {
        return toast.error("You need to enter a region", { position: "top-center" });
    }

    if (regionName.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
        return toast.error("Invalid charactere", { position: "top-center" });
    } else {
        const body = {
            "name": regionName
        }
        axios.post("http://127.0.0.1:8000/api/region", body, config).then(res => {
            toast.success('Region correctly added!', { position: "top-center" });
            receivedData();
        }).catch(err => {
            toast.error('Region already exist!', { position: 'top-center' });
        });
        setShowAdd(false);
    }
  }

  const onSubmitRegionUpdate = (e) => {
    e.preventDefault();

    if (regionName.length === 0) {
        return toast.error("You need to enter a region", { position: "top-center" });
    }

    if (regionName.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
        return toast.error("Invalid character", { position: "top-center" });
    } else {
        const body = {
            "name": regionName
        }
        axios.put("http://127.0.0.1:8000/api/region/"+regionId, body, config).then(res => {
            toast.success('Region correctly updated!', { position: "top-center" });
            receivedData();
        }).catch(err => {
            toast.error('Region already exist!', { position: 'top-center' });
        });
        setShowUpdate(false);
    }
  }

  const onChangeRegion = (event) => {
    let res = event.target.value.trim();
    let str = res.toLowerCase();
    let region = str.charAt(0).toUpperCase() + str.slice(1);
    setRegionName(region.replace(/[\s]{2,}/g, " "));
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const newOffset = selectedPage * limit;
    setOffset(newOffset)
  };

    return (
      <>
        <ToastContainer />
        <div className="row justify-content-end mb-2">
          <button onClick={() => setShowAdd(true)} className="btn btn-success m-1">
            + New Region
          </button>
          <Modal show={showAdd} onHide={() => setShowAdd(false)}>
            <Modal.Header closeButton>
              Create Region !
              </Modal.Header>
            <Modal.Body>
              <Form onSubmit={onSubmitRegion}>
                <FormGroup>
                  <Label for="region">Region name</Label>
                  <Input
                      type="text"
                      name="region"
                      id="region"
                      onChange={onChangeRegion}
                  />
                  <Button color="dark" className="mt-4" block>
                    Submit
                  </Button>
                </FormGroup>
              </Form>
            </Modal.Body>
          </Modal>
          <Modal show={showUpdate} onHide={() => setShowUpdate(false)}>
            <Modal.Header closeButton>
             Update Region !
              </Modal.Header>
            <Modal.Body>
              <Form onSubmit={onSubmitRegionUpdate}>
                <FormGroup>
                  <Label for="region">Region name</Label>
                  <Input
                      value={regionName}
                      type="text"
                      name="region"
                      id="region"
                      onChange={onChangeRegion}
                  />
                  <Button color="dark" className="mt-4" block>
                    Submit
                  </Button>
                </FormGroup>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
        <div className="row border p-2">
        <table>
            <thead>
                <tr>
                <th><p className="m-2 align-items-center"> ID </p></th>
                <th><p className="m-2"> Name </p></th>
                <th><p colSpan="3" className="m-1"> Actions </p></th>
                </tr>
            </thead>
        <tbody>{postDataRegions}</tbody>
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
              activeClassName={"active"} />}
          </div>
        </div>

      </>
    )
}

export default Region;