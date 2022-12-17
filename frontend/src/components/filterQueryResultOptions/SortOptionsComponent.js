// external import
import { Form } from 'react-bootstrap';

export default function SortOptionsComponent(props) {
    const { setSortOption } = props;
    return (
        <Form.Select aria-label="Default select example" onChange={e => setSortOption(e.target.value)}>
            <option>Sort By</option>
            <option value="price_1">Price: Low To High</option>
            <option value="price_-1">Price: High To Low</option>
            <option value="rating_-1">Customer Rating</option>
            <option value="name_1">Name A-Z</option>
            <option value="name_-1">Name Z-A</option>
        </Form.Select>
    );
};