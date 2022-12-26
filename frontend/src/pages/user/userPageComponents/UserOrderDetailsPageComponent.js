// external imports
import { Container, Row, Col, Form, Alert, ListGroup, Button } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

// internal imports
import MetaComponent from "../../../components/MetaComponent";
import CardItemComponent from '../../../components/CardItemComponent';

export default function UserOrderDetailsPageComponent({ userInfo, getUser, getOrder, loadPayPalScript }) {
    const [user, setUser] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [orderButtonMessage, setOrderButtonMessage] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [cartSubtotal, setCartSubtotal] = useState(0);
    const [itemsCount, setItemsCount] = useState(0);
    const [isDelivered, setIsDelivered] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const { id } = useParams();
    const paypalContainer = useRef();

    useEffect(() => {
        getUser(userInfo._id)
            .then(result => {
                setUser(result);
            })
            .catch(err => {
                console.log(err.response.data.message ? err.response.data.message : err.response.data);
            });
    }, [userInfo._id, getUser]);

    useEffect(() => {
        getOrder(id)
            .then(result => {
                setPaymentMethod(result.paymentMethod);
                setCartItems(result.cartItems);
                setCartSubtotal(result.orderTotal.cartSubtotal);
                setItemsCount(result.orderTotal.itemsCount);
                result.isDelivered ? setIsDelivered(result.deliveredAt) : setIsDelivered(false);
                result.isPaid ? setIsPaid(result.paidAt) : setIsPaid(false);
                if (result.isPaid) {
                    setOrderButtonMessage('Your order is complete');
                    setButtonDisabled(true);
                } else {
                    if (result.paymentMethod === 'pp') {
                        setOrderButtonMessage('Pay for your order');
                    } else if (result.paymentMethod === 'cod') {
                        setButtonDisabled(true);
                        setOrderButtonMessage('Wait for your order. You pay on delivery');
                    }
                }
            })
            .catch(err => {
                console.log(err.response.data.message ? err.response.data.message : err.response.data);
            });
    }, [getOrder, id]);

    const orderHandler = () => {
        setButtonDisabled(true);
        if (paymentMethod === 'pp') {
            setOrderButtonMessage('To pay for the order, click one of the buttons below');
            if (!isPaid) {
                loadPayPalScript(cartSubtotal, cartItems, id, updateStateAfterOrder);
            } else {
                setOrderButtonMessage('Your order was placed');
            }
        }
    };

    const updateStateAfterOrder = (paidAt) => {
        setOrderButtonMessage('Payment completed');
        setIsPaid(paidAt);
        setButtonDisabled(true);
        paypalContainer.current.style = "display:none";
    };

    return (
        <>
            <MetaComponent title="A2Z - Order Details" />
            <Container fluid>
                <Row className="m-3">
                    <h3>Order Details</h3>
                    <Col md={8} className="mt-2">
                        <Row>
                            <Col md={6}>
                                <h5>Shipping To</h5>
                                <b>Name: </b> {user.name}{' '}{user.lastName}<br />
                                <b>Address: </b>{user.address}{', '}{user.city}{', '}{user.state}{'-'}{user.zipCode}{', '}{user.country}<br />
                                <b>Phone: </b>{user.phoneNumber}<br />
                            </Col>
                            <Col md={6}>
                                <h5>Payment Method</h5>
                                <Form.Select disabled={true} value={paymentMethod}>
                                    <option value="pp">PayPal</option>
                                    <option value="visa">Visa</option>
                                    <option value="cod">Cash on Delivery (delivery may be delayed)</option>
                                </Form.Select>
                            </Col>
                            <Row>
                                <Col>
                                    <Alert className="mt-3" variant={isDelivered ? "success" : "danger"}>
                                        {isDelivered ? <>Delivered at {isDelivered}</> : <>Not Delivered</>}
                                    </Alert>
                                </Col>
                                <Col className="ms-4 pe-0">
                                    <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>
                                        {isPaid ? <>Paid at {isPaid}</> : <>Not paid yet</>}
                                    </Alert>
                                </Col>
                            </Row>
                        </Row>
                        <br />
                        <h5>Order Items</h5>
                        <ListGroup variant="flush">
                            {cartItems.map((item, idx) => (
                                <CardItemComponent item={item}
                                    orderCreated={true} key={idx} />
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={4} className="mt-2">
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
                                <div className="d-grid gap-2">
                                    <Button type="button" variant="warning" disabled={buttonDisabled} onClick={orderHandler}>{orderButtonMessage}</Button>
                                </div>
                                <div style={{ position: "relative", zIndex: 1, marginTop: "1rem" }}>
                                    <div ref={paypalContainer} id="paypal-container-element"></div>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </>
    );
}