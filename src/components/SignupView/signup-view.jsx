import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState(null); // To store any signup errors
  const [successMessage, setSuccessMessage] = useState(null); // For success message

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };

    fetch("https://travismovie-api-f55e5b0e3ed5.herokuapp.com/testuser", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Signup failed. Please check your inputs.");
        }
      })
      .then((data) => {
        setSuccessMessage("Signup successful! Please login.");
        setError(null);  // Clear any existing error messages
        // Optionally redirect to login page or show a success message
      })
      .catch((error) => {
        setError(error.message); // Set error message if signup fails
        setSuccessMessage(null);  // Clear success message if there's an error
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={Username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="4"
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6" // Enforce minimum password length
        />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBdate">
        <Form.Label>Birthday:</Form.Label>
        <Form.Control
          type="date"
          value={Birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </Form.Group>

      {error && <p className="text-danger">{error}</p>} {/* Display error message */}
      {successMessage && <p className="text-success">{successMessage}</p>} {/* Display success message */}

      <Button variant="primary" type="submit">
        Signup
      </Button>
    </Form>
  );
};

export default SignupView;
