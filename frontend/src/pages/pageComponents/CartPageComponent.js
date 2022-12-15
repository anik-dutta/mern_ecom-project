// external imports
import { Row, Col, Container, Alert, ListGroup, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// internal import
import CardItemComponent from '../../components/CardItemComponent';
import MetaComponent from '../../components/MetaComponent';

export default function CartPageComponent({ addToCart, removeFromCart, cartItems, cartSubtotal, reduxDispatch, itemsCount }) {
    const changeCount = (productID, quantity) => {
        reduxDispatch(addToCart(productID, quantity));
    };

    const removeFromCartHandler = (productID, quantity, price) => {
        if (window.confirm('Removing the product from your cart. Press "Ok" to confirm.')) {
            reduxDispatch(removeFromCart(productID, quantity, price));
        }
    };

    return (
        <>
            <MetaComponent title="A2Z - My Cart" />
            <Container fluid >
                <Row className="m-3">
                    <h3>Shopping Cart</h3>
                    <Col md={9}>
                        {cartItems.length === 0 ? (
                            <Alert variant="info" className="mt-2">Your cart is empty</Alert>
                        ) : (
                            <ListGroup variant="flush">
                                {cartItems.map((item, idx) => (
                                    <CardItemComponent item={item} key={idx} changeCount={changeCount} removeFromCartHandler={removeFromCartHandler} />
                                ))}
                            </ListGroup>
                        )}

                    </Col>
                    <Col md={3}>
                        <ListGroup>
                            <ListGroup.Item>
                                <h5>Subtotal ({cartItems.length === 1 || cartItems.length === 0 ? <>{cartItems.length}{" "}Product</> : <>{cartItems.length}{" "}Products</>})</h5>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Net Quantity:<span className="fw-bold ms-1">{itemsCount}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Total Cost:<span className="fw-bold ms-1">${cartSubtotal}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <LinkContainer to="/user/cart-details">
                                    <Button disabled={cartSubtotal === 0} variant="warning">Proceed to Checkout</Button>
                                </LinkContainer>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </>
    );
}