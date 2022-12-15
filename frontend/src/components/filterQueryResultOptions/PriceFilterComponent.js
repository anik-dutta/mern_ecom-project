// external import
import { Form } from "react-bootstrap";

export default function PriceFilterComponent({ price, setPrice }) {
    return (
        <>
            <Form.Label>
                <span className="fw-bold mb-2">Price Range</span><br />
                <p className="mb-0">Within ${price}</p>
            </Form.Label>
            <Form.Range min={10} max={1000} step={10} onChange={e => setPrice(e.target.value)} />
        </>
    );
};