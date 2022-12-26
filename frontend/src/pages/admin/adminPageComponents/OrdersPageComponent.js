// external imports
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// internal imports 
import AdminLinksComponent from '../../../components/adminComponents/AdminLinksComponent';
import { logout } from '../../../redux/actions/userActions';
import MetaComponent from '../../../components/MetaComponent';

export default function OrdersPageComponent(props) {
    const { getOrders } = props;

    const [orders, setOrders] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        getOrders()
            .then(result => {
                setOrders(result);
            })
            .catch(err => {
                if (err.message !== 'canceled') {
                    dispatch(logout());
                }
            });
    }, [getOrders, dispatch]);

    return (
        <>
            <MetaComponent title="A2Z - All Orders" />
            <Container fluid className="mt-3">
                <Row className="m-3">
                    <Col md={2}>
                        <AdminLinksComponent />
                    </Col>
                    <Col md={10}>
                        <Row className="mb-2">
                            <Col md={5}>
                                <h3>Orders</h3>
                            </Col>
                            <Col md={5} className="pt-3">
                                <h6 >Total orders: {orders.length}</h6>
                            </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr className="text-center">
                                    <th>#</th>
                                    <th>User</th>
                                    <th>Date</th>
                                    <th>Delivered</th>
                                    <th>Total Price ($)</th>
                                    <th>Payment Method</th>
                                    <th>Order Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(
                                    (order, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                {order.user !== null && <>{order.user.name}{' '}{order.user.lastName}</>}
                                            </td>
                                            <td className="text-center">{order.createdAt.substring(0, 10)}</td>
                                            <td className="text-center">
                                                {order.isDelivered ? <i className="bi bi-check-lg text-success" /> : <i className="bi bi-x-lg text-danger" />}
                                            </td>
                                            <td className="text-center">{order.orderTotal.cartSubtotal}</td>
                                            <td className="text-center">{order.paymentMethod}</td>
                                            <td className="text-center">
                                                <Link to={`/admin/order-details/${order._id}`} >
                                                    Check details
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </Table>
                    </Col>

                </Row>
            </Container>
        </>
    );
}