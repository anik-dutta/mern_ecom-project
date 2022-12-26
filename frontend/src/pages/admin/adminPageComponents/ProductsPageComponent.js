// external imports
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

// internal imports
import MetaComponent from '../../../components/MetaComponent';
import AdminLinksComponent from '../../../components/adminComponents/AdminLinksComponent';
import { logout } from '../../../redux/actions/userActions';

export default function ProductsPageComponent(props) {
    const { fetchProducts, deleteProduct } = props;

    const [products, setProducts] = useState([]);
    const [productDeleted, setProductDeleted] = useState(false);

    const deleteHandler = async (productId, productName) => {
        if (window.confirm(`Are you sure that you want to delete "${productName}"?`)) {
            const data = await deleteProduct(productId);
            if (data.message === 'product removed') {
                setProductDeleted(!productDeleted);
            }
        }
    };

    const dispatch = useDispatch();

    useEffect(() => {
        const abctrl = new AbortController();
        fetchProducts(abctrl)
            .then(result => setProducts(result))
            .catch(err => {
                if (err.message !== 'canceled') {
                    dispatch(logout());
                }
            });
        return () => abctrl.abort();
    }, [productDeleted, dispatch, fetchProducts]);

    return (
        <>
            <MetaComponent title="A2Z - All Products" />
            <Container fluid className="mt-3">
                <Row className="m-3">
                    <Col md={2}>
                        <AdminLinksComponent />
                    </Col>
                    <Col md={10}>
                        <Row className="mb-2">
                            <Col md={5}>
                                <h3>Products</h3>
                            </Col>
                            <Col md={5}>
                                <h6 className="pt-3">Total Products: {products.length}</h6>
                            </Col>
                            <Col className="ps-5 pt-1 pe-0">
                                <LinkContainer to="/admin/create-new-product">
                                    <Button className="ms-4 btn-warning btn-sm">Add Product</Button>
                                </LinkContainer>
                            </Col>
                        </Row>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr className="text-center">
                                    <th>#</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Edit/Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(
                                    (item, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.price}</td>
                                            <td>{item.category}</td>
                                            <td className="text-center">
                                                <LinkContainer to={`/admin/edit-product/${item._id}`}>
                                                    <Button className="btn-sm">
                                                        <i className="bi bi-pencil-square" />
                                                    </Button>
                                                </LinkContainer>
                                                {" / "}
                                                <Button className="btn-sm  btn-danger" onClick={() => deleteHandler(item._id, item.name)}>
                                                    <i className="bi bi-trash" />
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};