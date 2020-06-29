import React, { useState } from 'react';
import Footer from '../footer/Footer';
import { UncontrolledCollapse, Button, Collapse, CardBody, Card } from 'reactstrap';

function Questions() {

    return (
        <>
            <div className="container mb-5">
                <h1>Frequently Asked Questions</h1>

                <h2 id="toggler" >Where can I buy blueprint. products ?</h2>
                <UncontrolledCollapse toggler="#toggler">
                    <Card>
                        <CardBody>
                            <p>Our online store ships the blueprint. range to many destinations worldwide. We aim to offer the full range of products at all times (subject to availability). Our products are also available in specialty retailers and concept stores around the world. blueprint. cannot guarantee nor supervise the availability of stock at our reseller locations. For details of our official retailers, please write us a message on the Customer Support page.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler0" >How can I know what's in stock ?</h2>
                <UncontrolledCollapse toggler="#toggler0">
                    <Card>
                        <CardBody>
                            <p>The styles and materials shown on the blueprint. online store represent our current product selection. Availability is shown on each product detail page. Our collections are constantly evolving, and certain seasonal colours and styles are available for a limited time only. Sign up for the blueprint. newsletter to stay up to date on new arrivals and offers.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler1" >Which currency are your prices shown in ?</h2>
                <UncontrolledCollapse toggler="#toggler1">
                    <Card>
                        <CardBody>
                            <p>In our North Americas and Asia-Pacific webstores prices are displayed in USD. In our European online stores, prices are displayed in EUR.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler2" >Do you ship worldwide? What does it cost ?</h2>
                <UncontrolledCollapse toggler="#toggler2">
                    <Card>
                        <CardBody>
                            <p>We ship to many destinations worldwide. We offer free standard shipping to all destinations listed. For more information and Express Shipping charges for your country, please refer to our Shipping Info page.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler3" >Can I track my order ?</h2>
                <UncontrolledCollapse toggler="#toggler3">
                    <Card>
                        <CardBody>
                            <p>Yes, once your order has been dispatched from our warehouse you will receive an email with a tracking number.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler4" >What is your return policy ?</h2>
                <UncontrolledCollapse toggler="#toggler4">
                    <Card>
                        <CardBody>
                            <p>You may return products within 14 days of delivery of your order. To proceed with a return, please open a Return Request on your blueprint. account and follow the instructions provided. You are responsible for the return shipping costs.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler5" >Is my product covered by warranty ?</h2>
                <UncontrolledCollapse toggler="#toggler5">
                    <Card>
                        <CardBody>
                            <p>There is a 12-month warranty on all bag and a 6-month warranty on sleeves. For more more information see our&nbsp;Warranty page.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler6" >I have experienced some technical problems in the online store.</h2>
                <UncontrolledCollapse toggler="#toggler6">
                    <Card>
                        <CardBody>
                            <p>If you are experiencing technical problems with the online store please let us know at support@coteetciel.com. If you are able to attach a screenshot of the issue, this will aid us in finding a solution.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler7" >How can I clean my blueprint. product ?</h2>
                <UncontrolledCollapse toggler="#toggler7">
                    <Card>
                        <CardBody>
                            <p>We recommend that you clean your product by wiping with a slightly damp cloth soaked in water only. blueprint. cannot guarantee the product will not be discoloured or damaged with alternative methods and liquids. blueprint. advise against waterproof sprays, as these may result in fabric discolouration. blueprint. warranties do not cover damages resulting from inappropriate cleaning methods.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler8" >How do I know if my laptop/device fits into a blueprint. bag ?</h2>
                <UncontrolledCollapse toggler="#toggler8">
                    <Card>
                        <CardBody>
                            <p>blueprint. bags are designed to accommodate almost all models of laptops in the sizes nominated on the product (e.g. 17”/15”/13” etc.). If you are unsure, the dimensions of the device pocket can be found in the product detail page for your reference.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>

                <h2 id="toggler9" >How can I be sure of the authenticity of products ?</h2>
                <UncontrolledCollapse toggler="#toggler9">
                    <Card>
                        <CardBody>
                            <p>blueprint. authenticity is proven by the logo blueprint., and our products are only available in our online store and at certified retailers and online platforms.</p>
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>
            </div>

            <Footer />
        </>
    )
}

export default Questions;