// external imports
import { Container, Row, Col, Button, Form, CloseButton, Table, Alert, Image } from 'react-bootstrap';
import { useState, useEffect, Fragment, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// internal imports
import MetaComponent from '../../../components/MetaComponent';
import { changeCategory, setValuesForAttrFromDBSelectForm, setAttributesTableWrapper } from './utils/utils';

const onHover = { cursor: 'pointer', position: 'absolute', left: '5px', top: '-10px', transform: 'scale(2.0)' };

export default function EditProductPageComponent(props) {
    const { categories, fetchProduct, updateProductApiRequest, reduxDispatch, saveAttributeToCategory, imageDeleteHandler, uploadImagesApiRequest, uploadImagesCloudinaryApiRequest } = props;

    const [validated, setValidated] = useState(false);
    const [product, setProduct] = useState({});
    const [updateProductResponseState, setUpdateProductResponseState] = useState({ message: '', error: '' });
    // * for select lists
    const [attributesFromDB, setAttributesFromDB] = useState([]);
    // * for the html table
    const [attributesTable, setAttributesTable] = useState([]);
    const [categoryChosen, setCategoryChosen] = useState('Choose category');
    const [newAttrKey, setNewAttrKey] = useState(false);
    const [newAttrValue, setNewAttrValue] = useState(false);
    const [imageRemoved, setImageRemoved] = useState(false);
    const [isUploading, setIsUploading] = useState('');
    const [imageUploaded, setImageUploaded] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const attrKey = useRef(null);
    const attrVal = useRef(null);
    const createdNewAttrKey = useRef(null);
    const createdNewAttrVal = useRef(null);

    useEffect(() => {
        fetchProduct(id)
            .then(result => {
                setProduct(result);
            })
            .catch(err => {
                setUpdateProductResponseState({ error: err.response.data.message ? err.response.data.message : err.response.data });
            });
    }, [fetchProduct, id, imageRemoved, imageUploaded]);

    useEffect(() => {
        let categoryOfEditedProduct = categories.find(item => item.name === product.category);

        if (categoryOfEditedProduct) {
            const mainCategoryOfEditedProduct = categoryOfEditedProduct.name.split('/')[0];

            const mainCategoryOfEditedProductAllData = categories.find(categoryOfEditedProduct => categoryOfEditedProduct.name === mainCategoryOfEditedProduct);

            if (mainCategoryOfEditedProductAllData && mainCategoryOfEditedProductAllData.attrs.length > 0) {
                setAttributesFromDB(mainCategoryOfEditedProductAllData.attrs);
            }
        }
        setCategoryChosen(product.category);
        setAttributesTable(product.attrs);
    }, [product, categories]);

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

        if (event.currentTarget.checkValidity() === true) {
            updateProductApiRequest(id, formInputs)
                .then(result => {
                    if (result.message === 'Product updated') {
                        navigate('/admin/products');
                    }
                }).catch((err) => {
                    setUpdateProductResponseState({ error: err.response.data.message ? err.response.data.message : err.response.data });
                });
        }
        setValidated(true);
    };

    const attributeValueSelected = (e) => {
        if (e.target.value !== 'Choose attribute value') {
            setAttributesTableWrapper(attrKey.current.value, e.target.value, setAttributesTable);
        }
    };

    const deleteAttribute = (key) => {
        setAttributesTable(table => table.filter(item => item.key !== key));
    };

    const checkKeyDown = (e) => {
        if (e.code === 'Enter') {
            e.preventDefault();
        }
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

    const removeImageHandler = (imagePath, id) => {
        imageDeleteHandler(imagePath, id)
            .then(result => {
                setImageRemoved(!imageRemoved);
            });
    };

    const uploadImageHandeler = (images, id) => {
        if (process.env.NODE_ENV !== 'production') {
            uploadImagesApiRequest(images, id)
                .then(result => {
                    setIsUploading('File(s) uploaded');
                    setImageUploaded(!imageUploaded);
                })
                .catch(err => {
                    setIsUploading(err.response.data.message ? err.response.data.message : err.response.data);
                });
        } else {
            const data = uploadImagesCloudinaryApiRequest(images, id);
            if (!data.length && !data.size && !data.type) {
                setIsUploading('Uploading file(s) in progress...');
                setTimeout(() => {
                    setIsUploading('File(s) uploaded. Refresh to see the result.');
                }, 5000);
                setImageUploaded(!imageUploaded);
            } else {
                let showError = data.length + data.size + data.type;
                setIsUploading(showError);
            }
        };
    };

    return (
        <>
            <MetaComponent title={`A2Z - Update  ${product.name}`} />
            <Container>
                <Row className="mt-3 justify-content-md-center">
                    <Col md={6}>
                        <h3 className="text-center mb-4">Edit this product</h3>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e) => checkKeyDown(e)}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control name="name" required type="text" defaultValue={product.name} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control name="description" required as="textarea" rows={3} defaultValue={product.description} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCount">
                                <Form.Label>Count in stock</Form.Label>
                                <Form.Control name="count" required type="number" defaultValue={product.count} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control name="price" required type="text" defaultValue={product.price} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Select required name="category" aria-label="Default select example" onChange={(e) => changeCategory(e, categories, setAttributesFromDB, setCategoryChosen)}>
                                    <option value="Choose category">Choose category</option>
                                    {categories.map((category, idx) => {
                                        return product.category === category.name ? (
                                            <option selected key={idx} value={category.name}>{category.name}</option>
                                        ) : (
                                            <option key={idx} value={category.name}>{category.name}</option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>

                            {attributesFromDB.length > 0 && (
                                <Row className="mt-5">
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicAttributes">
                                            <Form.Label>Choose atrribute & set value</Form.Label>
                                            <Form.Select name="atrrKey" aria-label="Default select example" ref={attrKey} onChange={(e) => setValuesForAttrFromDBSelectForm(e, attrVal, attributesFromDB)}>
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
                                {attributesTable && attributesTable.length > 0 && (
                                    <Col>
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
                                    </Col>
                                )}
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                                        <Form.Label>Create new attribute</Form.Label>
                                        <Form.Control
                                            disabled={categoryChosen === 'Choose category'} placeholder="first choose or create category" ref={createdNewAttrKey} name="newAttrKey" type="text"
                                            onKeyUp={newAttrKeyHandler}
                                            required={newAttrValue}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicNewAttributeValue">
                                        <Form.Label>Attribute value</Form.Label>
                                        <Form.Control disabled={categoryChosen === 'Choose category'} placeholder="first choose or create category" ref={createdNewAttrVal} name="newAttrValue" type="text" onKeyUp={newAttrValueHandler} required={newAttrKey} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Alert show={newAttrKey && newAttrValue} variant="primary">
                                After typing attribute key & value press enter on one of the field
                            </Alert>
                            <Form.Group controlId="formFileMultiple" className="mb-3">
                                <Form.Label>Images</Form.Label>
                                <Row className="ps-1 pe-1 mb-2 mt-1">
                                    {product.images && product.images.map((image, idx) => (
                                        <Col key={idx} style={{ position: 'relative' }} xs={3} className="mb-2">
                                            <Image crossOrigin="anonymous" src={image.path ? image.path : null} fluid />
                                            <i style={onHover} onClick={() => removeImageHandler(image.path, id)} className="bi bi-x text-danger" />
                                        </Col>
                                    ))}
                                </Row>
                                <Form.Control type="file" multiple onChange={(e) => uploadImageHandeler(e.target.files, id)} />
                                <Form.Text className="text-muted">Image file(s) should be of JPEG/JPG/PNG type and maximum 1 MB in size.</Form.Text>
                            </Form.Group>

                            {isUploading && <Alert variant="info">{isUploading}</Alert>}

                            <Button className="mt-3 btn-warning" type="submit">Update</Button>

                            {updateProductResponseState.error && <Alert variant="danger" className="mt-2">{updateProductResponseState.error}</Alert>}
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};