// external imports
import { Row, Col, Container, Image, ListGroup, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import ImageZoom from 'js-image-zoom';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

// internal imports
import AddedToCartMessageComponent from "../../components/AddedToCartMessageComponent";
import MetaComponent from '../../components/MetaComponent';

export default function ProductDetailsPageComponent({ addToCartReduxAction, reduxDispatch, getProductDetails, userInfo, writeReviewApiRequest }) {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [productReviewed, setProductReviewed] = useState(false);

    const messageEndRef = useRef();

    useEffect(() => {
        if (product.images) {
            var options = {
                // width: 400,
                // zoomWidth: 500,
                // fillContainer: true,
                // zoomPosition: "bottom",
                scale: 2,
                offset: { vertical: 0, horizontal: 0 },
            };
            product.images.map((image, id) => {
                return new ImageZoom(document.getElementById(`imageId${id + 1}}`), options);
            });
        }
    }, [product]);

    useEffect(() => {
        if (productReviewed) {
            setTimeout(() => {
                messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }, 200);
        }
    }, [productReviewed]);

    useEffect(() => {
        getProductDetails(id)
            .then(result => {
                setProduct(result);
                setLoading(false);
            })
            .catch(err => {
                setError(err.response.data.message ? err.response.data.message : err.response.data);
            });
    }, [id, getProductDetails, product.reviews]);

    const onChangeHandler = (e) => {
        setQuantity(e.target.value);
    };

    const addToCartHandler = () => {
        reduxDispatch(addToCartReduxAction(id, quantity));
        setShowCartMessage(true);
    };

    const sendReviewHandler = (e) => {
        e.preventDefault();

        const form = e.currentTarget.elements;
        const formInputs = {
            comment: form.comment.value.trim(),
            rating: form.rating.value,
        };
        if (e.currentTarget.checkValidity() === true) {
            writeReviewApiRequest(product._id, formInputs)
                .then(result => {
                    if (result === 'Review submitted!') {
                        setProductReviewed(result);
                    }
                })
                .catch(err => {
                    setProductReviewed(err.response.data.message ? err.response.data.message : err.response.data);
                });
        }
    };

    return (
        <>
            <MetaComponent title={product.name} description={product.description} />
            <Container>
                <AddedToCartMessageComponent showCartMessage={showCartMessage} setShowCartMessage={setShowCartMessage} />
                <Row className="mt-5">
                    {loading ? (
                        <h3 className="text-info"><Spinner as="span" variant="info" animation="border" size="md" role="status" aria-hidden="true" />{" "}Loading product details</h3>
                    ) : error ? (
                        <h3>{error}</h3>
                    ) : (<>
                        <Col md={4} style={{ zIndex: 1 }}>
                            {product.images ? product.images.map((image, idx) => (
                                <div key={idx}>
                                    <div id={`imageId${idx + 1}}`} key={idx}>
                                        <Image crossOrigin="anonymous" fluid src={image.path ?? null} />
                                    </div>
                                    <br />
                                </div>
                            )) : null}
                        </Col>
                        <Col md={8}>
                            <Row>
                                <Col md={8}>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
                                        <ListGroup.Item>
                                            <span className="fw-bold text-danger me-1">{product.rating.toFixed(1)}</span>
                                            <Rating readonly size={22} initialValue={product.rating.toFixed(1)} allowFraction className="mb-1" />
                                            <span className="text-secondary ms-1">({product.reviewsNumber})</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Price:{" "}<span className="fw-bold">${product.price}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            {product.description}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col md={4}>
                                    <ListGroup>
                                        <ListGroup.Item>
                                            Status:
                                            {product.count > 0 ? (<span
                                                style={{
                                                    color: '#39d615', fontWeight: 'bold'
                                                }} className="ms-1">in stock</span>
                                            ) : (<span
                                                style={{
                                                    color: "red", fontWeight: 'bold'
                                                }}>out of stock</span>)}
                                        </ListGroup.Item>
                                        {/* <ListGroup.Item>
                                        Price:{" "}<span className="fw-bold">${product.price}</span>
                                    </ListGroup.Item> */}
                                        <ListGroup.Item>
                                            Quantity:{" "}
                                            <Form.Select size="lg" aria-label="Default select example" onChange={e => onChangeHandler(e)} value={quantity}>
                                                {[...Array(product.count).keys()].map(x => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))}
                                            </Form.Select>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Button onClick={addToCartHandler} variant="warning">Add to cart</Button>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-5">
                                    <h5 className="text-success ms-3">Reviews</h5>
                                    <ListGroup variant="flush">
                                        {product.reviews &&
                                            product.reviews.map((review, idx) => (
                                                <ListGroup.Item key={idx}>
                                                    {review.user.name}<br />
                                                    <Rating readonly size={20} allowFraction initialValue={review.rating} />
                                                    <br />
                                                    {review.createdAt.substring(0, 10)} <br />
                                                    {review.comment}
                                                </ListGroup.Item>
                                            ))}
                                        <div ref={messageEndRef}></div>
                                    </ListGroup>
                                </Col>
                            </Row>
                            <hr />

                            {!userInfo.name && <Alert variant="danger">Login first to write a review</Alert>}

                            <Form onSubmit={sendReviewHandler}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Write your review of this product</Form.Label>
                                    <Form.Control name="comment" required as="textarea" disabled={!userInfo.name} rows={3} placeholder="Review" />
                                </Form.Group>
                                <Form.Select name="rating" required disabled={!userInfo.name} aria-label="Default select example">
                                    <option value="">Rate this product</option>
                                    <option value="5">5 (excellent)</option>
                                    <option value="4">4 (good)</option>
                                    <option value="3">3 (average)</option>
                                    <option value="2">2 (bad)</option>
                                    <option value="1">1 (awful)</option>
                                </Form.Select>
                                <Button disabled={!userInfo.name} type="submit" className="mb-3 mt-3" variant="primary">Submit</Button>

                                {productReviewed && <Alert variant="info" className="mt-2">{productReviewed}</Alert>}
                            </Form>
                        </Col>
                    </>
                    )}
                </Row>
            </Container>
        </>
    );
};