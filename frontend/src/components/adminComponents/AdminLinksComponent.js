// external imports
import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch } from 'react-redux';

// internal imports
import { logout } from '../../redux/actions/userActions';

export default function AdminLinksComponent() {
    const dispatch = useDispatch();
    return (
        <Navbar className="admin-navbar" variant="dark">
            <Nav className="flex-column" >
                <LinkContainer to="/admin/orders" >
                    <Nav.Link className="admin-links">Orders</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/products" >
                    <Nav.Link className="admin-links">Products</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/users" >
                    <Nav.Link className="admin-links">Users</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/chats" >
                    <Nav.Link className="admin-links">Chats</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/analytics" >
                    <Nav.Link className="admin-links">Analytics</Nav.Link>
                </LinkContainer>
                <Nav.Link className="admin-links logout" onClick={() => dispatch(logout())}>Log Out</Nav.Link>
            </Nav >
        </Navbar>
    );
};