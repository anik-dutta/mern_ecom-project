// external imports
import { Row, Col, Table, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

// internal imports
import MetaComponent from '../../../components/MetaComponent';
import AdminLinksComponent from '../../../components/adminComponents/AdminLinksComponent';
import { logout } from '../../../redux/actions/userActions';

export default function UsersPageComponent({ fetchUsers, deleteUser }) {
    const [users, setUsers] = useState([]);
    const [userDeleted, setuserDeleted] = useState(false);

    const deleteHandler = async (userId) => {
        if (window.confirm('Are you sure that you want to remove this user?')) {
            const data = await deleteUser(userId);
            if (data === 'User deleted') {
                setuserDeleted(!userDeleted);
            }
        }
    };

    const dispatch = useDispatch();

    useEffect(() => {
        const abctrl = new AbortController();
        fetchUsers(abctrl)
            .then(result => setUsers(result))
            .catch(err => {
                // dispatch(logout());

                if (err.message !== 'canceled') {
                    dispatch(logout());
                }

                // TODO: below was used in project. will fix it later. All pageComponents have the same issue
                // console.log(
                //     err.response.data.message ? err.response.data.message : err.response.data
                // );

                // console.log(
                //     err.response.data.message ? err.response.data.message : err.message
                // );
                // console.log(
                //     err.response && err.message ? err.response.data.message : err.message + ' ' + err.code
                // );
            }
            );
        return () => abctrl.abort();
    }, [userDeleted, fetchUsers, dispatch]);

    return (
        <>
            <MetaComponent title="A2Z - All Users" />
            <Container fluid className="mt-3">
                <Row className="m-3">
                    <Col md={2}>
                        <AdminLinksComponent />
                    </Col>
                    <Col md={10}>
                        <Row className="mb-2">
                            <Col md={5}>
                                <h3>Users</h3>
                            </Col>
                            <Col md={5} className="pt-3">
                                <h6 >Total users: {users.length}</h6>
                            </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr className="text-center">
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Is Admin</th>
                                    <th>Edit/Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(
                                    (user, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td className="text-center">{user.isAdmin ? <i className='bi bi-check-lg text-success' /> : <i className='bi bi-x-lg text-danger' />}</td>
                                            <td className="text-center">
                                                <LinkContainer to={`/admin/edit-user/${user._id}`}>
                                                    <Button className="btn-sm">
                                                        <i className="bi bi-pencil-square" />
                                                    </Button>
                                                </LinkContainer>
                                                {" / "}
                                                <Button className="btn-sm btn-danger" onClick={() => deleteHandler(user._id)}>
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