// external imports
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// internal import
import MetaComponent from '../../components/MetaComponent';

export default function LoginPageComponent(props) {
    const { loginUserApiRequest, reduxDispatch, setReduxUserState } = props;

    const [validated, setValidated] = useState(false);
    const [loginUserResponseSate, setLoginUserResponseSate] = useState({
        success: '', error: '', loading: false
    });

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        const email = form.email.value;
        const password = form.password.value;
        const doNotLogout = form.doNotLogout.checked;

        if (event.currentTarget.checkValidity() === true && email && password) {
            setLoginUserResponseSate({ loading: true });
            loginUserApiRequest(email, password, doNotLogout)
                .then(result => {
                    setLoginUserResponseSate({ success: result.success, loading: false, error: '' });

                    if (result.userLoggedIn) {
                        reduxDispatch(setReduxUserState(result.userLoggedIn));
                    }

                    if (result.success === 'User logged in' && !result.userLoggedIn.isAdmin) {
                        navigate('/', { replace: true });
                    } else {
                        navigate('/admin/orders', { replace: true });
                    }
                })
                .catch(err => {
                    setLoginUserResponseSate({ error: err.response.data.message ? err.response.data.message : err.response.data });
                });
        }
        setValidated(true);
    };

    return (
        <>
            <MetaComponent title="A2Z - Log In" />
            <Container>
                <Row className="mt-3 justify-content-md-center">
                    <Col md={5}>
                        <h3 className="mb-4">Log in to your Account</h3>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-2" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control required type="email" placeholder="Enter email address" name="email" />
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control required type="password" placeholder="Enter password" name="password" />
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Keep me logged in" name="doNotLogout" />
                            </Form.Group>
                            <Row className="pb-2">
                                <Col>
                                    Don't have an account? <Link to="/signup" style={{ textDecoration: 'none', fontWeight: 'bold' }}> Create Account</Link>
                                </Col>
                            </Row>
                            <Button type="submit" className="mt-2">
                                {loginUserResponseSate && loginUserResponseSate.loading === true ? (<>
                                    <Spinner as="span" variant="info" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                                </>) : ''}Log In
                            </Button>
                            <Alert variant="danger" className="mt-2" show={loginUserResponseSate && loginUserResponseSate.error === 'Wrong credentials!'}>
                                {loginUserResponseSate.error}
                            </Alert>
                        </Form>
                    </Col>
                </Row>
            </Container >
        </>
    );
}