// external imports
import { Card, Button, Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { LinkContainer } from "react-router-bootstrap";

export default function ProductForListComponent({ productId, images, name, description, price, rating, reviewsNumber }) {
    return (
        <Card style={{ marginBottom: "10px", borderRadius: '3px' }}>
            <Row>
                <Col lg={6}>
                    <Card.Img crossOrigin="anonymous" variant="top" src={images[0] ? images[0].path : ''} style={{ borderRadius: '0' }} />
                </Col>
                <Col lg={6}>
                    <Card.Body>
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>{description}</Card.Text>
                        <Card.Text>
                            <span className="fw-bold text-danger me-1">{rating.toFixed(1)}</span>
                            <Rating readonly size={22} initialValue={rating.toFixed(1)} allowFraction className="mb-1" />
                            <span className="text-secondary ms-1">({reviewsNumber})</span>
                        </Card.Text>
                        <Card.Text className="h5">
                            ${price}
                            <LinkContainer to={`/product-details/${productId}`}>
                                <Button className="btn-warning ms-5 ">Check out</Button>
                            </LinkContainer>
                        </Card.Text>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};;