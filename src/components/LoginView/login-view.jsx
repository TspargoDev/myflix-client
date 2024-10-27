import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send login request to the API
    try {
      const response = await fetch('http://travismovieapi-7207728f28d4.herokuapp.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });

      // Parse the response from the server
      if (response.ok) {
        const data = await response.json();

        // Store the token and user in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Notify the parent component of successful login
        onLoggedIn(data.user, data.token);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Something went wrong. Please try again.');
    }
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

      {error && <p className="text-danger">{error}</p>} {/* Display error message */}

      <Button className="custom-button" type="submit">
        Login
      </Button>
    </Form>
  );
};

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};

export default LoginView;
