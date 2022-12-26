// external imports
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';

// internal import
import MetaComponent from '../../../components/MetaComponent';

export default function UserProfilePageComponent(props) {
    const { updateUserApiRequest, fetchUser, userInfoFromRedux, setReduxUserState, reduxDispatch, localStorage, sessionStorage } = props;

    const [validated, setValidated] = useState(false);
    const [updateUserResponseState, setUpdateUserResponseState] = useState({ success: '', error: '' });
    const [user, setUser] = useState({});
    const [passwordMatchState, setPasswordMatchState] = useState(true);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const userInfo = userInfoFromRedux;

    useEffect(() => {
        fetchUser(userInfo._id)
            .then(result => setUser(result))
            .catch(err => console.log(err));
    }, [userInfo._id, fetchUser]);

    const handleOnChange = () => {
        console.log(password);
        const passwordField = document.querySelector('input[name=password]');
        const confirmPasswordField = document.querySelector('input[name=confirmPassword]');
        setPassword(passwordField.value.replace(/\s/g, ''));
        setConfirmPassword(confirmPasswordField.value.replace(/\s/g, ''));

        if (password === confirmPassword) {
            setPasswordMatchState(true);
        } else {
            setPasswordMatchState(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;

        const name = form.name.value.trim();
        const lastName = form.lastName.value.trim();
        const phoneNumber = form.phoneNumber.value;
        const address = form.address.value.trim();
        const country = form.country.value.trim();
        const zipCode = form.zipCode.value.trim();
        const city = form.city.value.trim();
        const state = form.state.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (event.currentTarget.checkValidity() === true && password && confirmPassword) {
            updateUserApiRequest(name, lastName, address, phoneNumber, country, city, state, zipCode, password)
                .then(result => {
                    setUpdateUserResponseState({ success: result.success, error: '' });
                    reduxDispatch(setReduxUserState({ doNotLogout: userInfo.doNotLogout, ...result.userUpdated }));

                    if (userInfo.doNotLogout) {
                        localStorage.setItem('userInfo', JSON.stringify({ doNotLogout: true, ...result.userUpdated }));
                    } else {
                        sessionStorage.setItem('userInfo', JSON.stringify({ doNotLogout: false, ...result.userUpdated }));
                    }
                })
                .catch(err => {
                    setUpdateUserResponseState({ error: err.response.data.message ? err.response.data.message : err.response.data });
                });
        }
        setValidated(true);
    };

    return (
        <>
            <MetaComponent title="A2Z - My Profile" />
            <Container>
                <Row className="mt-3 justify-content-md-center">
                    <Col md={6}>
                        <h3 className="text-center mb-2">Profile</h3>
                        <h6 className="text-center mb-1">Complete all the fields to place an order</h6>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control required type="text" defaultValue={user.name} name="name" />
                                <Form.Control.Feedback type="invalid">Please provide your first name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="formBasicLastName">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control required type="text" defaultValue={user.lastName} name="lastName" />
                                <Form.Control.Feedback type="invalid">Please provide your last name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control disabled defaultValue={user.email} />
                                <Form.Text className="text-muted">Can not change the email address once an account has been created</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicCountry">
                                <Form.Label>Country</Form.Label>
                                <Form.Control required type="text" placeholder="Enter the name of your country" defaultValue={user.country} name="country" />
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicState">
                                <Form.Label>State/Province</Form.Label>
                                <Form.Control required type="text" placeholder="Enter the name of your state or province" defaultValue={user.state} name="state" />
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control required type="text" placeholder="Enter the name of your city" defaultValue={user.city} name="city" />
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control required type="text" placeholder="Enter your address" defaultValue={user.address} name="address" />
                                <Form.Control.Feedback type="invalid">Please provide an address</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicZip">
                                <Form.Label>Zip Code</Form.Label>
                                <Form.Control required type="text" placeholder="Enter the Zip Code of your address" defaultValue={user.zipCode} name="zipCode" />
                                <Form.Control.Feedback type="invalid">Please provide the zip code</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicPhone">
                                <Form.Label>Phone number</Form.Label>
                                <Form.Control required type="text" placeholder="Enter your phone number" defaultValue={user.phoneNumber} name="phoneNumber" />
                                <Form.Control.Feedback type="invalid">Please provide a valid phone number</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter a password" name="password" minLength={8} maxLength={20} onChange={handleOnChange} value={password} />
                                <Form.Text className="text-muted">Password should contain at least 8 characters.</Form.Text>
                                <Form.Control.Feedback type="invalid">Please enter a password</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2 mt-3" controlId="formBasicPasswordRepeat">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Re-enter the password" name="confirmPassword" minLength={8} maxLength={20} onChange={handleOnChange} isInvalid={!passwordMatchState} value={confirmPassword} />
                                <Form.Control.Feedback type="invalid">
                                    {!passwordMatchState === true ? <>Both passwords have to match</> : <>Enter the password again</>}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button type="submit" className="mb-3 mt-2 btn-warning">Update</Button>

                            <Alert variant="warning" show={updateUserResponseState && updateUserResponseState.success === 'User updated'}>
                                Profile updated!
                            </Alert>
                            <Alert variant="danger" show={updateUserResponseState && updateUserResponseState.error !== ''}>
                                Something went wrong!
                            </Alert>
                        </Form>
                    </Col>
                </Row>
            </Container >
        </>
    );
}