// external imports
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Container, Form, Button, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function EditUsersPageComponent({ fetchUser, updateUserApiRequest }) {
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState([]);
    const [isAdminState, setIsAdminState] = useState(false);
    const [updateUserResponseState, setUpdateUserResponseState] = useState({ message: "", error: "" });

    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        const name = form.name.value;
        const lastName = form.lastName.value;
        const email = form.email.value;
        const isAdmin = form.isAdmin.checked;

        if (event.currentTarget.checkValidity() === true) {
            updateUserApiRequest(id, name, lastName, email, isAdmin)
                .then(result => {
                    if (result === 'User updated') {
                        navigate('/admin/users');
                    }
                })
                .catch(err => {
                    setUpdateUserResponseState({
                        error: err.response.data.message ? err.response.data.message : err.response.data
                    });
                });
        }
        setValidated(true);
    };

    useEffect(() => {
        fetchUser(id)
            .then(result => {
                setUser(result);
                setIsAdminState(result.isAdmin);
            })
            .catch((err) => console.log(err.response.data.message ? err.response.data.message : err.response.data));
    }, [id, fetchUser]);

    return (
        <Container className="mt-3">
            <Row className="m-3 justify-content-md-center">
                <Col md={3}>
                    <LinkContainer to="/admin/products">
                        <Button className="btn-secondary btn-sm">Go Back</Button>
                    </LinkContainer>
                </Col>
                <Col md={6}>
                    <h3>Edit user</h3>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control name="name" required type="text" defaultValue={user.name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control name="lastName" required type="text" defaultValue={user.lastName} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" required type="email" defaultValue={user.email} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check name="isAdmin" type="checkbox" label="Is admin" checked={isAdminState} onChange={(e) => setIsAdminState(e.target.checked)}
                            />
                        </Form.Group>
                        <Button className="btn-sm mt-2" type="submit" >Update</Button>
                        {updateUserResponseState.error && (
                            <Alert variant="danger">{updateUserResponseState.error}</Alert>
                        )}
                    </Form>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
};