// external imports
import { Container, Row, Col, Form, Alert, ListGroup, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// internal imports
import CardItemComponent from '../../../components/CardItemComponent';
import MetaComponent from "../../../components/MetaComponent";

export default function UserCartDetailsPageComponent({ cartItems, cartSubtotal, itemsCount, userInfo, reduxDispatch, addToCart, removeFromCart, getUser, createOrder }) {

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [user, setUser] = useState({});
    const [missingInfo, setMissingInfo] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('pp');
    const navigate = useNavigate();

    useEffect(() => {
        getUser(userInfo._id)
            .then(result => {
                setUser(result);

                if (!result.address || !result.city || !result.state || !result.zipCode || !result.country || !result.phoneNumber) {
                    setButtonDisabled(true);
                    setMissingInfo('. In order to place an order, complete your profile by providing address, city name, country, zip code, phone number.');
                } else {
                    setMissingInfo(false);
                }
            })
            .catch(err => {
                console.log(err.response.data.message ? err.response.data.message : err.response.data);
            });
    }, [userInfo._id, getUser]);

    const changeCount = (productID, quantity) => {
        reduxDispatch(addToCart(productID, quantity));
    };

    const removeFromCartHandler = (productID, quantity, price) => {
        if (window.confirm('Removing the product from your cart. Press "Ok" to confirm.')) {
            reduxDispatch(removeFromCart(productID, quantity, price));
        }
    };

    const orderHandler = () => {
        const orderData = {
            orderTotal: {
                itemsCount,
                cartSubtotal,
            },
            cartItems: cartItems.map(product => {
                return {
                    productID: product.productID,
                    name: product.name,
                    price: product.price,
                    image: { path: product.image ? (product.image.path ?? null) : null },
                    quantity: product.quantity,
                    count: product.count,
                };
            }),
            paymentMethod,
        };
        createOrder(orderData)
            .then(result => {
                if (result) {
                    navigate(`/user/order-details/${result._id}`);
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    };

    const choosePayment = (e) => {
        setPaymentMethod(e.target.value);
    };

    return (
        <>
            <MetaComponent title="A2Z - Cart Details" />
            <Container fluid>
                <Row className="m-3">
                    <h3>Cart Details</h3>
                    <Col md={9} className="mt-3">
                        <Row>
                            <Col md={6}>
                                <h5>Shipping To</h5>
                                <b>Name: </b>{user.name}{' '}{user.lastName}<br />
                                <b>Address: </b>
                                {missingInfo === false ?
                                    <>
                                        {user.address}{', '}{user.city}{', '}{user.state}{'-'}{user.zipCode}{', '}{user.country}
                                    </> : <>
                                        {user.address}{' '}{user.city}{' '}{user.state}{' '}{user.zipCode}{' '}{user.country}
                                    </>}<br />
                                <b>Phone: </b>{user.phoneNumber}<br />
                            </Col>
                            <Col md={6}>
                                <h5>Payment Method</h5>
                                <Form.Select onChange={choosePayment}>
                                    <option value="pp">PayPal</option>
                                    <option value="visa">Visa</option>
                                    <option value="cod">Cash on Delivery (delivery may be delayed)</option>
                                </Form.Select>
                            </Col>
                            <Row>
                                <Col>
                                    <Alert className="mt-3" variant="danger">
                                        Not Delivered
                                        {missingInfo}
                                    </Alert>
                                </Col>
                                <Col className="ms-4 pe-0">
                                    <Alert className="mt-3" variant="success">
                                        Not paid yet
                                    </Alert>
                                </Col>
                            </Row>
                        </Row>
                        <br />
                        <h5>Order Items</h5>
                        <ListGroup variant="flush">
                            {cartItems.map((item, idx) => (
                                <CardItemComponent item={item} key={idx} removeFromCartHandler={removeFromCartHandler} changeCount={changeCount} />
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={3} className="mt-3">
                        <ListGroup>
                            <ListGroup.Item>
                                <h5>Order Summery</h5>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Net Quantity: <span className="fw-bold">{itemsCount}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price of Products (after tax): <span className="fw-bold">${cartSubtotal}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Shipping: <span className="fw-bold text-success">included</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Tax: <span className="fw-bold text-success">included</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="text-danger">
                                Total price: <span className="fw-bold">${cartSubtotal}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {buttonDisabled === true ? <Alert className="mt-2" variant="danger">In order to place an order, you are required to complete your profile first!</Alert> : null}

                                <div className="d-grid gap-2">
                                    <Button variant="warning" disabled={buttonDisabled} onClick={orderHandler}>Place Order</Button>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </>
    );
}