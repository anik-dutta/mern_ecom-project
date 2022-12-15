// external imports
import { Container, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// internal import
import MetaComponent from "../../../components/MetaComponent";

export default function UserOrdersPageComponent({ getOrders }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getOrders().then(result => {
            setOrders(result);
        })
            .catch(err => {
                console.log(err.response.data.message ? err.response.data.message : err.response.data);
            });
    }, [getOrders]);

    return (
        <>
            <MetaComponent title="A2Z - My Orders" />
            <Container fluid className="mt-3">
                <Row className="m-4">
                    <Col>
                        <h3 className="mb-3">My Orders</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Date</th>
                                    <th>Delivered</th>
                                    <th>Total Price</th>
                                    <th>Order Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(
                                    (order, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>You</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>
                                                {order.isDelivered ? <i className="bi bi-check-lg text-success" /> : <i className="bi bi-x-lg text-danger" />}
                                            </td>
                                            <td>{order.orderTotal.cartSubtotal}</td>
                                            <td>
                                                <Link to={`/user/order-details/${order._id}`}>
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