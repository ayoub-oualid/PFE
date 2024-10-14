import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Container>
      <h1>Admin Dashboard</h1>
      <Row>
        <Col>Welcome, {userInfo.name}</Col>
      </Row>
      <Row>
        <Col>
          <p>This is the admin dashboard. You can add admin-specific functionality here.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;