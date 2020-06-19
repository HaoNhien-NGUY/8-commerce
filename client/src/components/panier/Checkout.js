import React from 'react';
import LoginModal from "../auth/LoginModal";
import axios from "axios";
import SlideToggle from "react-slide-toggle";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';


// ShowShippingAddress
class Checkout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            NoShipPrice: props.price,
            currentStep: 1,
            region: 1,
            country: "France",
            showstatus: false,
        }
    }
    static propTypes = {
        auth: PropTypes.object.isRequired,
    };


    componentDidMount() {
        if (this.props.auth.user != null) {
            if (!this.state.shippingAddress && !this.state.billingAddress) {
                axios
                    .get("http://localhost:8000/api/user/" + this.props.auth.user.id + "/address")
                    .then((res) => {
                        return this.setState({ shippingAddress: res.data.shippingAddress, billingAddress: res.data.billingAddress, email: this.props.auth.user.email })
                    })
                    .catch((error) => {
                    });
            }
        }

    }

    componentDidUpdate() {
        if (this.props.auth.user != null) {
            if (!this.state.shippingAddress && !this.state.billingAddress) {
                axios
                    .get("http://localhost:8000/api/user/" + this.props.auth.user.id + "/address")
                    .then((res) => {
                        return this.setState({ shippingAddress: res.data.shippingAddress, billingAddress: res.data.billingAddress, email: this.props.auth.user.email })
                    })
                    .catch((error) => {
                    });
            }
        }

    }

    handleChange = event => {
        const { name, value } = event.target
        if (name == "cardchoice") {
            if (value != "NewCard") { this.setState({ showstatus: true, showthings: "" }) } else {
                this.setState({ showstatus: false, showthings: "ShowNewCard" })
            }
        } else {
            this.setState({ showstatus: false })
        }
        if (name == "addresschoice") { if (value != "NewShippingAddress") { this.setState({ showstatus: false }) } else { this.setState({ showstatus: true }) } }
        if (name == 'billing_addresschoice') {
            if (value == 'true') {
                this.setState({ showstatus: false, showthings: "" })
            } else if (value == 'false') {
                this.setState({ showstatus: true, showthings: "" })
            } else if (value == 'NewBillingAddress') {
                this.setState({
                    showstatus: true,
                    showthings: "ShowNewBilling"
                });
            }
            else {
                this.setState({ showstatus: true, showthings: "" })
            }
        }
        this.setState({
            [name]: value
        })

    }

    handleSubmit = event => {
        event.preventDefault()
        let s = this.state;
        console.log(s)
        if (!s.cardchoice) {
            return toast.error('Please fill all the required informations', { position: 'top-center' });
        } else {
            if (s.cardchoice === "NewCard") {
                if (!s.cardfirstname || !s.cardlastname || !s.cardnumber || !s.expirymonth || !s.expiryyear)
                    return toast.error('Please fill all the required informations', { position: 'top-center' });
            } else {
                if (s.cards[s.cardchoice].ccv !== parseInt(s.confirmccv)) {
                    return toast.error('Error: CCV is not correct', { position: 'top-center' });
                }
            }
        }

        let shippingAddress;
        if (this.state.addresschoice !== "NewShippingAddress") {
            shippingAddress = this.state.shippingAddress[this.state.addresschoice].id
        }
        else {
            shippingAddress = {
                'region_id': this.state.region,
                'user_id': this.props.auth.user != null ? this.props.auth.user.id : null,
                'country': this.state.country,
                'city': this.state.city,
                'postcode': this.state.zip,
                'address': this.state.address,
                'firstname': this.state.firstname,
                'lastname': this.state.lastname,
            }
        }

        let arrayOfObj = JSON.parse(sessionStorage.getItem("panier", []));
        arrayOfObj = arrayOfObj.map(({ productid, quantite }) => ({ subproduct_id: productid, quantity: quantite }));
        let billingAddress;
        if (this.state.billing_addresschoice === 'true') {
            billingAddress = shippingAddress
        } else {
            if (this.state.billing_addresschoice !== "NewBillingAddress") {
                billingAddress = this.state.billingAddress[this.state.billing_addresschoice].id
            }
            else {
                billingAddress = {
                    'region_id': this.state.billing_region,
                    'user_id': this.props.auth.user != null ? this.props.auth.user.id : null,
                    'country': this.state.billing_country,
                    'city': this.state.billing_city,
                    'postcode': this.state.billing_zip,
                    'address': this.state.billing_address,
                    'firstname': this.state.billing_firstname,
                    'lastname': this.state.billing_lastname,
                }
            }
        }

        let CardDetails;
        if (this.state.cardchoice !== "NewCard") {
            CardDetails = this.state.cards[this.state.cardchoice].id;
        }
        else {
            CardDetails = {
                'user_id': this.props.auth.user !== null ? this.props.auth.user.id : null,
                'card_numbers': this.state.cardnumber,
                'expiration_date': this.state.expirymonth + '/' + this.state.expiryyear,
                'firstname': this.state.cardfirstname,
                'lastname': this.state.cardlastname,
                'ccv': parseInt(this.state.ccv)
            }
        }

        let jsonRequest = {
            'email': this.state.email,
            "promo_code": this.state.promocode,
            'user_id': this.props.auth.user != null ? this.props.auth.user.id : null,
            'packaging': this.state.packaging != null ? "true" : "false",
            'pricing_id': this.state.shipping_methods[this.state.shippingchoice].pricing_id,
            'shipping_address': shippingAddress,
            'billing_address': billingAddress,
            'card_credentials': CardDetails,
            'subproducts': arrayOfObj
        }

        console.log(jsonRequest)
        const header = { "Content-Type": "application/json" };
        axios
            .post(
                "http://localhost:8000/api/checkout",
                jsonRequest,
                { headers: header }
            )
            .then((res) => {
                this.setState({ currentStep: 4, trackingnumber: res.data.trackingnumber })
                console.log(this.state)
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    _next = () => {
        console.log(this.state.showstatus)
        if (this.state.currentStep === 1) {
            let s = this.state;
            console.log(s)
            if (!s.addresschoice) {
                return toast.error('Please fill all the required informations', { position: 'top-center' });
            } else {
                if (s.addresschoice === "NewShippingAddress") {
                    if (!s.email || !s.firstname || !s.lastname || !s.address || !s.city || !s.zip || !s.region || !s.country) {
                        console.log('bitch')
                        return toast.error('Please fill all the required informations', { position: 'top-center' });
                    }
                }
            }
            const arrayOfObj = JSON.parse(sessionStorage.getItem("panier", []));
            let hide = true
            this.props.callbackFromParent(hide);
            if (arrayOfObj) {
                const arrayAPIName = arrayOfObj.map(({ productid: subproduct_id, quantite: quantity, ...rest }) => ({ subproduct_id, quantity, ...rest }));
                let jsonRequest = {
                    "region_id": this.state.region,
                    "subproducts": arrayAPIName
                };
                const header = { "Content-Type": "application/json" };
                axios
                    .post(
                        "http://localhost:8000/api/checkout/shipping",
                        jsonRequest,
                        { headers: header }
                    )
                    .then((res) => {
                        this.setState({ shipping_methods: res.data.shippingMethods, lowestPriceKey: res.data.lowestPriceKey });
                        let longestKey = null;
                        let shortestKey = null;
                        for (let [key, value] of Object.entries(this.state.shipping_methods)) {
                            if (value.duration === Math.max.apply(Math, this.state.shipping_methods.map(function (o) { return o.duration; }))) { longestKey = parseInt(key) }
                            if (value.duration === Math.min.apply(Math, this.state.shipping_methods.map(function (o) { return o.duration; }))) { shortestKey = parseInt(key) }
                        }
                        this.setState({ "longestKey": longestKey })
                        this.setState({ "shortestKey": shortestKey })
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }

        if (this.state.currentStep === 2) {
            let s = this.state;
            if (!s.shippingchoice)
                return toast.error('Please choose a delivery option', { position: 'top-center' });

            if (!s.billing_addresschoice)
                return toast.error('Please fill all the required informations', { position: 'top-center' });

            if (s.billing_addresschoice !== 'true') {
                if (s.billing_addresschoice === "NewBillingAddress") {
                    if (!s.billing_firstname || !s.billing_lastname || !s.billing_address || !s.billing_city || !s.billing_zip || !s.billing_region || !s.billing_country || !s.shippingchoice)
                        return toast.error('Please fill all the required informations', { position: 'top-center' });
                }
            }

            if (this.state.promocode) {
                let jsonRequest = {
                    'promocode': this.state.promocode,
                }
                axios
                    .post(
                        "http://localhost:8000/api/promocode",
                        jsonRequest,
                        { headers: { "Content-Type": "application/json" } }
                    )
                    .then((res) => {
                        this.setState({ promocode_details: res.data });
                        console.log(this.state)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

            if (this.props.auth.user != null) {

                console.log(this.props.auth.user.id)
                axios
                    .get("http://localhost:8000/api/cardcredentials/user/" + this.props.auth.user.id)
                    .then((res) => {
                        return this.setState({ cards: res.data })
                    })
                    .catch((error) => {
                        console.log(error.response);
                    });
            }
        }

        let currentStep = this.state.currentStep
        currentStep = currentStep >= 2 ? 3 : currentStep + 1
        this.setState({
            currentStep: currentStep,
            showstatus: false,
            showthings: '',
        })
    }

    _prev = () => {
        if (this.state.currentStep === 2) {
            let hide = false
            this.props.callbackFromParent(hide);
        }
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }

    previousButton() {
        let currentStep = this.state.currentStep;
        if (currentStep !== 1 && currentStep !== 4) {
            return (
                <button
                    className="btn btn-secondary"
                    type="button" onClick={this._prev}>
                    Previous
                </button>
            )
        }
        return null;
    }

    nextButton() {
        let currentStep = this.state.currentStep;
        if (currentStep < 3) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={this._next}>
                    Next
                </button>
            )
        }
        if (currentStep === 3) {
            return (
                <> <button className="btn btn-success float-right" type="button" onClick={this.handleSubmit}>Pay Now</button>
                </>
            )
        }
        return null;
    }

    render() {
        const { user } = this.props.auth;
        const arrayOfObj = JSON.parse(sessionStorage.getItem("panier", []));
        return (
            <>
                <React.Fragment>
                    <div className="col-8 LargeCart">
                        {arrayOfObj ? <> <p>Step {this.state.currentStep} </p>
                            <form><Step1
                                data={this.state}
                                currentStep={this.state.currentStep}
                                handleChange={this.handleChange}
                                handleShow={this.handleShow}
                                showstatus={this.state.showstatus}
                                user={user}
                            />
                                <Step2
                                    currentStep={this.state.currentStep}
                                    handleChange={this.handleChange}
                                    showstatus={this.state.showstatus}
                                    data={this.state}
                                    handleShow={this.handleShow}
                                />
                                <Step3
                                    currentStep={this.state.currentStep}
                                    handleChange={this.handleChange}
                                    showstatus={this.state.showstatus}
                                    handleSubmit={this.handleSubmit}
                                    data={this.state}
                                    handleShow={this.handleShow}
                                />
                                <Step4
                                    currentStep={this.state.currentStep}
                                    data={this.state}
                                />
                                {this.previousButton()}
                                {this.nextButton()}
                            </form>  </>

                            : null}
                    </div>
                </React.Fragment>
            </>
        );
    }
}

function Step1(props) {
    let ShippoingAdressOptions = []

    if (props.data.shippingAddress != null) {
        for (let [key, value] of Object.entries(props.data.shippingAddress)) {
            ShippoingAdressOptions.push(
                <div key={"address_" + key} className="col-md-12">
                    <label className="control control-radio w-100 form-check-label" htmlFor={"addresschoice" + key}>
                        <input className="form-check-input checkbox-style" type="radio" name="addresschoice" id={"addresschoice" + key} value={key} onChange={props.handleChange} />
                        <div className="control_indicator"></div>
                        <div className="alert alert-secondary p-0">
                            <div className="d-flex flex-column">
                                <div className="pl-3 pt-1">{value.firstname} {value.lastname}</div>
                                <div className="pl-3 p-0">{value.address}</div>
                                <div className="pl-3 pb-1">{value.city} {value.zipcode} {value.country} </div>
                            </div>
                        </div>
                    </label>
                </div >
            )
        }
    }
    if (props.currentStep !== 1) {
        return null
    }
    return (
        <>
            {props.user != null ? null : <><div className="d-flex"><LoginModal /><div className="pt-2 pl-0"> or continue as a Guest</div></div>
                <div className="form-group col-md-12">
                    <legend>Contact information</legend>
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Email" defaultValue={props.data.email ? props.data.email : null} onChange={props.handleChange} required />
                </div></>}
            <legend>Shipping Address</legend>
            {ShippoingAdressOptions}

            <div className="alert alert-secondary">
                <div className="form-row col-md-12">
                    <label className="control control-radio w-100 form-check-label" htmlFor="addresschoice">
                        <input className="form-check-input checkbox-style" type="radio" name="addresschoice" id="addresschoice" value="NewShippingAddress" onChange={props.handleChange} />
                        <div className="control_indicator"></div> New Address +
                                </label>
                </div>
                <div className={props.showstatus == false ? "col-md-12 hiding" : "pt-3 col-md-12 show"}>
                    <div className="form-row  col-md-12">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputfirstname">Firstname</label>
                            <input type="text" className="form-control" id="inputfirstname" placeholder="Firstname" defaultValue={props.data.firstname ? props.data.firstname : null} name="firstname" onChange={props.handleChange} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputLastname">Lastname</label>
                            <input type="text" className="form-control" id="inputLastname" placeholder="Lastname" defaultValue={props.data.lastname ? props.data.lastname : null} name='lastname' onChange={props.handleChange} />
                        </div>
                    </div>
                    <div className="form-group  col-md-12">
                        <label htmlFor="inputAddress">Address</label>
                        <input type="text" className="form-control" id="inputAddress" name='address' placeholder="Address" defaultValue={props.data.address ? props.data.address : null} onChange={props.handleChange} />
                    </div>
                    <div className="form-row  col-md-12">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputCity">City</label>
                            <input type="text" className="form-control" id="inputCity" name='city' placeholder="City" defaultValue={props.data.city ? props.data.city : null} onChange={props.handleChange} />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputZip">Zip code</label>
                            <input type="text" className="form-control" id="inputZip" name='zip' defaultValue={props.data.zip ? props.data.zip : null} placeholder="Zipcode" value={props.zip} onChange={props.handleChange} />
                        </div>
                    </div>

                    <div className="form-row  col-md-12">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputRegion">Region</label>
                            <select name="region" onChange={props.handleChange} className="custom-select">
                                <option value='1'>Choose a Region</option>
                                <option value="1" >France</option>
                                <option value="2" >Europe</option>
                                <option value="3" >Africa</option>
                                <option value="4">Asia</option>
                                <option value="5">North America</option>
                                <option value="6">South America</option>
                                <option value="7">Oceania</option>
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputZip">Country</label>
                            <input type="text" className="form-control" id="inputCountry" defaultValue={props.data.country ? props.data.country : null} placeholder="Country" name='country' value={props.country} onChange={props.handleChange} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Step2(props) {
    if (props.currentStep !== 2) {
        return null
    }
    else {
        console.log(props.data.showthings)
        let BillingAdressOptions = []
        if (props.data.billingAddress != null) {
            for (let [key, value] of Object.entries(props.data.billingAddress)) {
                BillingAdressOptions.push(
                    <div key={"address_" + key} className="col-md-12">
                        <label className="control control-radio w-100 form-check-label" htmlFor={"billing_addresschoice" + key}>
                            <input className="form-check-input checkbox-style" type="radio" name="billing_addresschoice" id={"billing_addresschoice" + key} value={key} onChange={props.handleChange} />
                            <div className="control_indicator"></div>
                            <div className="alert alert-secondary p-0">
                                <div className="d-flex flex-column">
                                    <div className="pl-3 pt-1">{value.firstname} {value.lastname}</div>
                                    <div className="pl-3 p-0">{value.address}</div>
                                    <div className="pl-3 pb-1">{value.city} {value.zipcode} {value.country} </div>
                                </div>
                            </div>
                        </label>
                    </div >
                )
            }
        }
        const items = []
        if (props.data.shipping_methods) {
            for (let [key, value] of Object.entries(props.data.shipping_methods)) {
                items.push(
                    <div key={"choice_" + key} className={key != props.data.lowestPriceKey ? "col-md-12 m-0 p-0 order-1" : "m-0 p-0 col-md-12"}>
                        <label className="control control-radio w-100 form-check-label" htmlFor={"shippingchoice" + key}>
                            <input className="form-check-input checkbox-style" type="radio" name="shippingchoice" id={"shippingchoice" + key} value={key} onChange={props.handleChange} />
                            <div className="control_indicator"></div>
                            <div className={key === props.data.lowestPriceKey ? "alert alert-primary" : key === props.data.longestKey ? "alert-success alert" : key === props.data.shortestKey ? "alert alert-warning" : "alert alert-secondary"} >
                                <div className="col-md-12 d-flex">
                                    <div className="col-md-6 m-0 p-0">
                                        <h5>{key === props.data.lowestPriceKey ? "Our best" : key === props.data.longestKey ? "Our greenest" : key === props.data.shortestKey ? "Our fastest" : "Another"} option :</h5>
                                        <div className="bd-highlight text-nowrap">Carrier: {value.name}</div></div>
                                    <div className="col-md-6">       <div className="bd-highlight text-nowrap">Delivery: {value.duration} days</div>
                                        <div className="bd-highlight text-nowrap">Price: {value.price} €</div></div>

                                </div>
                            </div>
                        </label>
                    </div >
                )
            }
            return (
                <>
                    <legend><label className="form-row" htmlFor="promocode">Promo Code</label></legend>
                    <div className="form-row col-md-12">
                        <div className="custom-control custom-radio custom-control-inline">
                            <input type="text" className="form-control" id="promocode" name="promocode" placeholder="Promocode" defaultValue={props.data.promocode ? props.data.promocode : null} onChange={props.handleChange} />
                        </div>
                    </div>
                    <legend className="pt-4">Shipping Method</legend>
                    <div key="shipping_method_ewe" className="row m-0 p-0">
                        {items}
                    </div>
                    <legend>Billing address</legend>
                    <div className="form-row col-md-12">
                        <div className="form-row col-md-12">
                            <h5>Is your billing address the same as your shipping adress?</h5>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="customRadioInline1" name="billing_addresschoice" value='true' className="custom-control-input" onChange={props.handleChange} />
                            <label className="custom-control-label" htmlFor="customRadioInline1">Yes</label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="customRadioInline2" name="billing_addresschoice" value="false" className="custom-control-input" onChange={props.handleChange} />
                            <label className="custom-control-label" htmlFor="customRadioInline2">No</label>
                        </div>
                    </div>
                    <div className={props.showstatus == false ? "form-row  mt-3 col-md-12 hiding" : "form-row    mt-3  col-md-12 show"}>
                        {BillingAdressOptions}

                        <div className="alert w-100 alert-secondary">
                            <div className="form-row col-md-12">
                                <label className="control control-radio w-100 form-check-label" htmlFor="billing_addresschoice">
                                    <input className="form-check-input checkbox-style" type="radio" name="billing_addresschoice" id="billing_addresschoice" value="NewBillingAddress" onChange={props.handleChange} />
                                    <div className="control_indicator"></div> New Address +
                                    </label>
                            </div>
                            <div className={props.data.showthings != "ShowNewBilling" ? "hiding" : "pt-3 show"} >
                                <div className="form-row  col-md-12">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputfirstname">Firstname</label>
                                        <input type="text" className="form-control" id="inputfirstname" placeholder="Firstname" defaultValue={props.data.billing_firstname ? props.data.billing_firstname : null} name="billing_firstname" onChange={props.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputLastname">Lastname</label>
                                        <input type="text" className="form-control" id="inputLastname" placeholder="Lastname" defaultValue={props.data.billing_lastname ? props.data.billing_lastname : null} name='billing_lastname' onChange={props.handleChange} />
                                    </div>

                                    <div className="form-group  col-md-12">
                                        <label htmlFor="inputAddress">Address</label>
                                        <input type="text" className="form-control" id="inputAddress" placeholder="Address" defaultValue={props.data.billing_address ? props.data.billing_address : null} name='billing_adress' placeholder="Address" onChange={props.handleChange} />
                                    </div>
                                    <div className="form-row  col-md-12">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="inputCity">City</label>
                                            <input type="text" className="form-control" id="inputCity" placeholder="City" defaultValue={props.data.billing_city ? props.data.billing_city : null} name='billing_city' onChange={props.handleChange} />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="inputZip">Zip code</label>
                                            <input type="text" className="form-control" id="inputZip" placeholder="Zipcode" defaultValue={props.data.billing_zip ? props.data.billing_zip : null} name='billing_zip' value={props.zip} onChange={props.handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-row  col-md-12">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="inputRegion">Region</label>
                                            <select defaultValue={props.data.billing_region ? props.data.billing_region : null} name="billing_region" onChange={props.handleChange} className="custom-select">
                                                <option value='1'>Choose a Region</option>
                                                <option value='1'>France</option>
                                                <option value="2">Europe</option>
                                                <option value="3">Africa</option>
                                                <option value="4">Asia</option>
                                                <option value="5">North America</option>
                                                <option value="6">South America</option>
                                                <option value="7">Oceania</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="inputZip">Country</label>
                                            <input type="text" className="form-control" id="inputCountry" name='billing_country' placeholder="Country" defaultValue={props.data.billing_country ? props.data.billing_country : null} value={props.country} onChange={props.handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br /><br /><br />
                </>
            )
        }
        else {
            return (
                <>Sorry, we are currently not Shipping to your destination</>
            )
        }
    }
}

function Step3(props) {
    if (props.currentStep !== 3) {
        return null
    }
    else {

        console.log(props.showstatus)
        let CardsOptions = []
        if (props.data.cards != null) {
            for (let [key, value] of Object.entries(props.data.cards)) {
                CardsOptions.push(
                    <div key={"card_" + key} className="col-md-12">
                        <label className="control control-radio w-100 form-check-label" htmlFor={"cardchoice" + key}>
                            <input className="form-check-input checkbox-style" type="radio" name="cardchoice" id={"cardchoice" + key} value={key} onChange={props.handleChange} />
                            <div className="control_indicator"></div>
                            <div className="alert alert-secondary p-0">
                                <div className="d-flex flex-column">
                                    <div className="pl-3 pt-1">Name : {value.firstname} {value.lastname}</div>
                                    <div className="pl-3 p-0">Card Num. : {value.cardNumbers}</div>
                                    <div className="pl-3 pb-1">Exp. Date : {value.expirationDate}</div>
                                </div>
                            </div>
                        </label>
                    </div >
                )
            }
        }
        let shipping_cost = props.data.shipping_methods[props.data.shippingchoice].price;
        let totalprice = shipping_cost + props.data.NoShipPrice
        let Promo = []
        if (props.data.promocode_details) {
            console.log(props.data.promocode_details.percentage)
            console.log(props.data.promocode_details.percentage / 100)
            Promo.push(<div className="row pl-4 pr-4 d-flex justify-content-between"><span>Promo :</span><span>- {totalprice * (props.data.promocode_details.percentage / 100)} €</span></div>)
            totalprice = totalprice - totalprice * (props.data.promocode_details.percentage / 100)
        }
        return (
            <React.Fragment>
                <>
                    <div className="alert alert-info"><h4>Your final order details:</h4>
                        <div className="row pl-4 pr-4 d-flex justify-content-between"><span>Order :</span><span>{props.data.NoShipPrice} €</span></div>
                        <div className="row pl-4 pr-4 d-flex justify-content-between"><span>Shipping :</span><span>{shipping_cost} €</span></div>
                        {Promo}
                        <div className="row pl-4 pr-4 d-flex justify-content-between"><h5>Total :</h5><span>{totalprice} €</span></div>

                    </div>
                    <legend>Card Details</legend>
                    {CardsOptions}

                    <div className={props.showstatus == false ? "form-row col-md-12 mb-0 hiding transition" : "transition form-row col-md-12 mb-2 show"}>
                        <label className="col-sm-4 mt-2 control-label" htmlFor="confirmccv">Enter CVV</label> <div className="col-sm-6 ">
                            <input type="text" className="form-control" id="confirmccv" name="confirmccv" placeholder="Confirm CCV" defaultValue={props.data.confirmccv ? props.data.confirmccv : null} onChange={props.handleChange} />
                        </div>
                    </div>


                    <div className="alert alert-secondary">
                        <div className="form-row col-md-12">
                            <label className="control control-radio w-100 form-check-label" htmlFor="cardchoice">
                                <input className="form-check-input checkbox-style" type="radio" name="cardchoice" id="cardchoice" value="NewCard" onChange={props.handleChange} />
                                <div className="control_indicator"></div> New Card +
                                        </label>
                        </div>

                        <div className={props.data.showthings != "ShowNewCard" ? "form-row  col-md-12 hiding" : "form-row  col-md-12 show"} >
                            <div className="form-group">
                                <div className="form-row  col-md-12">
                                    <div className="form-group col-md-6">
                                        <label className="col-sm-3 control-label" htmlFor="cardfirstname">Firstname</label>
                                        <input type="text" className="form-control" name="cardfirstname" id="cardfirstname" placeholder="Card Holder's Firsname" defaultValue={props.data.cardfirstname ? props.data.cardfirstname : null} onChange={props.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-sm-3 control-label" htmlFor="cardlastname">Lastname</label>
                                        <input type="text" className="form-control" name="cardlastname" id="cardlastname" placeholder="Card Holder's Firsname" defaultValue={props.data.cardlastname ? props.data.cardlastname : null} onChange={props.handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-12">
                                <div className="col-sm-12">
                                    <label className="control-label" htmlFor="cardnumber">Card Number</label>
                                    <input type="text" className="form-control" name="cardnumber" id="cardnumber" maxLength="16" placeholder="Debit/Credit Card Number" defaultValue={props.data.cardnumber ? props.data.cardnumber : null} onChange={props.handleChange} />
                                </div>
                            </div>
                            <div className="form-group col-sm-12">
                                <label className="col-sm-11 control-label" htmlFor="expirymonth">Expiration Date</label>
                                <label className="col-sm-1 control-label" htmlFor="expiryyear"></label>

                                <div className="col-sm-12">
                                    <div className="row ml-1">
                                        <div className="col-xs-6 pr-05">
                                            <select className="form-control" name="expirymonth" id="expirymonth" onChange={props.handleChange}>
                                                <option>Month</option>
                                                <option value="01">Jan (01)</option>
                                                <option value="02">Feb (02)</option>
                                                <option value="03">Mar (03)</option>
                                                <option value="04">Apr (04)</option>
                                                <option value="05">May (05)</option>
                                                <option value="06">June (06)</option>
                                                <option value="07">July (07)</option>
                                                <option value="08">Aug (08)</option>
                                                <option value="09">Sep (09)</option>
                                                <option value="10">Oct (10)</option>
                                                <option value="11">Nov (11)</option>
                                                <option value="12">Dec (12)</option>
                                            </select>
                                        </div>
                                        <div className="col-xs-6 pl-05">
                                            <select className="form-control" name="expiryyear" id="expiryear" onChange={props.handleChange}>
                                                <option value="20">2020</option>
                                                <option value="21">2021</option>
                                                <option value="22">2022</option>
                                                <option value="23">2023</option>
                                                <option value="24">2024</option>
                                                <option value="25">2025</option>
                                                <option value="26">2026</option>
                                                <option value="27">2027</option>
                                                <option value="28">2028</option>
                                                <option value="29">2029</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-12 control-label" htmlFor="ccv">Card ccv</label>
                                <div className="col-sm-12">
                                    <input type="text" className="form-control" name="ccv" id="ccv" placeholder="Security Code" maxLength="3" defaultValue={props.data.ccv ? props.data.ccv : null} onChange={props.handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* 
                    <SlideToggle collapsed irreversible
                        render={({ onToggle, setCollapsibleElement }) => (
                            <div className="my-collapsible">
                                <div className="alert alert-secondary">
                                    <div className="form-row col-md-12">
                                        <label className="control control-radio w-100 form-check-label" htmlFor="cardchoice">
                                            <input className="form-check-input checkbox-style" onClick={onToggle} type="radio" name="cardchoice" id="cardchoice" value="NewCard" onChange={props.handleChange} />
                                            <div className="control_indicator"></div> New Card +
                                </label>
                                    </div>
                                    <div className="my-collapsible__content  pt-3 " ref={setCollapsibleElement}>
                                        <div className="my-collapsible__content-inner">
                                            <div className="form-row  col-md-12">
                                                <div className="form-group">
                                                    <div className="form-row  col-md-12">
                                                        <div className="form-group col-md-6">
                                                            <label className="col-sm-3 control-label" htmlFor="cardfirstname">Firstname</label>
                                                            <input type="text" className="form-control" name="cardfirstname" id="cardfirstname" placeholder="Card Holder's Firsname" defaultValue={props.data.cardfirstname ? props.data.cardfirstname : null} onChange={props.handleChange} />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label className="col-sm-3 control-label" htmlFor="cardlastname">Lastname</label>
                                                            <input type="text" className="form-control" name="cardlastname" id="cardlastname" placeholder="Card Holder's Firsname" defaultValue={props.data.cardlastname ? props.data.cardlastname : null} onChange={props.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group col-sm-12">
                                                    <div className="col-sm-12">
                                                        <label className="control-label" htmlFor="cardnumber">Card Number</label>
                                                        <input type="text" className="form-control" name="cardnumber" id="cardnumber" maxLength="16" placeholder="Debit/Credit Card Number" defaultValue={props.data.cardnumber ? props.data.cardnumber : null} onChange={props.handleChange} />
                                                    </div>
                                                </div>
                                                <div className="form-group col-sm-12">
                                                    <label className="col-sm-11 control-label" htmlFor="expirymonth">Expiration Date</label>
                                                    <label className="col-sm-1 control-label" htmlFor="expiryyear"></label>

                                                    <div className="col-sm-12">
                                                        <div className="row ml-1">
                                                            <div className="col-xs-6 pr-05">
                                                                <select className="form-control" name="expirymonth" id="expirymonth" onChange={props.handleChange}>
                                                                    <option>Month</option>
                                                                    <option value="01">Jan (01)</option>
                                                                    <option value="02">Feb (02)</option>
                                                                    <option value="03">Mar (03)</option>
                                                                    <option value="04">Apr (04)</option>
                                                                    <option value="05">May (05)</option>
                                                                    <option value="06">June (06)</option>
                                                                    <option value="07">July (07)</option>
                                                                    <option value="08">Aug (08)</option>
                                                                    <option value="09">Sep (09)</option>
                                                                    <option value="10">Oct (10)</option>
                                                                    <option value="11">Nov (11)</option>
                                                                    <option value="12">Dec (12)</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-xs-6 pl-05">
                                                                <select className="form-control" name="expiryyear" id="expiryear" onChange={props.handleChange}>
                                                                    <option value="20">2020</option>
                                                                    <option value="21">2021</option>
                                                                    <option value="22">2022</option>
                                                                    <option value="23">2023</option>
                                                                    <option value="24">2024</option>
                                                                    <option value="25">2025</option>
                                                                    <option value="26">2026</option>
                                                                    <option value="27">2027</option>
                                                                    <option value="28">2028</option>
                                                                    <option value="29">2029</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-sm-12 control-label" htmlFor="ccv">Card ccv</label>
                                                    <div className="col-sm-12">
                                                        <input type="text" className="form-control" name="ccv" id="ccv" placeholder="Security Code" maxLength="3" defaultValue={props.data.ccv ? props.data.ccv : null} onChange={props.handleChange} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    />*/}
                </>
            </React.Fragment >
        );
    }
}

function Step4(props) {
    if (props.currentStep !== 4) {
        return null
    }
    return (
        <React.Fragment>
            <div className="f">
                <h3>Your order has been successfully registered !</h3>
                <p>Your order number is: {props.data.trackingnumber}</p>
                <p> An confirmation e-mail has been sent to you with your order details and tracking number. <br />
               You can track your order status here <a href={"http://localhost:4242/command?order=" + props.data.trackingnumber}>here</a></p>
                <div className="form-group mt-4">
                    <a href="http://localhost:4242/"><button className='btn btn-secondary' onClick={sessionStorage.removeItem("panier")}>Go back to the store</button></a>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(Checkout);
