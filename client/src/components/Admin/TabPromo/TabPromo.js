import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Modal from 'react-bootstrap/Modal';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Promo = () => {
  const [postDataPromos, setPostDataPromos] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [idCodePromo, setIdCodePromo] = useState(0);
  const [code, setCode] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [usedLimit, setUsedLimit] = useState(0);
  const [dateEnd, setDateEnd] = useState(null);
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

  const receivedData = () => {
    axios.get(`http://127.0.0.1:8000/api/promocode?offset=${offset}&limit=${limit}`, config).then(async res => {
      console.log(res.data);
      await setPageCount(Math.ceil(res.data.nbResults / limit));
      const newPostDataPromos = res.data.data.length > 0 ? res.data.data.map((promo) => 
      <tr key={promo.id}>
        <td><p className="m-2 align-items-center">{promo.id}</p></td>
        <td><p className="m-2">{promo.code}</p></td>
        <td><p className="m-2">{promo.percentage}</p></td>
        <td><p className="m-2">{promo.dateEnd !== null ? promo.dateEnd : 'unlimited'}</p></td>
        <td><p className="m-2">{promo.usedTimes}</p></td>
        <td><p className="m-2">{promo.usedLimit !== null ? promo.usedLimit : 'unlimited'}</p></td>
        <td> <button className="btn btn-outline-info m-1" onClick={() => 
          {
            setCode(promo.code); 
            setIdCodePromo(promo.code); 
            setPercentage(promo.percentage);
            setDateEnd(promo.dateEnd);
            setUsedLimit(promo.usedLimit);
            setShowUpdate(true);
          }
        } > Modify </button></td>
        <td> <button className="btn btn-outline-danger m-1" onClick={() => deleteCodePromo(promo.id)}> Delete </button></td>
      </tr>
      ) : null 
      setPostDataPromos(newPostDataPromos);
    })
    .catch(error => {
      console.log(error);
      toast.error('Error !', { position: 'top-center' });
    })
  } 
  
  const deleteCodePromo = (promoId) => {
    console.log('will delete id promo:'+promoId+' with axios request')
  }

  const onSubmitCodePromo = (e) => {
    e.preventDefault();

    if (code.length === 0) {
        return toast.error("You need to enter a code promo", { position: "top-center" });
    }

    if (code.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
        return toast.error("Invalid charactere", { position: "top-center" });
    }
    if (percentage < 1 || percentage > 100) {
      return toast.error("percentage need to must be more than 0 and under 100", {position: 'top-center'});
    } else {
        const body = {
            "code": code
        }
        // Mettre la requete
        axios.post("http://127.0.0.1:8000", body, config).then(res => {
            toast.success('Code promo correctly added!', { position: "top-center" });
            receivedData();
        }).catch(err => {
            toast.error(err.data.response.message, { position: 'top-center' });
        });
        setShowAdd(false);
    }
  }

  const onChangeCode = (event) => {
    let res = event.target.value.trim();
    let str = res.toLowerCase();
    let code = str.charAt(0).toUpperCase() + str.slice(1);
    setCode(code.replace(/[\s]{2,}/g, " "));
  }

  const onSubmitUpdateCodePromo = (e) => {
    e.preventDefault();

    if (code.length === 0) {
        return toast.error("You need to enter a code promo", { position: "top-center" });
    }

    if (code.match(/[\\"/!$%^&*()_+|~=`{}[:;<>?,.@#\]]|\d+/)) {
        return toast.error("Invalid charactere", { position: "top-center" });
    }
    if (percentage < 1 || percentage > 100) {
      return toast.error("percentage need to must be more than 0 and under 100", {position: 'top-center'});
    } else {
        const body = {
            "code": code
        }
        // Mettre la requete
        axios.put("http://127.0.0.1:8000/"+idCodePromo, body, config).then(res => {
            toast.success('Code promo correctly added!', { position: "top-center" });
            receivedData();
        }).catch(err => {
            toast.error(err.data.response.message, { position: 'top-center' });
        });
        setShowAdd(false);
    }
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const newOffset = selectedPage * limit;
    setOffset(newOffset)
  };

  console.log(dateEnd)
  return(
    <>
    <ToastContainer />
    <div className="row justify-content-end mb-2">
      <button onClick={() => setShowAdd(true)} className="btn btn-success m-1">
        + New Code Promo
      </button>
    <Modal show={showAdd} onHide={() => setShowAdd(false)}>
      <Modal.Header closeButton>
        Create Code Promo !
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmitCodePromo}>
          <FormGroup>
            <Label for="code">Code</Label>
            <Input
              type="text"
              name="code"
              id="code"
              onChange={onChangeCode}
            />
            <Label for="percentage">Percentage</Label>
            <Input
              type="number"
              name="percentage"
              id="percentage"
              onChange={(e) => setPercentage(parseInt(e.target.value))}
            />
            <Label for="dateEnd">Limit by time (don't change if you don't want time limit)</Label>
            <Input
              type="datetime-local"
              name="dateEnd"
              id="dateEnd"

              onChange={(e) => setDateEnd(e.target.value)}
            />
            <Label for="usedLimit">Limit by count (0 = unlimited)</Label>
            <Input
              type="number"
              name="usedLimit"
              id="usedLimit"
              value={usedLimit}
              onChange={(e) => setUsedLimit(parseInt(e.target.value))}
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
       Update Code Promo !
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmitUpdateCodePromo}>
          <FormGroup>
            <Label for="code">Code</Label>
            <Input
              type="text"
              name="code"
              id="code"
              value={code}
              onChange={onChangeCode}
            />
            <Label for="percentage">Percentage</Label>
            <Input
              type="number"
              name="percentage"
              id="percentage"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
            />
            <Label for="dateEnd">Limit by time (don't change if you don't want time limit)</Label>
            <Input
              type="datetime-local"
              name="dateEnd"
              id="dateEnd"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
            <Label for="usedLimit">Limit by count (0 = unlimited)</Label>
            <Input
              type="number"
              name="usedLimit"
              id="usedLimit"
              value={usedLimit}
              onChange={(e) => setUsedLimit(parseInt(e.target.value))}
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
          <th><p className="m-2"> Percentage </p></th>
          <th><p className="m-2"> Date end (yy-mm-dd) </p></th>
          <th><p className="m-2"> Used time </p></th>
          <th><p className="m-2"> Used limit </p></th>
          <th><p colSpan="3" className="m-1"> Actions </p></th>
            </tr>
        </thead>
        <tbody>{postDataPromos}</tbody>
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

export default Promo;