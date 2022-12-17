// external imports
import { Container, Row, Col, Form } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

// internal imports
import MetaComponent from '../../../components/MetaComponent';
import AdminLinksComponent from '../../../components/adminComponents/AdminLinksComponent';

export default function AnalyticsPageComponent(props) {
    const { fetchOrdersForFirstDate, fetchOrdersForSecondDate, socketIOClient } = props;

    const [firstDateToCompare, setFirstDateToCompare] = useState(new Date().toISOString().substring(0, 10));

    let previousDay = new Date();
    previousDay.setDate(previousDay.getDate() - 1);

    const [secondDateToCompare, setSecondDateToCompare] = useState(new Date(previousDay).toISOString().substring(0, 10));
    const [dataForFirstSet, setDataForFirstSet] = useState([]);
    const [dataForSecondSet, setDataForSecondSet] = useState([]);

    useEffect(() => {
        const socket = socketIOClient();
        socket.on('newOrder', (data) => console.log(data));
    }, [setDataForFirstSet, setDataForSecondSet, firstDateToCompare, secondDateToCompare, socketIOClient]);

    useEffect(() => {
        const abctrl = new AbortController();
        fetchOrdersForFirstDate(abctrl, firstDateToCompare)
            .then(data => {
                let orderSum = 0;
                const orders = data.map(order => {
                    orderSum += order.orderTotal.cartSubtotal;
                    let time = new Date(order.createdAt).toLocaleString('en-US', {
                        hour: 'numeric',
                        hour12: true,
                        timeZone: 'UTC',
                    });
                    return { name: time, [firstDateToCompare]: orderSum };
                });
                setDataForFirstSet(orders);
            })
            .catch(err =>
                console.log(err.response.data.message ? err.response.data.message : err.response.data)
            );

        fetchOrdersForSecondDate(abctrl, secondDateToCompare)
            .then(data => {
                let orderSum = 0;
                const orders = data.map(order => {
                    orderSum += order.orderTotal.cartSubtotal;
                    let time = new Date(order.createdAt).toLocaleString('en-US', {
                        hour: 'numeric',
                        hour12: true,
                        timeZone: 'UTC',
                    });
                    return { name: time, [secondDateToCompare]: orderSum };
                });
                setDataForSecondSet(orders);
            })
            .catch(err =>
                console.log(err.response.data.message ? err.response.data.message : err.response.data)
            );

        return () => abctrl.abort();
    }, [firstDateToCompare, secondDateToCompare, fetchOrdersForFirstDate, fetchOrdersForSecondDate]);

    const firstDateHandler = (e) => {
        setFirstDateToCompare(e.target.value);
    };

    const secondDateHandler = (e) => {
        setSecondDateToCompare(e.target.value);
    };

    return (
        <>
            <MetaComponent title="A2Z - Analytics" />
            <Container fluid className="mt-3">
                <Row className="m-3">
                    <Col md={2}>
                        <AdminLinksComponent />
                    </Col>
                    <Col md={10}>
                        <h3>Cumulative Revenue {firstDateToCompare} VS {secondDateToCompare}</h3>
                        <Form.Group controlId="firstDateToCompare">
                            <Form.Label>Select First Date To Compare</Form.Label>
                            <Form.Control
                                onChange={firstDateHandler}
                                type="date"
                                name="firstDateToCompare"
                                placeholder="First Date To Compare"
                                defaultValue={firstDateToCompare}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="secondDateToCompare">
                            <Form.Label>Select Second Date To Compare</Form.Label>
                            <Form.Control
                                onChange={secondDateHandler}
                                type="date"
                                name="secondDateToCompare"
                                placeholder="Second Date To Compare"
                                defaultValue={secondDateToCompare}
                            />
                        </Form.Group>
                        <ResponsiveContainer width="100%" height={450}>
                            <LineChart margin={{ top: 5, right: 20, left: 20, bottom: 15 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" label={{ value: "TIME", offset: 4, position: "bottom" }} allowDuplicatedCategory={false} />
                                <YAxis label={{ value: "REVENUE ($)", angle: -90, position: "insideLeft", offset: -12 }} />
                                <Tooltip />
                                <Legend verticalAlign="top" height={50} />

                                {dataForFirstSet.length > dataForSecondSet.length ? (
                                    <>
                                        <Line data={dataForFirstSet} type="monotone" dataKey={firstDateToCompare} stroke="#214aff" activeDot={{ r: 7 }} strokeWidth={3} />
                                        <Line data={dataForSecondSet} type="monotone" dataKey={secondDateToCompare} stroke="#34fa1e" strokeWidth={3} />
                                    </>
                                ) : (
                                    <>
                                        <Line data={dataForSecondSet} type="monotone" dataKey={secondDateToCompare} stroke="#214aff" strokeWidth={3} />
                                        <Line data={dataForFirstSet} type="monotone" dataKey={firstDateToCompare} stroke="#34fa1e" activeDot={{ r: 7 }} strokeWidth={3} />
                                    </>
                                )}

                            </LineChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
            </Container>
        </>
    );
};