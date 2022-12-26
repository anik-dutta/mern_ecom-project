// external imports
import { Container, Row, Col, Form, Alert, ListGroup, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// internal imports
import CardItemComponent from '../../../components/CardItemComponent';
import { logout } from '../../../redux/actions/userActions';
import MetaComponent from '../../../components/MetaComponent';

export default function OrderDetailsPageComponent(props) {
    const { getOrder, markAsDelivered } = props;
    const { id } = useParams();

    const [userInfo, setUserInfo] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [isDelivered, setIsDelivered] = useState(false);
    const [cartSubtotal, setCartSubtotal] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [orderButtonMessage, setOrderButtonMessage] = useState('Mark as delivered');
    const [cartItems, setCartItems] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        getOrder(id)
            .then(order => {
                setUserInfo(order.user);
                setPaymentMethod(order.paymentMethod);
                order.isPaid ? setIsPaid(order.paidAt) : setIsPaid(false);
                order.isDelivered ? setIsDelivered(order.deliveredAt) : setIsDelivered(false);
                setCartSubtotal(order.orderTotal.cartSubtotal);
                if (order.isDelivered) {
                    setOrderButtonMessage('Order completed');
                    setButtonDisabled(true);
                }
                setCartItems(order.cartItems);
            })
            .catch(err => {
                if (err.message !== 'canceled') {
                    dispatch(logout());
                }
            }
            );
    }, [isDelivered, id, getOrder, dispatch]);

    return (
        <>
            <MetaComponent title="A2Z - Order Details" />
            <Container fluid>
                <Row className="m-3">
                    <h3>Order Details</h3>
                    <Col md={8} className="mt-2">
                        <Row>
                            <Col md={6}>
                                <h5>Shipping</h5>
                                <strong>Name: </strong>{userInfo.name}{' '}{userInfo.lastName}<br />
                                <strong>Address: </strong> {userInfo.address}{' '}{userInfo.city}{' '}{userInfo.state}{' '}{userInfo.zipCode}{' '}{userInfo.country}<br />
                                <strong>Phone: </strong>{userInfo.phone}<br />
                            </Col>
                            <Col md={6}>
                                <h5>Payment Method</h5>
                                <Form.Select value={paymentMethod} disabled={true}>
                                    <option value="pp">PayPal</option>
                                    <option value="cod">Cash on Delivery (delivery may be delayed)</option>
                                </Form.Select>
                            </Col>
                            <Row>
                                <Col>
                                    <Alert className="mt-3" variant={isDelivered ? 'success' : 'danger'}>
                                        {isDelivered ? <>Delivered on {isDelivered}</> : <>Not delivered yet</>}
                                    </Alert>
                                </Col>
                                <Col className="ms-4 pe-0">
                                    <Alert className="mt-3" variant={isPaid ? 'success' : 'danger'}>
                                        {isPaid ? <>Paid on {isPaid}</> : <>Not paid yet</>}
                                    </Alert>
                                </Col>
                            </Row>
                        </Row>
                        <br />
                        <h5>Order Items</h5>
                        <ListGroup variant="flush">
                            {cartItems.map((item, idx) => (
                                <CardItemComponent key={idx} item={item} orderCreated={true} />
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={4} className="mt-2">
                        <ListGroup>
                            <ListGroup.Item>
                                <h5>Order Summery</h5>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Items price (after tax): <span className="fw-bold">${cartSubtotal}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Shipping: <span className="fw-bold">included</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Tax: <span className="fw-bold">included</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="fw-bold">
                                Total price: <span className="text-danger ">${cartSubtotal}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div className="d-grid gap-2">
                                    <Button type="button" variant={isDelivered ? 'success' : 'warning'} disabled={buttonDisabled} onClick={() => markAsDelivered(id)
                                        .then(res => {
                                            if (res) {
                                                setIsDelivered(true);
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err.response.data.message ? err.response.data.message : err.response.data);
                                        })
                                    }>
                                        {orderButtonMessage}
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container >
        </>
    );
}