// external imports
import { InputGroup, Container, Nav, Navbar, NavDropdown, Dropdown, DropdownButton, Form, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

// internal imports
import { logout } from '../redux/actions/userActions';
import { getCategories } from '../redux/actions/categoryActions';
import { setChatRooms, setSocket, setMessageReceived, removeChatRoom } from '../redux/actions/chatActions';

export default function HeaderComponent() {
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.userRegisterLogin);
    const itemsCount = useSelector((state) => state.cart.itemsCount);
    const { categories } = useSelector((state) => state.getCategories);
    const { messageReceived } = useSelector((state) => state.adminChat);

    const [searchCategoryToggle, setSearchCategoryToggle] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        if (userInfo?.isAdmin) {
            let audio = new Audio('/audio/chat-msg.mp3');
            const socket = socketIOClient();
            socket.emit('admin connected with server', 'Admin' + Math.floor(Math.random() * 1000000000000));
            socket.on('server sends message from client to admin', ({ user, message }) => {
                dispatch(setSocket(socket));
                dispatch(setChatRooms(user, message));
                dispatch(setMessageReceived(true));
                audio.play();
            });
            socket.on('disconnected', ({ reason, socketId }) => {
                dispatch(removeChatRoom(socketId));

            });
            return () => socket.disconnect();
        }
    }, [dispatch, userInfo.isAdmin]);

    const submitHandler = (e) => {
        if (e.keyCode && e.keyCode !== 13) return;
        e.preventDefault();
        if (searchQuery.trim()) {
            if (searchCategoryToggle === 'All') {
                navigate(`/product-list/search/${searchQuery}`);
            } else {
                navigate(`/product-list/category/${searchCategoryToggle.replace(/\//g, ',')}/search/${searchQuery}`);
            }
        } else if (searchCategoryToggle !== 'All') {
            navigate(`/product-list/category/${searchCategoryToggle.replace(/\//g, ',')}`);
        } else {
            navigate('/product-list');
        }
    };

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>A2Z</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <InputGroup className="mb-1">
                            <DropdownButton id="dropdown-basic-button" title={searchCategoryToggle} >
                                <Dropdown.Item onClick={() => setSearchCategoryToggle("All")}>All</Dropdown.Item>
                                {categories?.map((category, id) => (
                                    <Dropdown.Item key={id} onClick={() => setSearchCategoryToggle(category.name)}>{category.name}</Dropdown.Item>
                                ))}
                            </DropdownButton>

                            <Form.Control onKeyUp={submitHandler} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search in A2Z" />
                            <br />
                            <Button variant="warning" onClick={submitHandler}><i className="bi bi-search" /></Button>
                        </InputGroup>
                    </Nav>
                    <Nav>
                        {userInfo?.isAdmin ? (
                            <LinkContainer to="/admin/orders">
                                <Nav.Link>
                                    Admin
                                    {messageReceived && <span className="position-absolute top-1 start-10 translate-middle p-1 bg-warning border border-secondary rounded-circle"></span>}
                                </Nav.Link>
                            </LinkContainer>
                        ) : userInfo.name && userInfo.lastName && !userInfo.isAdmin ? (
                            <NavDropdown title={`${userInfo.name} ${userInfo.lastName}`} id="collasible-nav-dropdown">
                                <NavDropdown.Item eventKey="/user/my-orders" as={Link} to="/user/my-orders">My Orders</NavDropdown.Item>
                                <NavDropdown.Item eventKey="/user" as={Link} to="/user">My Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => dispatch(logout())}>
                                    Log Out
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (<>
                            <LinkContainer to="/login">
                                <Nav.Link>Log In</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/signup">
                                <Nav.Link>Sign Up</Nav.Link>
                            </LinkContainer>
                        </>
                        )}

                        <LinkContainer to="/cart">
                            <Nav.Link>
                                <Badge pill bg="danger">{itemsCount ? itemsCount : ''}</Badge>
                                <i className="bi bi-cart4 me-1" />
                                Cart
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}