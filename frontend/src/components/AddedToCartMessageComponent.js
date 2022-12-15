// external imports
import { Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
// import { Link } from 'react-router-dom';

export default function AddedToCartMessageComponent({ showCartMessage, setShowCartMessage }) {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    return (
        <Alert className="mt-3" show={showCartMessage} variant="success" onClose={() => setShowCartMessage(false)} dismissible>
            <Alert.Heading>Product was added to your cart</Alert.Heading>
            <p>
                <Button variant="info" onClick={goBack}>Go back</Button>{' '}
                <LinkContainer to="/cart">
                    <Button variant="warning">Go to Cart</Button>
                </LinkContainer>
            </p>
        </Alert>
    );
};