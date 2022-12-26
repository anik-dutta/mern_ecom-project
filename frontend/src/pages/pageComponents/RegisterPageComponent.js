// external imports
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// internal import
import MetaComponent from '../../components/MetaComponent';

export default function RegisterPageComponent(props) {
    const { registerUserApiRequest, reduxDispatch, setReduxUserState } = props;

    const [validated, setValidated] = useState(false);
    const [registerUserResponseState, setRegisterUserResponseState] = useState({
        success: '', error: '', loading: false
    });
    const [passwordMatchState, setPasswordMatchState] = useState(true);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        const email = form.email.value.trim();
        const name = form.name.value.trim();
        const lastName = form.lastName.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (event.currentTarget.checkValidity() === true && email && name && lastName && password && password === confirmPassword) {
            setRegisterUserResponseState({ loading: true });
            registerUserApiRequest(name, lastName, email, password)
                .then(result => {
                    if (result.success === 'User created successfully!') {
                        setRegisterUserResponseState({
                            success: result.success, loading: false, error: ''
                        });
                        reduxDispatch(setReduxUserState(result.userCreated));
                        navigate('/user', { replace: true });
                    }
                })
                .catch(err => {
                    setRegisterUserResponseState({ error: err.response.data.message ? err.response.data.message : err.response.data });
                });
        }
        setValidated(true);
    };

    const handleOnChange = () => {
        const passwordField = document.querySelector('input[name=password]');
        const confirmPasswordField = document.querySelector('input[name=confirmPassword]');
        let passwordWithoutSpaces = passwordField.value.replace(/\s/g, '');
        setPassword(passwordWithoutSpaces);
        let confirmPasswordWithoutSpaces = confirmPasswordField.value.replace(/\s/g, '');
        setConfirmPassword();

        if (passwordWithoutSpaces === confirmPasswordWithoutSpaces) {
            setPasswordMatchState(true);
        } else {
            setPasswordMatchState(false);
        }
    };

    return (
        <>
            <MetaComponent title="A2Z - Create Account" />
            <Container>
                <Row className="mt-3 justify-content-md-center">
                    <Col md={6}>
                        <h3>Create Account</h3>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control required type="text" placeholder="Enter your first name" name="name" />
                                <Form.Control.Feedback type="invalid">Please provide your first name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="formBasicLastName">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control required type="text" placeholder="Enter your last name" name="lastName" />
                                <Form.Control.Feedback type="invalid">Please provide your last name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control required type="email" placeholder="Enter email address" name="email" />
                                <Form.Control.Feedback type="invalid">Please enter a valid email address</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control required type="password" placeholder="Enter a password" name="password" minLength={8} maxLength={20} onChange={handleOnChange} value={password} />
                                <Form.Text className="text-muted">Password should contain at least 8 characters.</Form.Text>
                                <Form.Control.Feedback type="invalid">Please enter a password</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicPasswordRepeat">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control required type="password" placeholder="Re-enter the password" name="confirmPassword" minLength={8} maxLength={20} onChange={handleOnChange} isInvalid={!passwordMatchState} value={confirmPassword} />
                                <Form.Control.Feedback type="invalid">Both passwords should match
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Row className="pb-2">
                                <Col>
                                    Already have an account? <Link to="/login" style={{ textDecoration: 'none', fontWeight: 'bold' }}> Log in </Link>
                                </Col>
                            </Row>
                            <Button type="submit" className="mt-2">
                                {registerUserResponseState && registerUserResponseState.loading === true ? (<>
                                    <Spinner as="span" variant="info" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                                </>) : ''}Sign Up
                            </Button>
                            <Alert className="mt-3" variant="danger" show={registerUserResponseState && registerUserResponseState.error === 'User already exists!'}>
                                {registerUserResponseState.error}
                            </Alert>
                            <Alert className="mt-3" variant="warning" show={registerUserResponseState && registerUserResponseState.success === 'User created successfully!'}>
                                {registerUserResponseState.success}
                            </Alert>
                        </Form>
                    </Col>
                </Row>
            </Container >
        </>
    );
}