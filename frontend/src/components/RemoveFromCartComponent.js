// external imports
import { Button } from 'react-bootstrap';

export default function RemoveFromCartComponent({ orderCreated, productID, quantity, price, removeFromCartHandler }) {
    return (
        <Button variant="danger" disabled={orderCreated} onClick={removeFromCartHandler ? () => removeFromCartHandler(productID, quantity, price) : undefined}>
            <i className="bi bi-trash" />
        </Button>
    );
}