<<<<<<< Updated upstream
=======
// src/components/LoginView/LoginView.jsx
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap'; // Import Button from react-bootstrap

const LoginView = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      {/* Custom styled button */}
      <Button className="custom-button" type="submit">
        Login
      </Button>
    </Form>
  );
};

LoginView.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginView;
>>>>>>> Stashed changes
