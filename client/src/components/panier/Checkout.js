import React from 'react';
import LoginModal from "../auth/LoginModal";
import axios from "axios";
import SlideToggle from "react-slide-toggle";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

class Checkout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
            region: 1,
            country: "France",
            percent: 0,
        }
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
    };

    componentDidUpdate() {
        if (this.props.auth.user != null) {
            axios
                .get("http://localhost:8000/api/user/" + this.props.auth.user.id + "/address")
                .then((res) => {
                    return this.setState({ shippingAddress: res.data.shippingAddress, billingAddress: res.data.billingAddress })
                })
                .catch((error) => {
                    console.log(error.response);
                });
        }
    }

    handleChange = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        console.log(this.state)
    }

    _next = () => {
        if (this.state.currentStep === 1) {
            const arrayOfObj = JSON.parse(sessionStorage.getItem("panier", []));
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
                            if (value.duration == Math.max.apply(Math, this.state.shipping_methods.map(function (o) { return o.duration; }))) { longestKey = parseInt(key) }
                            if (value.duration == Math.min.apply(Math, this.state.shipping_methods.map(function (o) { return o.duration; }))) { shortestKey = parseInt(key) }
                        }
                        this.setState({ "longestKey": longestKey })
                        this.setState({ "shortestKey": shortestKey })
                    })
                    .catch((error) => {
                        // console.log(error.response);
                    });
            }
        }
        let currentStep = this.state.currentStep
        currentStep = currentStep >= 2 ? 3 : currentStep + 1
        this.setState({
            currentStep: currentStep
        })
    }

    _prev = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }

    previousButton() {
        let currentStep = this.state.currentStep;
        if (currentStep !== 1) {
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
        return null;
    }

    render() {
        const { user } = this.props.auth;

        const arrayOfObj = JSON.parse(sessionStorage.getItem("panier", []));

        console.log(arrayOfObj)

        return (
            <>
                {/* <ProgressBar
                percent={this.state.percent} width="50%"
                filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
            >
                <Step transition="scale">
                    {({ accomplished }) => (
                        <img
                            style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                            width="30"
                            src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9d/Pichu.png/revision/latest?cb=20170407222851"
                        />
                    )}
                </Step>
                <Step transition="scale">
                    {({ accomplished }) => (
                        <img
                            style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                            width="30"
                            src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/97/Pikachu_%28Smiling%29.png/revision/latest?cb=20170410234508"
                        />
                    )}
                </Step>
                <Step transition="scale">
                    {({ accomplished }) => (
                        <img
                            style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                            width="30"
                            src="https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png"
                        />
                    )}
                </Step>
            </ProgressBar> */}

                <React.Fragment>
                    <div className="col-8 LargeCart">
                        {arrayOfObj ? <> <p>Step {this.state.currentStep} </p>
                            <form><Step1
                                data={this.state}
                                currentStep={this.state.currentStep}
                                handleChange={this.handleChange}
                                user={user}
                            />
                                <Step2
                                    currentStep={this.state.currentStep}
                                    handleChange={this.handleChange}
                                    data={this.state}
                                />
                                <Step3
                                    currentStep={this.state.currentStep}
                                    handleChange={this.handleChange}
                                    handleSubmit={this.handleSubmit}
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
                    <input type="email" className="form-control" id="email" name="email" placeholder="Email" onChange={props.handleChange} required />
                </div></>}
            <legend>Shipping Address</legend>
            {ShippoingAdressOptions}
            <div className="form-row  col-md-12">
                <div className="form-group col-md-6">
                    <label htmlFor="inputfirstname">Firstname</label>
                    <input type="text" className="form-control" id="inputfirstname" placeholder="Firstname" name="firstname" onChange={props.handleChange} />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="inputLastname">Lastname</label>
                    <input type="text" className="form-control" id="inputLastname" placeholder="Lastname" name='lastname' onChange={props.handleChange} />
                </div>
            </div>
            <div className="form-group  col-md-12">
                <label htmlFor="inputAddress">Address</label>
                <input type="text" className="form-control" id="inputAddress" name='adresse' placeholder="Address" onChange={props.handleChange} />
            </div>
            <div className="form-row  col-md-12">
                <div className="form-group col-md-6">
                    <label htmlFor="inputCity">City</label>
                    <input type="text" className="form-control" id="inputCity" name='city' placeholder="City" value={props.city} onChange={props.handleChange} />
                </div>
                <div className="form-group col-md-4">
                    <label htmlFor="inputZip">Zip code</label>
                    <input type="text" className="form-control" id="inputZip" name='zip' placeholder="Zipcode" value={props.zip} onChange={props.handleChange} />
                </div>
            </div>
            <SlideToggle collapsed
                render={({ onToggle, setCollapsibleElement }) => (
                    <div className="my-collapsible">
                        <div className="form-row col-md-12">
                            Shipping Outside of France ? <input type="checkbox" className="mt-2 ml-3" onClick={onToggle} />
                        </div>
                        <div className="my-collapsible__content  pt-3 " ref={setCollapsibleElement}>
                            <div className="my-collapsible__content-inner">
                                <div className="form-row  col-md-12">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputRegion">Region</label>
                                        <select name="region" onChange={props.handleChange} className="custom-select">
                                            <option value='1'>Choose a Region</option>
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
                                        <input type="text" className="form-control" id="inputCountry" placeholder="Country" name='country' value={props.country} onChange={props.handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            />
        </>
    );
}

function Step2(props) {
    if (props.currentStep !== 2) {
        return null
    }
    else {
        const items = []
        if (props.data.shipping_methods) {
            for (let [key, value] of Object.entries(props.data.shipping_methods)) {
                items.push(
                    <div key={"choice_" + key} className={key != props.data.lowestPriceKey ? "col-md-12 order-1" : "col-md-12"}>
                        <label className="control control-radio w-100 form-check-label" htmlFor={"shippingchoice" + key}>
                            <input className="form-check-input checkbox-style" type="radio" name="shippingchoice" id={"shippingchoice" + key} value={key} onChange={props.handleChange} />
                            <div className="control_indicator"></div>
                            <div className={key == props.data.lowestPriceKey ? "alert alert-primary" : key == props.data.longestKey ? "alert-success alert" : key == props.data.shortestKey ? "alert alert-warning" : "alert alert-secondary"} >
                                <h5>{key == props.data.lowestPriceKey ? "Our best" : key == props.data.longestKey ? "Our greenest" : key == props.data.shortestKey ? "Our fastest" : "Another"} option :</h5>
                                <div className="d-flex justify-content-between">
                                    <div className="p-2 bd-highlight">Carrier: {value.name}</div>
                                    <div className="p-2 bd-highlight">Delivery: {value.duration} to {value.duration + 5} days</div>
                                    <div className="p-2 bd-highlight">Price: {value.price} €</div>
                                </div>
                            </div>
                        </label>
                    </div >
                )
            }
            return (
                <>
                    <legend>Billing address</legend>
                    <SlideToggle collapsed irreversible
                        render={({ onToggle, setCollapsibleElement }) => (
                            <div className="my-collapsible">
                                <div className="form-row col-md-12">
                                    <div className="form-row col-md-12">
                                        <h5>Is your billing address the same as your shipping adress?</h5>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="customRadioInline1" name="billing" value='true' className="custom-control-input" onChange={props.handleChange} />
                                        <label className="custom-control-label" htmlFor="customRadioInline1">Yes</label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="customRadioInline2" name="billing" value='false' className="custom-control-input" onChange={props.handleChange} onClick={onToggle} />
                                        <label className="custom-control-label" htmlFor="customRadioInline2">No</label>
                                    </div>
                                </div>
                                <div className="my-collapsible__content  pt-3 " ref={setCollapsibleElement}>
                                    <div className="my-collapsible__content-inner">
                                        <div className="form-row  col-md-12">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="inputfirstname">Firstname</label>
                                                <input type="text" className="form-control" id="inputfirstname" placeholder="Firstname" name="billing_firstname" onChange={props.handleChange} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="inputLastname">Lastname</label>
                                                <input type="text" className="form-control" id="inputLastname" placeholder="Lastname" name='billing_lastname' onChange={props.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group  col-md-12">
                                            <label htmlFor="inputAddress">Address</label>
                                            <input type="text" className="form-control" id="inputAddress" placeholder="Address" name='billing_adresse' placeholder="Address" onChange={props.handleChange} />
                                        </div>
                                        <div className="form-row  col-md-12">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="inputCity">City</label>
                                                <input type="text" className="form-control" id="inputCity" placeholder="City" name='billing_city' value={props.city} onChange={props.handleChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="inputZip">Zip code</label>
                                                <input type="text" className="form-control" id="inputZip" placeholder="Zipcode" name='billing_zip' value={props.zip} onChange={props.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-row  col-md-12">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="inputRegion">Region</label>
                                                <select name="billing_region" onChange={props.handleChange} className="custom-select">
                                                    <option value='1'>Choose a Region</option>
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
                                                <input type="text" className="form-control" id="inputCountry" name='billing_country' value={props.country} onChange={props.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                    <legend className="pt-4">Shipping Method</legend>
                    <div key="shipping_method_ewe" className="row">
                        {items}
                    </div>
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
    return (
        <React.Fragment>
            <>
                {/* <div className="form-group">
                    <label className="col-sm-3 control-label" htmlFor="card-holder-name">Name on Card</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" name="card-holder-name" id="card-holder-name" placeholder="Card Holder's Name" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-3 control-label" htmlFor="card-number">Card Number</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" name="card-number" id="card-number" placeholder="Debit/Credit Card Number" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-3 control-label" htmlFor="expiry-month">Expiration Date</label>
                    <div className="col-sm-9">
                        <div className="row">
                            <div className="col-xs-6 pr-05">
                                <select className="form-control" name="expiry-month" id="expiry-month">
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
                                <select className="form-control" name="expiry-year">
                                    <option value="13">2013</option>
                                    <option value="14">2014</option>
                                    <option value="15">2015</option>
                                    <option value="16">2016</option>
                                    <option value="17">2017</option>
                                    <option value="18">2018</option>
                                    <option value="19">2019</option>
                                    <option value="20">2020</option>
                                    <option value="21">2021</option>
                                    <option value="22">2022</option>
                                    <option value="23">2023</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-3 control-label" htmlFor="cvv">Card CVV</label>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" name="cvv" id="cvv" placeholder="Security Code" />
                    </div>
                </div> */}
                <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-9">
                        <button type="button" onClick={props.handleSubmit} className="btn btn-success">Pay Now</button>
                    </div>
                </div>
            </>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(Checkout);