// external import
import { Form } from 'react-bootstrap';

export default function PriceFilterComponent(props) {
    const { price, setPrice } = props;

    return (
        <>
            <span className="fw-bold">Price Range</span><br />
            <Form.Label>
                <p className="mt-2">Within <span className="fw-bold text-success">${price}</span></p>
            </Form.Label>
            <Form.Range min={10} max={1000} step={10} onChange={e => setPrice(e.target.value)} />
        </>
    );
};