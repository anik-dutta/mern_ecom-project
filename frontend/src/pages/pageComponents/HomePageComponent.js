// external imports
import { Alert, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';

// internal imports
import ProductCarouselComponent from '../../components/ProductCarouselComponent';
import CategoryCardComponent from '../../components/CategoryCardComponent';
import MetaComponent from '../../components/MetaComponent';

export default function HomePageComponent(props) {
    const { categories, getBestsellers } = props;

    const [mainCategories, setMainCategories] = useState([]);
    const [bestSellers, setBestsellers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getBestsellers()
            .then(result => {
                setBestsellers(result);
            })
            .catch(err => {
                setError(err.response.data.message ? err.response.data.message : err.response.data);
                console.log(err.response.data.message ? err.response.data.message : err.response.data);
            });
        setMainCategories((cat) => categories.filter((item) => !item.name.includes('/')));
    }, [categories, getBestsellers]);

    return (
        <>
            <MetaComponent />
            {error && <Alert variant="danger" className="mt-2">Something went wrong! Try again later</Alert>}
            <ProductCarouselComponent bestSellers={bestSellers} />
            <Container>
                <Row xs={1} md={2} className="g-4 mt-5">
                    {mainCategories.map((category, idx) => (
                        <CategoryCardComponent key={idx} category={category} />
                    ))}
                </Row>
            </Container>
        </>
    );
}