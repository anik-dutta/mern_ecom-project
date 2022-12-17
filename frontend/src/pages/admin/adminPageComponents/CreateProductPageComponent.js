// external imports
import { useState, Fragment, useRef } from 'react';
import { Container, Row, Col, Button, Form, CloseButton, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// internal imports
import MetaComponent from '../../../components/MetaComponent';
import { changeCategory, setValuesForAttrFromDBSelectForm, setAttributesTableWrapper } from './utils/utils';

export default function CreateProductPageComponent(props) {
    const { createProductApiRequest, uploadImagesApiRequest, uploadImagesCloudinaryApiRequest, categories, reduxDispatch, newCategory, deleteCategory, saveAttributeToCategory, checkImage } = props;

    const [validated, setValidated] = useState(false);
    // * for select lists
    const [attributesFromDB, setAttributesFromDB] = useState([]);
    // * for the html table
    const [attributesTable, setAttributesTable] = useState([]);
    const [newAttrKey, setNewAttrKey] = useState(false);
    const [newAttrValue, setNewAttrValue] = useState(false);
    const [images, setImages] = useState(false);
    const [isCreating, setIsCreating] = useState('');
    const [createProductResponseState, setCreateProductResponseState] = useState({ message: '', error: '' });
    const [categoryChosen, setCategoryChosen] = useState('Choose category');

    const navigate = useNavigate();

    const attrKey = useRef(null);
    const attrVal = useRef(null);
    const createdNewAttrKey = useRef(null);
    const createdNewAttrVal = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget.elements;
        const formInputs = {
            name: form.name.value.trim(),
            description: form.description.value.trim(),
            price: form.price.value,
            count: form.count.value,
            category: form.category.value,
            attributesTable: attributesTable
        };

        if (event.currentTarget.checkValidity() === true && !isCreating) {
            createProductApiRequest(formInputs)
                .then(result => {
                    if (images) {
                        if (process.env.NODE_ENV !== 'production') {
                            uploadImagesApiRequest(images, result.productId)
                                .then(res => { })
                                .catch((err) => setIsCreating(err.response.data.message ? err.response.data.message : err.response.data));
                        } else {
                            uploadImagesCloudinaryApiRequest(images, result.productId, 'create');
                        }
                    }
                    if (result.message === 'product created') {
                        navigate('/admin/products');
                    }
                })

                .catch((err) => {
                    setCreateProductResponseState(err.response.data.message ? err.response.data.message : err.response.data);
                });
        }
        setValidated(true);
    };

    const imageUploadHandler = (images) => {
        if (images) {
            const data = checkImage(images, 'select');

            if (data.error.length || data.error.size || data.error.type) {
                let showError = data.error.length + data.error.size + data.error.type;
                setIsCreating(showError);
            } else {
                setIsCreating('');
            }
            setImages(images);
        }
    };

    const newCategoryHandler = (e) => {
        if (e.keyCode && e.keyCode === 13 && e.target.value) {
            reduxDispatch(newCategory(e.target.value));
            setTimeout(() => {
                let element = document.getElementById('cats');
                setCategoryChosen(e.target.value);
                element.value = e.target.value;
                e.target.value = '';
            }, 1000);
        }
    };

    const deleteCategoryHandler = () => {
        let element = document.getElementById('cats');
        reduxDispatch(deleteCategory(element.value));
        setCategoryChosen('Choose category');
    };

    const attributeValueSelected = (e) => {
        if (e.target.value !== 'Choose attribute value') {
            setAttributesTableWrapper(attrKey.current.value, e.target.value, setAttributesTable);
        }
    };

    const deleteAttribute = (key) => {
        setAttributesTable((table) => {
            table.filter((item) => item.key !== key);
        });
    };

    const newAttrKeyHandler = (e) => {
        e.preventDefault();
        setNewAttrKey(e.target.value);
        addNewAttributeManually(e);
    };

    const newAttrValueHandler = (e) => {
        e.preventDefault();
        setNewAttrValue(e.target.value);
        addNewAttributeManually(e);
    };

    const addNewAttributeManually = (e) => {
        if (e.keyCode && e.keyCode === 13) {
            if (newAttrKey && newAttrValue) {
                reduxDispatch(saveAttributeToCategory(newAttrKey, newAttrValue, categoryChosen));
                setAttributesTableWrapper(newAttrKey, newAttrValue, setAttributesTable);
                e.target.value = '';
                createdNewAttrKey.current.value = '';
                createdNewAttrVal.current.value = '';
                setNewAttrKey(false);
                setNewAttrValue(false);
            }
        }
    };

    const checkKeyDown = (e) => {
        if (e.code === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <>
            <MetaComponent title="A2Z - Add Product" />
            <Container>
                <Row className="mt-3 justify-content-md-center">
                    <Col md={6}>
                        <h3 className="text-center mb-4">Add a new product</h3>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e) => checkKeyDown(e)}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control name="name" required type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control name="description" required as="textarea" rows={3} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCount">
                                <Form.Label>Count in stock</Form.Label>
                                <Form.Control name="count" required type="number" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control name="price" required type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCategory">
                                <Form.Label>
                                    Category{' '}
                                    <CloseButton onClick={deleteCategoryHandler} style={{ fontSize: '10px', padding: '2px' }} />(<small>remove selected category</small>)
                                </Form.Label>
                                <Form.Select
                                    id="cats"
                                    required
                                    name="category"
                                    aria-label="Default select example" onChange={(e) => changeCategory(e, categories, setAttributesFromDB, setCategoryChosen)}
                                >
                                    <option value="">Choose category</option>
                                    {categories.map((category, idx) => (
                                        <option key={idx} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicNewCategory">
                                <Form.Label>
                                    Or create a new category (e.g. Computers/Laptops/Books){' '}
                                </Form.Label>
                                <Form.Control onKeyUp={newCategoryHandler} name="newCategory" type="text" />
                            </Form.Group>

                            {attributesFromDB.length > 0 && (
                                <Row className="mt-5">
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicAttributes">
                                            <Form.Label>Choose atrribute & set value</Form.Label>
                                            <Form.Select
                                                name="atrrKey"
                                                aria-label="Default select example"
                                                ref={attrKey}
                                                onChange={(e) => setValuesForAttrFromDBSelectForm(e, attrVal, attributesFromDB)}
                                            >
                                                <option>Choose attribute</option>
                                                {attributesFromDB.map((item, idx) => (
                                                    <Fragment key={idx}>
                                                        <option value={item.key}>{item.key}</option>
                                                    </Fragment>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicAttributeValue">
                                            <Form.Label>Attribute value</Form.Label>
                                            <Form.Select
                                                onChange={attributeValueSelected}
                                                name="atrrVal"
                                                aria-label="Default select example"
                                                ref={attrVal}
                                            >
                                                <option>Choose attribute value</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            <Row>
                                <Col>
                                    {attributesTable.length > 0 && (
                                        <Table hover>
                                            <thead>
                                                <tr>
                                                    <th>Attribute</th>
                                                    <th>Value</th>
                                                    <th>Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attributesTable.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.key}</td>
                                                        <td>{item.value}</td>
                                                        <td>
                                                            <CloseButton onClick={() => deleteAttribute(item.key)} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                                        <Form.Label>Create new attribute</Form.Label>
                                        <Form.Control ref={createdNewAttrKey}
                                            disabled={["", "Choose category"].includes(categoryChosen)}
                                            placeholder="first choose or create category"
                                            name="newAttrValue"
                                            type="text"
                                            onKeyUp={newAttrKeyHandler}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicNewAttributeValue">
                                        <Form.Label>Attribute value</Form.Label>
                                        <Form.Control ref={createdNewAttrVal}
                                            disabled={['', 'Choose category'].includes(categoryChosen)}
                                            placeholder="first choose or create category"
                                            required={newAttrKey}
                                            name="newAttrValue"
                                            type="text"
                                            onKeyUp={newAttrValueHandler}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Alert show={newAttrKey && newAttrValue} variant="primary">
                                After typing attribute key & value press enter on one of the field
                            </Alert>

                            <Form.Group controlId="formFileMultiple" className="mb-3 mt-3">
                                <Form.Label>Images</Form.Label>
                                <Form.Control type="file" multiple onChange={(e) => imageUploadHandler(e.target.files)} />
                                <Form.Text className="text-muted">Image file(s) should be of JPEG/JPG/PNG type and maximum 1 MB in size.</Form.Text>
                            </Form.Group>

                            {isCreating && <Alert>{isCreating}</Alert>}
                            <Button className="btn-warning mt-3" type="submit" disabled={isCreating}><i className="bi bi-plus-circle-fill me-1" />Product</Button>

                            {createProductResponseState.error && <Alert variant="danger">{createProductResponseState.error}</Alert>}
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};