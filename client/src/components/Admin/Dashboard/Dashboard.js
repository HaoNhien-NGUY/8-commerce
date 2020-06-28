import React from 'react';
import axios from "axios";
import SlideToggle from "react-slide-toggle";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import { Button, Form, FormGroup, Label, Input, Alert, Card } from 'reactstrap';
import store from '../../../store';
/* eslint-disable */

class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            allinfos: [],
            soldcategory: []
        }
    }

    componentDidMount() {

        const token = store.getState().auth.token;

        let header = {
            "Content-type": "application/json",
            "Authorization": 'Bearer ' + token
        }

        if (this.props.auth.token) header = { ...header, 'Authorization': 'Bearer ' + this.props.auth.token }

        axios.get(process.env.REACT_APP_API_LINK + "/api/userorder/count", { headers: header })
            .then((res) => {
                this.setState({ allinfos: res.data })
                this.setState({
                    registered: res.data.unique_registered_buyers, unregistered: res.data.unregistered_buyers,
                    totalEarning: res.data.total_orders_price, totalOrders: res.data.total_orders_count,
                    totalProducts: res.data.total_products_sold, averageNumProducts: res.data.average_products_per_order,
                    averageCartPrice: res.data.average_price_per_order, OrdersPerRegion: res.data.ordres_per_region
                })
            })
            .catch((error) => {
            });

        axios.get(process.env.REACT_APP_API_LINK + `/api/review`, { headers: header })
            .then(res => {
                this.setState({ allreviews: res.data.data })
            }).catch(error => {
                toast.error('Error !', { position: 'top-center' });
            })

        axios.get(process.env.REACT_APP_API_LINK + `/api/soldsubcategory`, { headers: header })
            .then(res => {
                this.setState({ soldsubcategory: res.data })
            }).catch(error => {
                toast.error('Error !', { position: 'top-center' });
            })

        axios.get(process.env.REACT_APP_API_LINK + `/api/soldcategory`, { headers: header })
            .then(res => {
                this.setState({ soldcategory: res.data })

            }).catch(error => {
                toast.error('Error !', { position: 'top-center' });
            })
    }

    render() {

        let category = []
        let subcategory = []
        let averageNote = 0;
        let totalReviews = [];
        if (this.state.soldcategory.length != 0) {
            console.log(this.state)
            var counts = {};
            for (let [key, value] of Object.entries(this.state.soldcategory.shift())) {
                category.push(<li key={"keyy" + key}>{key}: <span>{value}</span></li>)
            }
            for (let [key, value] of Object.entries(this.state.soldsubcategory.shift())) {
                subcategory.push(<li key={"key" + key}>{key}: <span>{value}</span></li>)
            }
            this.state.OrdersPerRegion.map((e) => {
                counts[e.name] = e.nb_orders
            })

            this.state.allreviews.map((e) => {
                averageNote += e.rating;
            })
            totalReviews = this.state.allreviews.length;
            averageNote = (averageNote / totalReviews).toFixed(2);
        }



        return (
            <>
                <div className="row m-0 p-0 h-100">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jvectormap/2.0.4/jquery-jvectormap.css" type="text/css" media="screen" />
                    <div className="col-3 p-3"><div className="col-10 bg-light  bordercustom  border-success p-3">
                        <i className="text-success material-icons md-dark">attach_money</i> <h5>Total Earning</h5> <hr />{this.state.totalEarning} €
                    </div>
                    </div>
                    <div className="col-3 p-3"><div className="col-12 bg-light bordercustom border-primary p-3">
                        <i className="text-primary material-icons md-dark">bar_chart</i> <h5>Number of orders</h5>
                        <hr />{this.state.totalOrders} total
                    </div>
                    </div>
                    <div className="col-3 p-3"><div className="col-12 bg-light bordercustom border-warning  p-3">
                        <i className="text-warning material-icons md-dark">shopping_bag</i> <h5>Products sold</h5>
                        <hr />{this.state.totalProducts} total
                    </div>
                    </div>
                    <div className="col-3 p-3"><div className="col-12 bg-light bordercustom border-danger  p-3">
                        <i className="text-danger material-icons md-dark">timeline</i>  <h5>Average num.of products</h5>
                        <hr />{this.state.averageNumProducts} avg
                    </div></div>
                    <div className="col-3 p-3"><div className="col-12 bg-light bordercustom border-success  p-3">
                        <i className="text-success material-icons md-dark">shopping_cart</i>  <h5>Average cart price</h5>
                        <hr />{this.state.averageCartPrice} €
                    </div> </div>
                    <div className="col-3 p-3"><div className="col-12 bg-light bordercustom border-primary p-3">
                        <i className="text-primary material-icons md-dark">comment</i>  <h5>Number of comments </h5>
                        <hr />{totalReviews}
                    </div> </div>
                    <div className="col-3 p-3"><div className="col-12 bg-light bordercustom border-warning p-3">
                        <i className="text-warning material-icons md-dark">star</i>  <h5>Average rating</h5>
                        <hr />{averageNote}
                    </div> </div>
                    <div className="col-3 p-3"><div className="col-12 bg-light bordercustom border-danger p-3">
                        <i className="text-danger material-icons md-dark">account_circle</i>  <h5>Users stats</h5>
                        <hr /><b>Registered Clients: </b>{this.state.registered}
                        <br /><b>Unregistered Clients: </b>{this.state.unregistered}
                    </div> </div>

                </div>
                <div className="row h-100 m-0 p-0 justify-content-between">
                    {
                        counts ? <div className='col-8 map bg-light bordercustom border-secondary p-3'>
                            <h4>Order by regions</h4> <hr />
                            <div>    <span style={{ top: '18vh', left: '13vh' }}>{counts['North America']}</span>
                                <span style={{ top: '35vh', left: '23vh' }}>{counts['South America']}</span>
                                <span style={{ top: '16.5vh', left: '39.5vh' }}>{counts['France']}</span>
                                <span style={{ top: '14vh', left: '47vh' }}>{counts['Europe']}</span>
                                <span style={{ top: '26vh', left: '42vh' }}>{counts['Afrique']}</span>
                                <span style={{ top: '38vh', left: '74vh' }}>{counts['Oceania']}</span>
                                <span style={{ top: '20vh', left: '60vh' }}>{counts['Asie']}</span>
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="800px" height="398px" viewBox="0 0 8000 3980" preserveAspectRatio="xMidYMid meet">
                                    <g id="layer101" fill="#44a1ad" stroke="none">
                                        <path d="M3543 1067 c-53 -15 -53 -16 -44 -57 10 -45 5 -57 -30 -75 -16 -9 -29 -19 -29 -23 0 -4 23 -13 50 -19 28 -7 63 -21 77 -33 34 -26 37 -26 83 13 33 27 40 38 40 69 0 27 6 40 20 48 42 22 12 60 -49 60 -16 0 -36 7 -45 15 -17 17 -16 17 -73 2z" />
                                    </g>
                                    <g id="southamerca" fill="#44a1ad" stroke="none">
                                        <path d="M2003 3838 c-27 -13 -29 -30 -8 -48 13 -10 22 -8 53 14 21 14 43 26 49 26 7 0 15 5 18 10 8 14 -84 12 -112 -2z" />
                                        <path d="M1893 3758 c-17 -18 -39 -49 -48 -68 -10 -19 -28 -47 -42 -61 -20 -22 -22 -27 -9 -32 19 -7 21 -38 4 -70 -20 -39 -23 -44 -40 -68 -19 -27 -35 -175 -47 -446 -8 -188 -10 -192 -106 -258 -61 -42 -85 -75 -154 -206 -22 -41 -46 -81 -55 -88 -20 -17 -21 -51 -2 -76 12 -17 12 -21 -1 -30 -20 -15 -12 -38 42 -121 25 -38 45 -77 45 -87 0 -27 -21 -99 -34 -116 -11 -15 -8 -14 40 6 7 2 18 -3 25 -12 25 -30 45 -46 87 -71 l42 -25 -6 48 c-5 33 -3 45 4 38 5 -5 12 -19 14 -29 6 -36 33 -42 76 -18 22 12 57 22 78 22 46 0 136 48 159 84 19 28 67 50 94 43 43 -11 121 67 121 122 0 14 -12 38 -27 53 -31 33 -18 37 21 7 28 -22 56 -20 56 5 0 7 -7 17 -16 20 -9 4 -15 9 -12 12 3 3 22 -3 41 -12 44 -21 87 -8 87 26 0 23 4 24 29 11 23 -13 100 5 126 29 11 11 37 26 58 35 71 30 69 75 -7 183 -30 44 -36 60 -36 105 0 64 -31 180 -55 207 -10 11 -27 20 -37 20 -19 0 -80 29 -110 53 -11 9 -18 28 -18 48 0 59 -27 120 -96 218 -17 23 -23 24 -94 5 l-25 -7 28 30 c49 53 30 103 -42 103 -26 0 -30 4 -33 33 -3 28 -6 32 -30 30 -31 -2 -34 4 -13 31 15 19 11 70 -8 94 -7 9 -3 20 13 37 22 24 23 28 11 73 -6 27 -9 56 -5 65 4 12 -1 20 -21 27 -37 14 -37 14 -72 -22z" />
                                        <path d="M2163 3764 c-25 -11 -12 -24 23 -24 24 0 34 4 32 13 -5 13 -35 19 -55 11z" />
                                        <path d="M1710 1930 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M1600 1660 c0 -7 3 -10 7 -7 3 4 3 10 0 14 -4 3 -7 0 -7 -7z" />
                                        <path d="M1895 1340 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0 -7 -4 -4 -10z" />
                                    </g>
                                    <g id="europe" fill="#44a1ad" stroke="none">
                                        <path d="M6713 1993 c4 -3 10 -3 14 0 3 4 0 7 -7 7 -7 0 -10 -3 -7 -7z" />
                                        <path d="M4100 1280 c0 -5 13 -10 29 -10 17 0 33 5 36 10 4 6 -8 10 -29 10 -20 0 -36 -4 -36 -10z" />
                                        <path d="M3371 1246 c-7 -8 -24 -17 -38 -21 l-26 -6 6 -81 c4 -49 12 -85 19 -90 15 -10 138 1 154 13 5 4 21 6 35 3 17 -4 20 -3 10 4 -10 8 -6 11 17 17 18 3 37 3 44 0 7 -4 -4 8 -24 27 -21 18 -40 46 -44 61 -8 34 -56 67 -96 67 -16 0 -28 5 -28 10 0 14 -16 12 -29 -4z" />
                                        <path d="M4054 1225 c-4 -8 -1 -21 5 -29 9 -11 5 -15 -18 -19 -25 -5 -32 -13 -41 -47 -9 -34 -21 -47 -87 -90 -81 -53 -93 -58 -93 -36 0 16 80 92 115 108 28 12 33 28 10 28 -9 0 -15 9 -15 23 0 38 -13 40 -24 5 -8 -23 -22 -38 -47 -50 -19 -9 -53 -36 -74 -60 -22 -24 -43 -42 -47 -41 -4 2 -4 -5 -1 -15 3 -9 3 -14 -2 -10 -4 4 -14 0 -22 -10 -9 -10 -12 -11 -7 -2 4 9 3 12 -2 7 -5 -5 -9 -28 -9 -52 -1 -36 -6 -47 -35 -71 l-35 -28 25 29 25 30 -26 -23 c-15 -13 -26 -30 -25 -38 2 -15 54 -63 68 -64 4 0 18 -4 32 -10 23 -9 25 -12 14 -35 -10 -22 -9 -29 10 -48 l22 -21 0 27 c0 27 13 36 25 17 8 -13 25 -3 25 16 0 8 -9 14 -20 14 -11 0 -20 4 -20 10 0 9 15 10 90 10 50 0 113 -10 125 -20 8 -6 15 -24 17 -38 2 -22 8 -27 30 -27 34 0 42 -9 23 -25 -27 -22 -16 -30 39 -30 30 0 58 -5 61 -10 4 -7 -16 -10 -59 -8 -55 2 -70 -1 -86 -18 -21 -20 -19 -29 20 -91 11 -16 12 -25 3 -34 -8 -8 -25 2 -64 37 -61 54 -68 68 -44 94 15 16 14 21 -17 66 -53 81 -71 84 -111 18 -21 -35 -31 -44 -40 -35 -12 12 -56 15 -73 3 -16 -10 -24 -64 -13 -84 5 -9 25 -22 46 -29 22 -7 64 -39 104 -79 50 -50 83 -74 124 -89 67 -25 160 -28 213 -5 20 8 51 17 67 20 65 8 130 32 133 47 5 23 -41 32 -88 18 -66 -20 -76 -15 -39 20 51 47 98 66 85 34 -4 -11 1 -15 18 -15 13 0 26 -7 30 -15 3 -8 17 -15 31 -15 20 0 25 -5 25 -25 0 -28 17 -33 35 -9 10 15 16 14 63 -6 33 -14 62 -20 80 -17 35 7 112 -3 112 -14 0 -5 -9 -9 -20 -9 -11 0 -20 -4 -20 -10 0 -5 6 -10 13 -10 27 0 120 29 143 45 24 16 25 18 9 35 -10 11 -20 18 -24 17 -16 -4 -50 25 -48 43 1 10 3 17 6 14 7 -7 31 75 31 106 0 15 6 32 13 39 10 11 9 12 -3 6 -9 -5 -7 0 5 14 19 22 19 23 1 37 -10 7 -24 15 -29 17 -6 2 -2 12 10 24 15 15 25 18 37 11 36 -20 59 17 40 66 -8 20 -52 20 -77 1 -14 -10 -26 -11 -48 -3 -16 6 -38 8 -49 5 -16 -4 -20 0 -20 23 0 16 5 30 11 32 6 2 17 18 25 36 12 31 12 33 -14 46 -15 8 -37 25 -50 39 l-23 24 33 48 c18 26 37 53 43 61 27 38 -32 23 -107 -28 -21 -15 -32 -16 -54 -7 -16 5 -25 7 -21 3 4 -4 -20 -25 -54 -47 -59 -37 -61 -40 -55 -73 8 -39 6 -40 -34 -19 -29 15 -40 35 -19 35 5 0 7 5 4 10 -3 6 -19 10 -36 10 -22 0 -29 -5 -29 -19 0 -20 -32 -37 -50 -26 -5 3 -22 26 -36 51 -19 32 -25 53 -20 74 5 25 2 31 -19 36 -13 3 -28 3 -33 0 -11 -6 -72 15 -72 26 0 3 4 18 10 32 5 14 7 33 4 41 -8 19 -33 19 -40 0z" />
                                        <path d="M3863 1223 c-20 -7 -15 -23 7 -23 11 0 20 4 20 9 0 13 -12 19 -27 14z" />
                                        <path d="M3736 1163 c-12 -12 -6 -43 9 -43 8 0 15 9 15 19 0 21 -13 34 -24 24z" />
                                        <path d="M3590 1149 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10 -5 -10 -11z" />
                                        <path d="M3740 1085 c0 -8 5 -15 10 -15 6 0 10 7 10 15 0 8 -4 15 -10 15 -5 0 -10 -7 -10 -15z" />
                                        <path d="M3558 1073 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z" />
                                        <path d="M3450 840 c20 -16 22 -20 8 -20 -24 0 -23 -15 2 -40 11 -11 20 -24 20 -30 0 -5 -9 -14 -20 -20 -24 -13 -28 -68 -5 -76 18 -7 47 20 35 32 -6 6 11 31 41 64 28 30 45 56 40 58 -6 2 -11 10 -11 17 0 13 -10 16 -105 30 l-30 5 25 -20z" />
                                        <path d="M3325 820 c-3 -5 -2 -18 3 -27 5 -10 7 -23 5 -30 -5 -13 46 -43 73 -43 13 0 15 6 10 32 -3 17 -11 37 -17 44 -15 18 -67 35 -74 24z" />
                                        <path d="M3445 750 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0 -7 -4 -4 -10z" />
                                        <path d="M3970 600 c0 -5 5 -10 11 -10 5 0 7 5 4 10 -3 6 -8 10 -11 10 -2 0 -4 -4 -4 -10z" />
                                        <path d="M3443 533 c4 -3 10 -3 14 0 3 4 0 7 -7 7 -7 0 -10 -3 -7 -7z" />
                                        <path d="M3159 504 c-6 -8 -18 -14 -25 -14 -20 0 -17 -18 4 -28 9 -5 42 -12 73 -16 43 -4 60 -2 68 8 14 16 0 27 -69 51 -33 12 -40 12 -51 -1z" />
                                        <path d="M3443 343 c4 -3 10 -3 14 0 3 4 0 7 -7 7 -7 0 -10 -3 -7 -7z" />
                                        <path d="M4612 339 c-18 -6 -35 -16 -38 -24 -8 -19 24 -63 56 -80 28 -14 160 -33 160 -22 0 3 -24 13 -53 21 -84 24 -135 76 -92 92 8 4 15 10 15 15 0 11 -4 10 -48 -2z" />
                                        <path d="M3863 218 c-26 -13 -30 -28 -7 -28 8 0 13 -4 10 -9 -3 -5 -15 -7 -25 -4 -10 3 -30 -1 -42 -8 l-24 -12 30 -9 c17 -4 53 -8 80 -8 28 0 59 -1 70 -2 45 -4 95 3 95 13 0 7 -17 10 -44 8 -35 -3 -42 -1 -34 8 6 7 17 13 24 13 8 0 14 5 14 10 0 17 -42 11 -56 -7 -12 -17 -15 -16 -41 14 -24 27 -31 30 -50 21z" />
                                        <path d="M5113 143 c4 -3 10 -3 14 0 3 4 0 7 -7 7 -7 0 -10 -3 -7 -7z" />
                                    </g>
                                    <g id="northamerica" fill="#44a1ad" stroke="none">
                                        <path d="M1335 2042 c-29 -16 -56 -40 -65 -57 -29 -56 -52 -84 -65 -79 -17 7 -70 -20 -112 -57 -26 -23 -38 -26 -70 -22 -32 4 -54 -2 -114 -32 -101 -50 -119 -69 -119 -119 0 -26 -10 -56 -25 -81 -33 -54 -91 -169 -98 -195 -3 -11 -10 -20 -16 -20 -22 0 -22 29 -2 75 11 25 23 63 27 83 4 20 11 45 15 54 5 10 5 19 0 22 -11 7 -41 -38 -41 -62 0 -10 -9 -27 -20 -37 -12 -10 -18 -26 -15 -35 3 -9 -1 -33 -10 -53 -8 -20 -15 -49 -15 -65 0 -17 -10 -38 -25 -52 -27 -26 -45 -76 -45 -128 0 -32 67 -163 90 -177 6 -4 20 -24 31 -47 15 -30 25 -39 39 -35 24 6 44 -16 36 -41 -4 -10 -17 -29 -30 -41 -20 -19 -23 -30 -19 -60 3 -20 9 -40 13 -46 4 -5 5 -27 2 -48 -5 -46 -44 -74 -139 -100 -55 -15 -66 -15 -103 -2 -23 8 -52 14 -65 13 -13 -1 -45 8 -72 19 -121 55 -195 84 -225 89 -45 9 -26 -8 34 -30 26 -10 58 -26 70 -36 l23 -18 -26 5 c-31 6 -50 -15 -25 -29 9 -5 16 -20 16 -33 0 -29 19 -40 82 -49 26 -4 57 -16 70 -26 l23 -19 -41 6 c-27 3 -44 1 -49 -7 -11 -18 9 -27 78 -34 69 -7 75 -10 57 -31 -7 -9 -11 -18 -8 -21 8 -8 196 -52 252 -59 36 -5 99 1 209 20 137 23 164 25 205 15 102 -25 312 -4 312 32 0 5 18 8 40 6 29 -1 44 3 53 17 13 17 15 17 35 -3 18 -18 34 -22 90 -22 37 0 78 6 92 13 22 11 31 11 68 -6 37 -16 43 -22 38 -41 -4 -18 0 -26 20 -34 41 -19 55 -15 52 16 -2 21 1 26 14 24 19 -3 33 14 18 23 -13 8 -13 25 1 25 6 0 30 -14 53 -30 67 -48 107 -18 45 34 -30 25 -48 29 -151 30 -21 1 -26 5 -25 21 2 15 -7 21 -44 30 -25 5 -52 15 -60 21 -8 6 -32 21 -54 32 -22 11 -52 31 -67 45 -26 24 -27 26 -12 56 10 21 23 31 38 31 12 0 32 7 44 16 13 9 35 19 50 23 25 7 27 12 27 56 0 73 18 72 68 -5 12 -19 34 -40 47 -47 33 -16 60 -50 60 -75 0 -27 57 -97 87 -109 18 -7 36 -4 69 10 38 17 44 24 44 51 0 40 19 46 63 20 45 -27 57 -20 57 31 0 22 5 50 11 62 9 16 9 22 0 25 -23 8 -10 17 26 17 31 0 38 4 38 20 0 33 -87 71 -183 79 -75 6 -163 34 -177 56 -9 14 -4 13 49 -11 25 -11 51 -17 56 -14 15 9 12 31 -5 45 -24 20 10 53 47 46 39 -8 35 9 -4 23 -18 7 -46 19 -61 27 -16 8 -33 14 -38 14 -19 0 -8 -20 19 -34 23 -13 24 -15 7 -16 -31 0 -142 56 -154 78 -6 11 -25 25 -43 31 -46 16 -128 73 -128 90 0 8 -6 11 -15 7 -11 -4 -15 2 -15 23 0 36 -31 76 -78 100 -21 11 -52 35 -71 55 -33 34 -34 37 -28 94 11 101 -37 130 -50 31 -7 -55 -15 -65 -56 -72 -17 -4 -42 -9 -54 -13 -15 -4 -28 1 -44 17 -19 19 -26 21 -54 10 -45 -16 -64 -13 -119 17 -44 25 -50 32 -67 87 -23 73 -24 136 -4 175 29 56 93 51 148 -11 34 -38 78 -52 91 -30 3 5 -8 38 -24 75 -17 36 -30 68 -30 71 0 3 27 5 59 5 69 0 72 4 60 78 -13 84 15 130 71 118 30 -6 30 -5 14 19 -9 14 -19 25 -23 25 -3 0 -28 -13 -56 -28z m268 -962 c20 -18 -13 -18 -34 1 l-24 20 25 -7 c14 -3 29 -10 33 -14z m-128 -24 c16 -38 49 -66 77 -66 19 0 24 15 8 25 -14 9 -12 22 5 29 8 3 22 -3 32 -12 9 -9 24 -17 32 -17 30 0 16 -29 -18 -37 -24 -7 -36 -18 -44 -39 -6 -16 -19 -32 -29 -35 -18 -5 -95 13 -115 29 -25 18 -13 29 25 23 20 -4 51 -2 67 3 l30 9 -33 12 c-31 11 -82 74 -82 100 0 24 32 7 45 -24z m235 -16 c12 -8 9 -10 -12 -10 -15 0 -30 5 -33 10 -8 13 25 13 45 0z" />
                                        <path d="M1900 1990 c0 -7 3 -10 7 -7 3 4 3 10 0 14 -4 3 -7 0 -7 -7z" />
                                        <path d="M1870 1800 c0 -7 3 -10 7 -7 3 4 3 10 0 14 -4 3 -7 0 -7 -7z" />
                                        <path d="M1490 1770 c-8 -5 -11 -12 -8 -16 10 -9 38 3 38 16 0 12 -10 13 -30 0z" />
                                        <path d="M1766 1773 c-3 -3 -3 -10 0 -14 7 -12 34 -11 34 0 0 11 -26 22 -34 14z" />
                                        <path d="M1585 1760 c-3 -6 3 -10 14 -10 12 0 21 -7 21 -15 0 -18 45 -20 86 -5 19 8 24 14 17 21 -14 14 -131 21 -138 9z" />
                                        <path d="M1820 1750 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M1530 1713 c-13 -3 -37 -16 -53 -29 -36 -30 -67 -38 -115 -30 -34 6 -36 5 -18 -9 41 -32 81 -29 162 9 43 20 74 41 72 48 -5 14 -15 17 -48 11z" />
                                        <path d="M1630 1640 c0 -5 7 -10 16 -10 8 0 12 5 9 10 -3 6 -10 10 -16 10 -5 0 -9 -4 -9 -10z" />
                                        <path d="M1502 1577 c-9 -11 -10 -17 -2 -22 15 -9 23 -1 18 21 -3 15 -4 16 -16 1z" />
                                        <path d="M1500 1520 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M1535 1520 c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0 -8 -4 -11 -10z" />
                                        <path d="M2220 950 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M2180 922 c0 -10 73 -82 84 -82 4 0 4 5 0 11 -3 6 6 21 21 33 17 13 25 28 21 34 -8 13 -126 17 -126 4z" />
                                        <path d="M655 886 c-12 -8 -16 -19 -11 -31 6 -17 8 -16 31 5 14 13 25 27 25 32 0 12 -24 10 -45 -6z" />
                                        <path d="M642 718 c2 -6 10 -14 16 -16 7 -2 10 2 6 12 -7 18 -28 22 -22 4z" />
                                        <path d="M230 672 c0 -11 24 -22 48 -22 21 0 5 15 -25 25 -13 3 -23 2 -23 -3z" />
                                        <path d="M630 671 c0 -6 5 -13 10 -16 6 -3 10 1 10 9 0 9 -4 16 -10 16 -5 0 -10 -4 -10 -9z" />
                                        <path d="M2610 583 c-8 -3 -27 -15 -42 -25 -25 -17 -28 -25 -28 -78 0 -35 5 -63 13 -70 6 -5 24 -19 40 -31 32 -24 35 -49 7 -74 -11 -10 -20 -25 -20 -34 0 -8 -12 -28 -27 -43 -23 -24 -35 -28 -82 -28 -63 0 -87 -11 -78 -33 4 -10 26 -18 64 -22 32 -4 81 -16 108 -28 40 -17 81 -22 215 -28 91 -5 201 -13 245 -18 95 -12 208 -4 249 16 17 9 43 13 63 10 46 -8 42 9 -4 18 -54 10 -73 23 -73 49 0 29 -68 93 -107 102 -16 3 -32 7 -38 9 -5 1 5 11 22 21 18 11 33 22 33 27 0 10 -28 9 -51 -3 -15 -8 -23 -7 -35 5 -16 16 -13 18 25 15 36 -3 16 18 -29 30 -22 6 -56 11 -77 11 -21 1 -60 14 -88 29 -27 15 -73 33 -102 39 -54 13 -74 29 -131 100 -33 40 -42 45 -72 34z" />
                                        <path d="M2154 535 c-16 -7 -38 -22 -48 -34 -13 -14 -31 -21 -58 -21 -21 0 -38 -4 -38 -10 0 -5 19 -10 43 -10 23 0 51 -7 61 -15 11 -8 35 -15 54 -15 l35 0 -27 -26 c-14 -15 -26 -30 -26 -34 0 -4 -11 -15 -25 -24 -18 -12 -30 -14 -44 -7 -10 6 -44 7 -82 3 -77 -8 -90 -30 -37 -62 37 -22 80 -28 60 -8 -20 20 -13 30 10 14 28 -20 61 -20 97 -2 15 8 38 12 49 9 12 -3 22 -1 22 5 0 5 16 17 36 27 19 9 38 24 41 33 3 9 17 29 31 45 23 24 24 29 11 42 -12 12 -20 13 -46 3 -38 -14 -49 -7 -33 21 15 30 3 44 -31 37 -32 -6 -37 1 -13 19 26 18 -5 26 -42 10z" />
                                        <path d="M1867 503 c-38 -4 -38 -5 -21 -24 22 -24 46 -24 67 -1 20 22 22 33 5 30 -7 -1 -30 -3 -51 -5z" />
                                        <path d="M1421 376 c-19 -7 -37 -18 -39 -26 -3 -7 0 -10 6 -6 5 3 21 2 34 -3 l23 -10 -24 0 c-13 -1 -22 -4 -18 -7 3 -3 1 -12 -6 -19 -9 -10 -18 -9 -45 2 -34 14 -62 12 -62 -5 0 -5 23 -21 51 -37 41 -22 60 -26 94 -22 24 2 51 12 61 21 11 11 29 16 52 14 21 -2 37 2 39 9 3 9 11 8 29 -4 29 -19 43 -10 27 17 -10 15 -8 21 10 33 21 14 21 14 -16 26 -21 7 -49 10 -62 7 -14 -4 -41 0 -61 9 -42 18 -48 18 -93 1z" />
                                        <path d="M1697 383 c-11 -10 13 -33 34 -33 24 0 24 9 2 26 -21 15 -27 17 -36 7z" />
                                        <path d="M1725 290 c-18 -20 -18 -20 6 -18 14 1 40 -4 57 -11 44 -18 54 -5 19 25 -34 29 -58 30 -82 4z" />
                                        <path d="M1850 280 c0 -11 41 -30 66 -30 8 0 14 4 14 9 0 9 -8 12 -62 27 -10 3 -18 0 -18 -6z" />
                                        <path d="M2051 239 c-41 -5 -77 -11 -80 -15 -10 -10 33 -35 49 -27 8 4 42 8 75 10 83 5 96 11 65 28 -14 8 -27 14 -30 13 -3 0 -38 -4 -79 -9z" />
                                        <path d="M2147 200 c-73 -9 -85 -20 -23 -20 39 0 47 -3 42 -15 -4 -10 1 -15 14 -15 13 0 18 -5 14 -15 -5 -12 7 -15 67 -17 67 -2 69 -2 19 -5 -97 -7 -74 -19 57 -32 263 -24 250 -24 228 -6 -20 16 -164 65 -191 65 -8 0 -49 16 -91 35 -42 19 -76 34 -77 34 -1 -1 -27 -5 -59 -9z" />
                                        <path d="M2058 143 c-30 -8 -20 -22 22 -33 59 -16 85 6 35 28 -27 12 -29 13 -57 5z" />
                                    </g>
                                    <g id="asia" fill="#44a1ad" stroke="none">
                                        <path d="M6478 2530 c-14 -4 -55 -11 -90 -15 -133 -14 -166 -51 -35 -40 80 6 167 35 167 55 0 11 -5 11 -42 0z" />
                                        <path d="M6196 2408 c-20 -23 -36 -45 -36 -50 0 -12 -69 -116 -113 -171 -22 -26 -37 -50 -34 -53 11 -11 50 9 86 45 20 20 53 49 74 65 20 16 37 32 37 37 0 5 18 32 40 60 44 56 48 70 24 93 -24 25 -39 19 -78 -26z" />
                                        <path d="M6505 2389 c-11 -4 -35 -8 -52 -8 -44 -1 -70 -30 -78 -85 -8 -51 0 -73 20 -56 10 8 16 7 22 -3 11 -20 149 -137 160 -137 6 0 18 9 27 19 16 18 16 21 1 50 -13 27 -14 35 -2 57 12 24 11 32 -20 89 -39 74 -51 85 -78 74z" />
                                        <path d="M6191 2225 c-16 -14 -37 -47 -47 -73 -9 -26 -31 -61 -47 -79 -27 -29 -29 -36 -23 -78 6 -36 2 -61 -16 -113 -12 -37 -24 -69 -25 -71 -2 -2 -14 1 -27 8 -30 16 -42 10 -49 -27 -3 -16 -29 -56 -57 -90 -41 -48 -56 -59 -69 -52 -9 5 -29 11 -44 15 -15 3 -31 13 -34 22 -4 9 -39 47 -78 85 l-72 68 -7 72 c-9 99 -55 169 -83 126 -36 -58 -123 -282 -123 -317 0 -35 -9 -61 -21 -61 -5 0 -9 7 -9 15 0 20 -31 19 -56 -1 -13 -11 -15 -17 -6 -20 17 -8 15 -24 -3 -24 -8 0 -30 -14 -50 -31 -34 -30 -38 -31 -139 -32 -95 -2 -107 -4 -130 -26 -18 -17 -31 -22 -50 -17 -35 9 -93 -23 -129 -68 -32 -41 -43 -44 -52 -15 -5 14 0 31 14 49 11 15 23 40 27 54 7 28 14 32 31 15 8 -8 14 -5 22 10 16 29 49 26 83 -6 22 -21 28 -23 28 -10 0 10 10 26 23 36 12 10 35 30 50 42 l28 24 -46 60 c-25 33 -63 69 -83 80 -21 11 -53 32 -72 46 -41 30 -153 79 -181 79 -21 0 -49 -51 -49 -88 0 -10 -18 -43 -41 -73 -22 -30 -48 -72 -58 -94 -11 -22 -40 -69 -65 -104 -25 -36 -46 -73 -46 -83 0 -20 -20 -25 -20 -5 -1 6 -9 2 -19 -10 -10 -12 -21 -20 -24 -17 -3 3 -3 -5 0 -18 4 -12 14 -28 23 -35 18 -13 40 -83 40 -126 0 -24 -1 -24 -87 -21 -48 1 -95 -2 -105 -7 -10 -5 -26 -27 -37 -49 l-19 -40 26 -6 c15 -4 32 -10 37 -15 18 -13 99 -39 125 -39 14 1 36 7 50 15 35 20 89 18 135 -5 26 -13 41 -16 46 -9 3 6 8 10 10 9 2 -1 30 11 62 26 47 23 60 35 64 58 7 36 84 76 109 56 18 -16 18 -51 -1 -76 -19 -25 -19 -34 0 -34 25 0 17 -20 -16 -38 -18 -9 -43 -27 -58 -39 -25 -21 -25 -22 -7 -41 10 -12 24 -18 32 -15 23 9 16 -12 -16 -42 -16 -15 -34 -43 -41 -62 -6 -18 -15 -33 -20 -33 -5 0 -9 -10 -9 -22 0 -21 4 -23 58 -21 31 1 72 5 90 9 42 8 60 -7 54 -46 -4 -28 -42 -65 -42 -40 0 19 -29 10 -35 -11 -5 -13 -1 -25 10 -33 15 -11 15 -16 2 -51 -8 -22 -20 -65 -27 -95 -7 -30 -17 -61 -22 -67 -7 -9 -1 -18 22 -30 62 -35 66 -39 50 -58 -12 -15 -11 -16 12 -10 30 8 48 -11 19 -20 -10 -3 -27 -15 -37 -26 -17 -19 -17 -20 3 -40 28 -29 53 -19 97 38 30 38 35 53 30 76 -5 26 -4 28 14 18 35 -19 34 -40 -3 -74 -42 -37 -44 -47 -7 -47 15 0 45 -12 67 -25 22 -14 52 -25 66 -25 18 0 28 -6 32 -18 5 -21 44 -32 116 -32 43 -1 81 -17 81 -35 0 -4 -16 -4 -35 -1 -22 4 -35 3 -35 -4 0 -5 -13 -10 -30 -10 -16 0 -30 -4 -30 -10 0 -20 88 -6 177 28 35 13 66 18 91 15 25 -3 50 1 70 11 29 15 43 36 24 36 -5 0 -16 6 -25 13 -14 10 17 13 170 15 184 3 187 4 243 33 47 24 62 28 83 20 14 -6 42 -7 63 -4 31 5 39 2 54 -17 17 -23 19 -23 96 -11 44 7 87 17 96 22 9 5 65 14 125 19 59 6 149 14 198 19 50 5 103 12 119 16 23 6 27 5 21 -5 -18 -29 252 14 356 57 20 8 45 12 55 9 20 -6 84 27 84 44 0 15 -27 12 -97 -9 -64 -20 -75 -19 -66 5 4 10 0 12 -13 7 -11 -4 -15 -2 -11 4 4 5 27 18 52 27 50 19 59 36 20 36 -15 0 -36 11 -49 25 -19 20 -30 24 -53 19 -18 -4 -33 -1 -37 5 -4 6 -16 11 -26 11 -37 0 -32 22 14 64 25 24 46 47 47 52 7 78 4 114 -7 114 -18 0 -142 -117 -149 -141 -4 -10 -1 -44 6 -75 11 -49 10 -57 -5 -72 -16 -16 -17 -16 -22 6 -7 25 -5 25 -59 12 -43 -10 -55 -2 -55 36 0 19 -6 20 -99 21 -130 1 -136 4 -157 65 -21 64 -11 74 70 68 23 -1 39 9 82 56 58 62 71 97 60 167 -10 60 -30 87 -66 87 -23 0 -31 5 -35 23 -4 13 -5 28 -3 34 2 7 -6 18 -16 26 -18 13 -16 17 40 71 l59 57 -25 14 c-34 19 -48 18 -55 -4 -3 -11 -31 -45 -61 -76 -46 -46 -58 -54 -74 -45 -27 15 -38 12 -45 -10 -3 -11 -12 -20 -18 -20 -13 1 -72 49 -66 54 35 26 56 34 79 29 16 -3 36 -1 46 5 15 9 15 11 -9 27 -15 9 -27 24 -27 32 0 19 58 100 77 108 9 3 13 12 9 21 -4 10 0 22 10 28 14 11 14 17 0 71 -8 33 -24 70 -34 84 -21 29 -97 70 -128 71 -12 0 -33 9 -47 20 -30 24 -37 25 -37 5 0 -30 -61 -11 -80 25 -13 24 0 53 42 92 16 14 38 47 49 73 17 39 19 51 9 75 -6 15 -22 32 -36 39 -13 6 -27 18 -30 26 -7 18 -34 20 -34 3 -1 -13 -64 -71 -111 -102 l-26 -17 -6 53 c-6 63 16 115 62 147 19 14 37 42 50 77 32 83 26 94 -28 49z" />
                                        <path d="M5410 2130 c0 -7 3 -10 7 -7 3 4 3 10 0 14 -4 3 -7 0 -7 -7z" />
                                        <path d="M6760 2106 c-5 -15 -19 -30 -30 -33 -24 -6 -16 -23 10 -23 11 0 28 -10 39 -22 l20 -21 11 27 c14 38 13 44 -15 73 l-24 27 -11 -28z" />
                                        <path d="M5607 2103 c-11 -10 -8 -83 3 -83 14 0 42 59 36 76 -6 15 -28 19 -39 7z" />
                                        <path d="M6580 2032 c0 -10 43 -52 54 -52 4 0 -2 14 -14 30 -20 29 -40 39 -40 22z" />
                                        <path d="M6710 2015 c0 -9 6 -12 15 -9 8 4 15 7 15 9 0 2 -7 5 -15 9 -9 3 -15 0 -15 -9z" />
                                        <path d="M6750 1985 c0 -8 2 -15 4 -15 2 0 6 7 10 15 3 8 1 15 -4 15 -6 0 -10 -7 -10 -15z" />
                                        <path d="M6690 1969 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10 -5 -10 -11z" />
                                        <path d="M6770 1965 c-7 -9 -10 -18 -7 -22 8 -7 37 15 37 28 0 14 -16 11 -30 -6z" />
                                        <path d="M6648 1880 c-26 -27 -29 -35 -23 -68 9 -50 22 -62 41 -37 10 13 13 31 9 51 -6 33 6 49 39 55 34 7 31 29 -4 29 -22 0 -41 -9 -62 -30z" />
                                        <path d="M6324 1757 c-8 -22 3 -37 27 -37 24 0 24 12 -1 35 -17 16 -20 16 -26 2z" />
                                        <path d="M6595 1630 c-7 -21 10 -60 25 -60 11 0 13 40 4 64 -8 22 -21 20 -29 -4z" />
                                        <path d="M4330 1420 c0 -7 3 -10 7 -7 3 4 3 10 0 14 -4 3 -7 0 -7 -7z" />
                                        <path d="M6775 1360 c-15 -28 -14 -30 4 -30 19 0 31 18 31 46 0 24 -19 15 -35 -16z" />
                                        <path d="M6827 1344 c-9 -10 2 -24 18 -24 9 0 12 6 9 15 -6 16 -17 19 -27 9z" />
                                        <path d="M6880 1315 c-11 -13 -24 -15 -57 -10 -49 7 -57 -5 -15 -24 76 -36 93 -45 108 -62 15 -17 15 -21 0 -59 -15 -39 -15 -40 4 -40 31 0 55 46 55 108 0 53 -1 55 -33 66 -18 6 -37 17 -41 24 -6 10 -11 9 -21 -3z" />
                                        <path d="M4332 1288 c3 -7 13 -15 24 -17 16 -3 17 -1 5 13 -16 19 -34 21 -29 4z" />
                                        <path d="M6875 1089 c-4 -5 -4 -22 -1 -36 4 -14 2 -31 -5 -39 -16 -19 -6 -18 38 6 21 11 43 20 50 20 16 0 17 22 2 37 -8 8 -20 8 -35 3 -19 -7 -24 -6 -24 5 0 17 -16 20 -25 4z" />
                                        <path d="M6813 923 c-15 -27 -45 -69 -67 -96 -21 -26 -37 -50 -34 -52 10 -10 123 107 120 124 -1 10 7 26 18 36 24 21 26 35 5 35 -8 0 -27 -21 -42 -47z" />
                                        <path d="M5127 143 c-15 -2 -25 -9 -22 -14 9 -14 58 -10 79 6 19 14 19 15 -5 14 -13 -1 -36 -4 -52 -6z" />
                                    </g>
                                    <g id="oceania" fill="#44a1ad" stroke="none">
                                        <path d="M7450 3610 c-13 -9 -12 -13 5 -26 11 -9 52 -31 90 -50 39 -18 87 -43 107 -56 27 -17 40 -20 48 -12 9 9 -14 29 -87 77 -104 69 -139 84 -163 67z" />
                                        <path d="M7004 3508 c3 -13 6 -29 6 -35 0 -8 15 -13 40 -13 50 0 54 22 8 50 -44 27 -62 26 -54 -2z" />
                                        <path d="M7736 3471 c-4 -5 -2 -12 4 -16 5 -3 10 -14 10 -23 0 -10 14 -30 31 -45 28 -24 30 -31 24 -63 -5 -28 -3 -35 7 -32 7 3 14 19 16 37 2 23 10 35 23 38 29 8 24 18 -33 60 -73 53 -76 54 -82 44z" />
                                        <path d="M7066 3391 c-4 -6 -20 -8 -36 -4 -36 7 -82 -19 -74 -42 8 -21 -4 -67 -16 -60 -16 10 -11 -11 5 -25 24 -20 10 -23 -25 -5 -30 15 -33 15 -46 -2 -7 -10 -14 -21 -14 -25 0 -4 -13 -14 -30 -23 -26 -14 -37 -14 -100 -1 -38 8 -84 22 -102 30 -18 8 -62 20 -98 26 -35 7 -73 16 -83 22 -13 7 -25 5 -44 -7 -23 -16 -24 -18 -8 -35 13 -15 17 -44 20 -147 2 -70 7 -137 11 -147 8 -20 140 -86 173 -86 10 0 35 -18 54 -40 19 -22 41 -40 50 -40 10 0 17 -6 17 -14 0 -8 16 -28 35 -45 36 -31 68 -40 80 -21 11 18 40 11 50 -12 6 -13 31 -33 57 -46 44 -21 50 -21 83 -8 39 17 42 22 20 46 -21 23 -12 42 42 80 54 39 71 34 91 -26 8 -21 21 -58 29 -81 15 -43 33 -57 33 -26 0 9 12 36 26 61 17 29 27 60 26 86 0 23 6 48 13 56 7 8 27 42 45 75 18 33 39 69 46 80 21 30 17 94 -10 150 -31 64 -189 222 -243 242 -64 24 -71 25 -77 14z" />
                                        <path d="M7751 2895 c-17 -20 -31 -43 -31 -53 0 -11 13 -2 40 28 21 25 39 48 40 53 1 17 -20 5 -49 -28z" />
                                        <path d="M7850 2780 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M7836 2744 c-9 -22 3 -32 14 -14 12 19 12 30 1 30 -5 0 -12 -7 -15 -16z" />
                                        <path d="M7356 2555 c-31 -25 -59 -45 -63 -45 -4 0 -19 12 -34 26 l-27 26 -40 -21 c-23 -12 -48 -21 -57 -21 -12 0 -13 -3 -4 -19 19 -29 3 -50 -58 -77 -82 -36 -88 -40 -85 -56 1 -9 -5 -21 -13 -28 -22 -18 -18 -30 11 -30 19 0 28 8 40 35 17 41 17 41 53 16 14 -10 33 -21 41 -23 30 -6 218 84 242 117 5 5 7 17 6 25 -3 22 21 61 56 92 29 25 30 27 9 28 -12 0 -47 -20 -77 -45z" />
                                        <path d="M7690 2590 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M6640 2570 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M6740 2572 c0 -20 39 -43 67 -40 28 4 28 4 -12 23 -22 10 -43 21 -47 23 -5 2 -8 -1 -8 -6z" />
                                        <path d="M7660 2570 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M7686 2561 c-4 -7 -5 -15 -2 -18 9 -9 19 4 14 18 -4 11 -6 11 -12 0z" />
                                        <path d="M6562 2538 c5 -15 37 -18 41 -3 1 6 -9 12 -22 13 -16 3 -22 -1 -19 -10z" />
                                        <path d="M6655 2541 c-3 -5 -1 -12 5 -16 13 -8 50 3 50 16 0 12 -47 12 -55 0z" />
                                        <path d="M7607 2543 c-10 -9 -9 -23 2 -23 5 0 11 7 15 15 5 15 -5 20 -17 8z" />
                                        <path d="M7640 2525 c-7 -8 -8 -15 -2 -15 5 0 15 7 22 15 7 8 8 15 2 15 -5 0 -15 -7 -22 -15z" />
                                        <path d="M7595 2499 c-11 -17 1 -21 15 -4 8 9 8 15 2 15 -6 0 -14 -5 -17 -11z" />
                                        <path d="M7546 2474 c-4 -10 -1 -14 6 -12 15 5 23 28 10 28 -5 0 -13 -7 -16 -16z" />
                                        <path d="M7423 2473 c-19 -7 -16 -23 5 -23 10 0 28 -7 40 -16 33 -23 40 -9 12 21 -23 25 -33 28 -57 18z" />
                                        <path d="M6635 2440 c-3 -5 -3 -15 1 -21 3 -6 1 -15 -5 -19 -9 -5 -7 -23 9 -71 12 -35 27 -67 33 -72 7 -4 27 -5 44 -2 18 3 42 1 53 -5 24 -13 26 -3 5 20 -12 13 -27 16 -61 12 -41 -4 -46 -3 -42 14 3 14 11 18 31 17 29 -2 34 6 16 24 -8 8 -9 20 -1 41 16 46 -7 60 -26 16 -16 -33 -32 -22 -32 22 0 33 -12 45 -25 24z" />
                                        <path d="M7475 2390 c-27 -30 -14 -33 20 -5 21 17 25 24 14 25 -9 0 -24 -9 -34 -20z" />
                                        <path d="M6865 2380 c-4 -6 7 -10 24 -10 17 0 31 5 31 10 0 6 -11 10 -24 10 -14 0 -28 -4 -31 -10z" />
                                        <path d="M7880 2300 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M6850 2277 c0 -36 10 -57 27 -57 9 0 11 5 6 13 -4 6 -8 23 -8 36 0 13 -6 26 -12 28 -8 3 -13 -5 -13 -20z" />
                                        <path d="M7020 2070 c0 -7 3 -10 7 -7 3 4 3 10 0 14 -4 3 -7 0 -7 -7z" />
                                        <path d="M4143 1293 c4 -3 10 -3 14 0 3 4 0 7 -7 7 -7 0 -10 -3 -7 -7z" />
                                        <path d="M3880 1231 c0 -6 5 -13 10 -16 6 -3 10 1 10 9 0 9 -4 16 -10 16 -5 0 -10 -4 -10 -9z" />
                                        <path d="M3745 1170 c3 -5 8 -10 11 -10 3 0 2 5 -1 10 -3 6 -8 10 -11 10 -3 0 -2 -4 1 -10z" />
                                        <path d="M3583 1163 c4 -3 10 -3 14 0 3 4 0 7 -7 7 -7 0 -10 -3 -7 -7z" />
                                        <path d="M4790 719 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10 -5 -10 -11z" />
                                        <path d="M4733 233 c4 -3 10 -3 14 0 3 4 0 7 -7 7 -7 0 -10 -3 -7 -7z" />
                                        <path d="M4773 223 c4 -3 10 -3 14 0 3 4 0 7 -7 7 -7 0 -10 -3 -7 -7z" />
                                        <path d="M4005 200 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0 -7 -4 -4 -10z" />
                                    </g>
                                    <g id="africa" fill="#44a1ad" stroke="none">
                                        <path d="M3992 3258 c-7 -7 -12 -23 -12 -37 0 -14 -17 -54 -39 -90 -26 -45 -42 -88 -50 -136 -7 -38 -25 -99 -41 -135 -44 -100 -44 -108 -12 -183 28 -66 28 -69 15 -133 -14 -67 -46 -137 -85 -186 -20 -25 -21 -32 -11 -85 13 -70 1 -107 -37 -111 -51 -5 -70 -13 -70 -26 0 -7 -13 -19 -29 -26 -25 -10 -40 -9 -93 8 -35 12 -106 24 -158 27 -95 7 -95 7 -137 -24 -25 -18 -53 -51 -67 -80 -14 -26 -38 -60 -55 -74 -16 -13 -27 -28 -24 -31 4 -3 2 -6 -3 -6 -14 0 -11 -76 4 -128 10 -33 11 -52 3 -74 -6 -17 -11 -39 -11 -49 0 -34 84 -160 136 -205 35 -29 53 -54 58 -76 4 -21 24 -48 58 -80 52 -48 71 -57 83 -38 10 16 35 12 100 -15 45 -18 79 -25 133 -25 40 0 83 -5 94 -11 27 -14 41 0 42 44 2 43 18 63 57 71 17 3 49 19 72 35 57 40 107 46 107 12 0 -11 7 -27 16 -35 14 -14 19 -14 52 0 57 25 151 45 194 42 39 -3 40 -2 57 42 10 25 41 86 69 137 28 50 54 104 58 118 10 42 68 131 118 185 25 27 51 61 58 75 16 35 42 39 120 17 37 -11 70 -17 73 -14 14 14 1 61 -35 132 -31 58 -65 101 -134 171 -51 52 -103 110 -115 129 -25 42 -27 105 -5 158 8 20 18 64 21 97 5 55 3 63 -21 91 -14 17 -38 37 -53 43 -16 7 -41 31 -57 53 -25 37 -27 45 -18 76 13 42 5 62 -38 92 -22 16 -30 29 -30 52 0 16 -9 40 -19 52 -83 93 -119 130 -141 140 -37 19 -183 29 -198 14z" />
                                        <path d="M4630 2991 c-16 -31 -12 -71 11 -108 16 -25 19 -42 15 -68 -6 -29 -3 -38 16 -55 13 -10 45 -40 72 -65 36 -34 52 -42 58 -33 15 24 8 62 -28 173 -59 176 -58 175 -98 175 -25 0 -38 -6 -46 -19z" />
                                        <path d="M4985 2860 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0 -7 -4 -4 -10z" />
                                        <path d="M4635 2660 c-4 -6 3 -10 14 -10 25 0 27 6 6 13 -8 4 -17 2 -20 -3z" />
                                        <path d="M4970 2440 c0 -7 3 -10 7 -7 3 4 3 10 0 14 -4 3 -7 0 -7 -7z" />
                                        <path d="M2920 1850 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                                        <path d="M2863 1793 c4 -3 10 -3 14 0 3 4 0 7 -7 7 -7 0 -10 -3 -7 -7z" />
                                    </g>

                                </svg>
                            </div>
                        </div>
                            : null}
                    <div className="col-3 p-3"><div className="col-12 bg-light bordercustom border-danger p-3">
                        <i className="text-danger material-icons md-dark">label</i>  <h5>Sales by types</h5>
                        <hr />
                        <h6><b>By categories</b></h6>
                        {category}
                        <br />
                        <h6><b>By subcategories</b></h6>
                        {subcategory}
                    </div> </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);

