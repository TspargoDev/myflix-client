
// src/components/LoginView/LoginView.jsx
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const LoginView = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('YOUR_API_URL/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token
      onLogin(); // Call onLogin function passed as a prop to update the app state
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>} {/* Display error message */}
    </form>
  );
};

LoginView.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginView;
