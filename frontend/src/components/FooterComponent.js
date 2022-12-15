// external imports
import { Container, Row, Col } from 'react-bootstrap';

export default function FooterComponent() {
    return (
        <footer>
            <Container fluid>
                <Row className="mt-5">
                    <Col className="bg-dark text-white text-center py-4">Copyright &copy; A2Z</Col>
                </Row>
            </Container>
        </footer>
    );
}