// external imports
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

// import admin components
import MetaComponent from '../../components/MetaComponent';
import AdminLinksComponent from '../../components/adminComponents/AdminLinksComponent';
import AdminChatRoomComponent from '../../components/adminComponents/AdminChatRoomComponent';

export default function AdminChartsPage() {
    const { chatRooms, socket } = useSelector((state) => state.adminChat);

    return (
        <>
            <MetaComponent title="A2Z - Chats" />
            <Container fluid className="mt-3">
                <Row className="m-3">
                    <Col md={2}>
                        <AdminLinksComponent />
                    </Col>
                    <Col md={10}>
                        <Row>
                            {Object.entries(chatRooms).map((chatRoom, idx) => (
                                <AdminChatRoomComponent key={idx} chatRoom={chatRoom} roomIndex={idx + 1} socket={socket} socketUser={chatRoom[0]} />
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
};