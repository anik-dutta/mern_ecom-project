// external import
import { Button } from 'react-bootstrap';

export default function RemoveFromCartComponent(props) {
    const { orderCreated, productID, quantity, price, removeFromCartHandler } = props;

    return (
        <Button variant="danger" disabled={orderCreated} onClick={removeFromCartHandler ? () => removeFromCartHandler(productID, quantity, price) : undefined}>
            <i className="bi bi-trash" />
        </Button>
    );
}