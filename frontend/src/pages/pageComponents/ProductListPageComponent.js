// external imports
import { Row, Col, Container, ListGroup, Button } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// internal imports
import PaginationComponent from '../../components/PaginationComponent';
import ProductForListComponent from '../../components/ProductForListComponent';
import SortOptionsComponent from '../../components/filterQueryResultOptions/SortOptionsComponent';
import PriceFilterComponent from '../../components/filterQueryResultOptions/PriceFilterComponent';
import RatingFilterComponent from '../../components/filterQueryResultOptions/RatingFilterComponent';
import CategoryFilterComponent from '../../components/filterQueryResultOptions/CategoryFilterComponent';
import AttributesFilterComponent from '../../components/filterQueryResultOptions/AttributesFilterComponent';

export default function ProductListPageComponent(props) {
    const { getProducts, categories } = props;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // to collect category attributes from db and show them
    const [attrsFilter, setAttrsFilter] = useState([]);
    // to collect user filters for catefory attributes
    const [attrsFromFilter, setAttrsFromFilter] = useState([]);
    const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);
    const [filters, setFilters] = useState();
    const [price, setPrice] = useState(500);
    const [ratingFromFilter, setRatingFromFilter] = useState([]);
    const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
    const [sortOption, setSortOption] = useState('');
    const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
    const [pageNum, setPageNum] = useState(null);

    const { categoryName } = useParams() || '';
    const { pageNumParam } = useParams() || 1;
    const { searchQuery } = useParams() || '';

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (categoryName) {
            let categoryAllData = categories.find(item => item.name === categoryName.replace(/,/g, '/'));

            if (categoryAllData) {
                let mainCategory = categoryAllData.name.split('/')[0];
                let index = categories.findIndex(item => item.name === mainCategory);
                setAttrsFilter(categories[index].attrs);
            } else {
                setAttrsFilter([]);
            }
        }
    }, [categoryName, categories]);

    useEffect(() => {
        if (Object.entries(categoriesFromFilter).length > 0) {
            setAttrsFilter([]);
            let cat = [];
            let count;
            Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
                if (checked) {
                    let name = category.split('/')[0];
                    cat.push(name);
                    count = cat.filter((x) => x === name).length;
                    if (count === 1) {
                        let index = categories.findIndex((item) => item.name === name);
                        setAttrsFilter((attrs) => [...attrs, ...categories[index].attrs]);
                    }
                }
            });
        }
    }, [categoriesFromFilter, categories]);

    useEffect(() => {
        getProducts(categoryName, pageNumParam, searchQuery, filters, sortOption)
            .then(result => {
                setProducts(result.products);
                setPaginationLinksNumber(result.paginationLinksNumber);
                setPageNum(result.pageNum);
                setLoading(false);
            })
            .catch(err => {
                setError(true);
            });
    }, [getProducts, filters, sortOption, categoryName, pageNumParam, searchQuery]);

    const handleFilters = () => {
        navigate(location.pathname.replace(/\/[0-9]+$/, ''));
        setShowResetFiltersButton(true);
        setFilters({
            price, rating: ratingFromFilter,
            category: categoriesFromFilter,
            attrs: attrsFromFilter
        });
    };

    const resetFilters = () => {
        setShowResetFiltersButton(false);
        setFilters({});
        window.location.href = '/product-list';
    };

    return (
        <>
            <Container fluid>
                <Row>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="mt-3 mb-3">
                                <SortOptionsComponent setSortOption={setSortOption} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <PriceFilterComponent price={price} setPrice={setPrice} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <RatingFilterComponent setRatingFromFilter={setRatingFromFilter} />
                            </ListGroup.Item>
                            {!location.pathname.match(/\/category/) && (
                                <ListGroup.Item>
                                    <CategoryFilterComponent setCategoriesFromFilter={setCategoriesFromFilter} />
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <AttributesFilterComponent attrsFilter={attrsFilter} setAttrsFromFilter={setAttrsFromFilter} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button className="btn-warning me-3" onClick={handleFilters}>Filter</Button>

                                {showResetFiltersButton && <Button variant="primary" onClick={resetFilters}>Reset Filters</Button>}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={9} className="mt-4">
                        {loading ? (
                            <h3 className="text-info"><Spinner as="span" variant="info" animation="border" size="md" role="status" aria-hidden="true" />{' '}Loading products</h3>
                        ) : error ? (
                            <h3>Error while loading products. Try again later.</h3>
                        ) : (
                            products.map(product => {
                                return <ProductForListComponent key={product._id} productId={product._id} images={product.images} name={product.name} description={product.description} price={product.price} rating={product.rating} reviewsNumber={product.reviews.length} />;
                            })
                        )}

                        {paginationLinksNumber > 1 &&
                            < PaginationComponent categoryName={categoryName} searchQuery={searchQuery} paginationLinksNumber={paginationLinksNumber} pageNum={pageNum} />
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
}