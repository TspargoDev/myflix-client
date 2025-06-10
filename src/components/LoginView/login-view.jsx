import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const LoginView = ({ onLoggedIn }) => {
  // State for the username input field
  const [username, setUsername] = useState("");
  // State for the password input field
  const [password, setPassword] = useState("");
  // State to store and display any login error messages
  const [error, setError] = useState("");

  // Handles form submission when user clicks the login button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Prepare login payload with current username and password
    const loginData = {
      username,
      password,
    };

    console.log("Payload being sent:", JSON.stringify(loginData)); // Debug: log payload

    try {
      // Send POST request to login endpoint with credentials
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        // If login succeeds, parse the response JSON
        const data = await response.json();

        // Save token and user data to localStorage for persistence
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Notify parent component that login was successful
        onLoggedIn(data.user, data.token);
      } else {
        // If server returns an error, extract and log the response text
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        // Display generic login failure message to user
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      // Catch and log any network or unexpected errors
      console.error("Error during login:", error);
      // Display generic error message to user
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Username input field */}
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>

      {/* Password input field */}
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

      {/* Display any error messages */}
      {error && <p className="text-danger">{error}</p>}

      {/* Submit button */}
      <Button className="custom-button" type="submit">
        Login
      </Button>
    </Form>
  );
};

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired, // Callback prop for successful login
};

export default LoginView;
