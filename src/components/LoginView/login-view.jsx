import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState(""); // Changed to camelCase
  const [password, setPassword] = useState(""); // Changed to camelCase
  const [error, setError] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    console.log("Payload being sent:", JSON.stringify(loginData)); // Debugging payload

    try {
      const response = await fetch(
        "https://travismovie-api-f55e5b0e3ed5.herokuapp.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Store the token and user in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Notify the parent component of successful login
        onLoggedIn(data.user, data.token);
      } else {
        const errorText = await response.text(); // Log server response for debugging
        console.error("Server error response:", errorText);
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Username"
          value={username} // Updated to use camelCase
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password} // Updated to use camelCase
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      {error && <p className="text-danger">{error}</p>}{" "}
      {/* Display error message */}
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
