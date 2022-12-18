// external imports
import { Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function CategoryCardComponent(props) {
    const { category } = props;

    return (
        <Card>
            <Card.Img crossOrigin="anonymous" variant="top" src={category.image ?? null} />
            <Card.Body>
                <Card.Title>{category.name}</Card.Title>
                <Card.Text>{category.description}</Card.Text>
                <LinkContainer to={`/product-list/category/${category.name}`}>
                    <Button variant="primary">Check out</Button>
                </LinkContainer>
            </Card.Body>
        </Card>
    );
}