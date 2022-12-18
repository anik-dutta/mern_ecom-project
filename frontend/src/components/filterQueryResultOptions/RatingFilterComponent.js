// external imports
import { Rating } from 'react-simple-star-rating';
import { Form } from 'react-bootstrap';

export default function RatingFilterComponent(props) {
    const { setRatingFromFilter } = props;

    return (
        <>
            <span className="fw-bold">Rating</span>
            <Form>
                <div className="mt-2" style={{ cursor: 'pointer' }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        idx !== 0 && (
                            <Form.Check
                                key={idx} type='radio' name="rating" className="m-0"
                                label={<p className="fw-bold text-success"><Rating className="mb-2 mt-0 p-0" readonly size={20} allowFraction initialValue={5 - idx * 0.5} />{' '}{(5 - idx * 0.5).toFixed(1)} & up</p>}
                                onChange={e => setRatingFromFilter(items => { return [5 - idx * 0.5]; })}
                            />
                        )))}
                </div>
            </Form>
        </>
    );
}