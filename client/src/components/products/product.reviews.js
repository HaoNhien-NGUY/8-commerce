import React, {useEffect, useState, useLayoutEffect} from 'react';
import axios from 'axios';
import $ from 'jquery';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {TransitionGroup, CSSTransition, SwitchTransition} from 'react-transition-group';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';



function ReviewPart({id, auth}) {
  const [showForm, setShowForm] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsReady, setReviewsReady] = useState(false)
  const [ratings, setRatings] = useState([])
  const [avgRating, setAvgRating] = useState("-")
  const [avgStars, setAvgStars] = useState('')

  const [formControl, setFormControl] = useState({"rating": "1"});
  const [idUser, setIdUser] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Modal Confirmation delete
  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Modal Reply
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [reviewToReply, setReviewToReply] = useState(null);

  
  const id_product = id
  // const id_user = user.id

  useEffect (() => {
    axios
    .get(
        process.env.REACT_APP_API_LINK + "/api/review/product/"+id_product
        )
      .then((res) => {
        setReviews(res.data);
        setReviewsReady(true);
        console.log(res.data)

        initializeReviews();
        // if (auth.user !== null) {
        //   setIdUser(auth.user.id)
        // }
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, [reviewsReady])

  useEffect(() => {
    if (auth.user) {
      if (auth.user.role == "admin") {
        setIsAdmin(true);
      }
      else {
        setIsConnected(true);
      }
    }
    else {
      setIsAdmin(false);
      setIsConnected(false);
    }
  }, [auth])
  
  function handleChange(event) {
    console.log(formControl)

    let res = event.target.value.trim();
    let val = res.replace(/[\s]{2,}/g, " ");

    setFormControl({ ...formControl, [event.target.name]: val.toString() });
  }

async function initializeReviews() {
  let ratings_arr = [];
  let ratings_val = [];

  await reviews.map(review => {
    let str = '⭐';
    for (let i = 1; i < review.rating; i++) {
      str = str + "⭐";
    }
    ratings_arr.push(str)

    ratings_val.push(review.rating)
  })

  // Set les "⭐" dans le hook
  setRatings(ratings_arr)
  
  
  // Calcul moyenne des ratings
  if (ratings_val.length > 0) {
    if (ratings_val.length > 1){
      let sum = ratings_val.reduce((previous, current) => current += previous);
      let avg = sum / ratings_val.length;
      setAvgRating(avg);
      
      // Set le nbr moyen d'⭐
      let str = '⭐';
      // console.log(avgRating);
      for (let i = 1; i < Math.ceil(avg); i++) {
        str = str + "⭐";
      }
      setAvgStars(str);
    }
    else {
      let avg = ratings_val[0]
      setAvgRating(avg);
      // console.log(ratings_val)

      // Set le nbr moyen d'⭐
      let str = '⭐';
      // console.log(avgRating);
      for (let i = 1; i < Math.ceil(avg); i++) {
        str = str + "⭐";
      }
      setAvgStars(str);
    }
  }


}

async function initializeForm() {
  if (auth.user) {
    console.log(auth.user)
    // await setIdUser(auth.user.id)
    // console.log(auth.user.id)
    await setFormControl({...formControl,  "product": id_product, "user": auth.user.id, "rating": "1" });
    console.log(formControl)
    return true;
  }
  else {
    return toast.error('You have to be connected', {position: 'top-center'});
  }
}

function handleSubmit(e) {
    e.preventDefault();
    // await initializeForm();

    // let check = initializeForm();

    // if (check===true) {
      console.log(formControl);
  
      const body = JSON.stringify({ ...formControl });
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }

      axios
        .post(process.env.REACT_APP_API_LINK + '/api/review', body, config)
          .then( e => {
            toast.success('Review correctly added!', { position: "top-center"});
            setShowForm(false);
            ReinitializeForm()
            setReviewsReady(false)})
          .catch( err => {
            toast.error('Error !', {position: 'top-center'});
      });
    // }
  }

  function AdminAction(e) {
    // format -> rev-[action]-[id]    
    // ⚠ action en 3 lettres e.g: del

    let idSelected = e.target.id.substr(8)
    let actionSelected = e.target.id.substr(4, 3)

    if (actionSelected == "ver") {
      console.log("ADMIN: Request a verify action to", idSelected)
      // CODE...
    } 
    if (actionSelected == "rep") {
      console.log("ADMIN: Request a reply action to", idSelected)
      // CODE...
    } 
    else if (actionSelected == "del") {
      console.log("ADMIN: Request a delete action to", idSelected)
      setReviewToDelete(idSelected);
      setShowConfirm(true);
    }
  }

  async function UserAction(e) {
    // format -> rev-[action]-[id]    
    // ⚠ action en 3 lettres e.g: del
    let idSelected = e.target.id.substr(8)
    let actionSelected = e.target.id.substr(4, 3)

    if (actionSelected == "rep") {
      if (isConnected) {
        // setReviewToReply(idSelected)
        await initializeReplyForm(idSelected);
        setShowReplyForm(true)
      }
      else {
        return toast.error('You have to be connected', {position: 'top-center'});
      }
      // CODE...
    } 
  }

  function CloseConfirm() {
    setShowConfirm(false)
  }

  function DeleteReview() {
    axios
      .delete(process.env.REACT_APP_API_LINK + '/api/review/'+reviewToDelete)
        .then( e => {
          toast.success('Review correctly deleted!', { position: "top-center"});
          setReviewToDelete(null)
          setShowConfirm(false)
          setReviewsReady(false)
        })
        .catch( err => {
          toast.error('Error !', {position: 'top-center'});
        })
  }

  async function RatingToNull() {
    await delete formControl.rating;
  }

  function ReinitializeForm() {
    setFormControl({});
  }

  async function initializeReplyForm(id_review) {
    if (auth.user) {
      console.log(auth.user)
      // await setIdUser(auth.user.id)
      console.log(reviewToReply)
      RatingToNull();
      await setFormControl({...formControl, "product": id_product, "user": auth.user.id, "review": id_review });
      console.log(formControl)
      return true;
    }
    else {
      return false;
    }
  }

  function handleReply(e) {
    e.preventDefault();
    console.log(formControl);

    const body = JSON.stringify({ ...formControl });
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }

    axios
      .post(process.env.REACT_APP_API_LINK + '/api/review', body, config)
        .then( e => {
          toast.success('Review correctly added!', { position: "top-center"});
          setShowReplyForm(false)
          ReinitializeForm()
          setReviewsReady(false)})
        .catch( err => {
          toast.error('Error !', {position: 'top-center'});
    });
  }


  return (
    <div className="container-fluid comment-div">

      {/* Modal Confirmation */}
      <Modal show={showConfirm} onHide={CloseConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation required</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this review ?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={DeleteReview}>
            Yes
          </Button>
          <Button variant="secondary" onClick={CloseConfirm}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Reply */}
      <Modal show={showReplyForm} onHide={() => {setShowReplyForm(false)}}>
        <Modal.Header closeButton>Reply to the review !</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReply}>
            <Form.Control type="name" placeholder="Enter your name" className="col-5 d-inline" onChange={handleChange} name="username"/>
            <Form.Control as="textarea" rows="1" placeholder="Give your review a title" onChange={handleChange} name="title"/>
            <Form.Control as="textarea" rows="4" placeholder="Write your review" onChange={handleChange} name="description"/>
            <Button type="submit" color="dark" className="mt-4" block>Create</Button>
          </Form>
        </Modal.Body>
      </Modal>


      <div className="row">

        {/* Global Rating */}
        <div className="col-3">
          <div>
            <p className="rate-header">Customer Reviews</p>
            <p className="rate-global">{isNaN(avgRating) ? "--" : Number.parseFloat(avgRating).toFixed(1) }</p>
            <p>{avgStars}</p>
            <p className="rate-caption">{reviews.length > 0 ? `Based on ${reviews.length} reviews` : "No reviews"}</p>
            <button className="btn btn-sm btn-dark" onClick={() => {setShowForm(!showForm); initializeForm()}}>Write a review</button>
          </div>
        </div>
        
        <div className="col-9">


          {/* Form */}
          <CSSTransition
            in={showForm}
            timeout={800}
            classNames="form"
            unmountOnExit
            appear
          >

          {/* <div className={showForm ? "col-6" : "col-6 d-none" }> */}
          <div className="col-7">
            <Form>
                <Form.Group controlId="exampleForm.ControlInput1" className="justify-content-between row pad-15">
                  <Form.Control type="name" placeholder="Enter your name" className="col-5 d-inline" onChange={handleChange} name="username"/>
                </Form.Group>

              <Form.Group controlId="exampleForm.ControlSelect1" className="row pad-15">
                <Form.Control as="select" className="col-4" onChange={handleChange} name="rating">
                  <option value="1">⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                </Form.Control>
              </Form.Group>



              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" rows="1" placeholder="Give your review a title" onChange={handleChange} name="title"/>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" rows="4" placeholder="Write your review" onChange={handleChange} name="description"/>
              </Form.Group>
              <Button variant="primary" type="button" onClick={handleSubmit}>
                Submit
              </Button>
            </Form>
          </div>
        </CSSTransition>


          {/* Reviews */}
          {reviewsReady && reviews.length > 0 ? 
          reviews.map((review, index) => {

            return (
              <>
                <div className="row row-rev" key={review.id} id={"rev-"+review.id}>
                  <div className="col-2 d-inline">
                    <p className="rew_name">{review.username}</p>
                    {ratings[index]}
                    <br />
                    {review.verified && <span className="verif"><i className="material-icons md-18">verified_user</i> Verified buyer</span>}
                  </div>
                  <div className="col-8 d-inline">
                    <p className="rew_title">{review.title}</p>
                    <p className="rew_desc">{review.description}</p>
                    {/* <div>TEST</div> */}
                  </div>
                  <div className="col-2 d-inline">
                    {isAdmin ?
                      <div className="float-right">
                        <a href="#" title="Reply to Buyer" className="mr-2"  onClick={AdminAction}><i className="material-icons md-24 text-secondary" id={"rev-rep-"+review.id}>reply</i></a> 
                        {/* <a href="#" title="Verify Buyer" className="mr-2" onClick={AdminAction}><i className="material-icons md-24 text-info" id={"rev-ver-"+review.id}>verified_user</i></a> */}
                        {/* <a href="#" title="Delete" onClick={AdminAction}><i className="material-icons md-24 text-danger" id={"rev-del-"+review.id}>delete</i></a>  */}
                        <a href="#" title="Delete" onClick={AdminAction}><i className="material-icons md-24 text-danger" id={"rev-del-"+review.id}>delete</i></a> 
                      </div>
                      :
                      <a href="#" title="Reply to Buyer" className="mr-2"  onClick={UserAction}><i className="material-icons md-24 text-secondary" id={"rev-rep-"+review.id}>reply</i></a> 
                    }
                  </div>
                </div>
                {review.reviews.length > 0 ? <p className="rep-caption md-force-align font-italic"><i className="material-icons md-18 mr-1">chat_bubble_outline</i> {review.reviews.length > 1 ? "Replies to" : "Reply to" } {review.username}</p> : null}
                {review.reviews.map(reply => {
                  return (
                    <>
                      <div className="row row-rep">
                        <div className="col-2 d-inline border-rep">
                          <p className="rep_name">{reply.username}</p>
                          {reply.verified && <span className="verif"><i className="material-icons md-18">verified_user</i> Verified buyer</span>}
                        </div>
                        <div className="col-8 d-inline">
                          <p className="rep_title">{reply.title}</p>
                          <p className="rep_desc">{reply.description}</p>
                        </div>
                        <div className="col-2 d-inline">

                          {isAdmin ? 
                            <div className="float-right">
                              <a href="#" title="Reply to Buyer" className="mr-2"  onClick={AdminAction}><i className="material-icons md-24 text-secondary" id={"rev-rep-"+reply.id}>reply</i></a> 
                              {/* <a href="#" title="Verify Buyer" className="mr-2" onClick={AdminAction}><i className="material-icons md-24 text-info" id={"rev-ver-"+reply.id}>verified_user</i></a> */}
                              {/* <a href="#" title="Delete" onClick={AdminAction}><i className="material-icons md-24 text-danger" id={"rev-del-"+reply.id}>delete</i></a>  */}
                              <a href="#" title="Delete" onClick={AdminAction}><i className="material-icons md-24 text-danger" id={"rev-del-"+reply.id}>delete</i></a> 
                            </div>
                            :
                            <a href="#" title="Reply to Buyer" className="mr-2"  onClick={UserAction}><i className="material-icons md-24 text-secondary" id={"rev-rep-"+reply.id}>reply</i></a> 
                          }
                        </div>
                      </div>
                      {reply.reviews.map(reply => {
                        return (
                          <div className="row row-rep">
                            <div className="col-2 d-inline border-rep">
                              <p className="rep_name">{reply.username}</p>
                              {reply.verified && <span className="verif"><i className="material-icons md-18">verified_user</i> Verified buyer</span>}
                            </div>
                            <div className="col-8 d-inline">
                              <p className="rep_title">{reply.title}</p>
                              <p className="rep_desc">{reply.description}</p>
                            </div>
                            <div className="col-2 d-inline">
                              {isAdmin ? 
                                <div className="float-right">
                                  <a href="#" title="Reply to Buyer" className="mr-2"  onClick={AdminAction}><i className="material-icons md-24 text-secondary" id={"rev-rep-"+reply.id}>reply</i></a> 
                                  {/* <a href="#" title="Verify Buyer" className="mr-2" onClick={AdminAction}><i className="material-icons md-24 text-info" id={"rev-ver-"+reply.id}>verified_user</i></a> */}
                                  {/* <a href="#" title="Delete" onClick={AdminAction}><i className="material-icons md-24 text-danger" id={"rev-del-"+reply.id}>delete</i></a>  */}
                                  <a href="#" title="Delete" onClick={AdminAction}><i className="material-icons md-24 text-danger" id={"rev-del-"+reply.id}>delete</i></a> 
                                </div>
                                :
                                <a href="#" title="Reply to Buyer" className="mr-2"  onClick={UserAction}><i className="material-icons md-24 text-secondary" id={"rev-rep-"+reply.id}>reply</i></a> 
                              }
                            </div>
                            <hr></hr>
                          </div>
                        )
                      })}
                    </>
                  )
                })}
                <hr></hr>
              </>
            )
            })
            : <div className="text-secondary text-center md-force-align"><i className="material-icons md-18">campaign</i>&nbsp;Be the first to put a review !</div>
          }
        </div>

      </div>


    </div>
  )
}


ReviewPart.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(ReviewPart); 