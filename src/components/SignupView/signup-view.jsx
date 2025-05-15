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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      username, 
      password,
      email,
      birthday,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Signup failed. Please check your inputs."
        );
      }

      await response.json();
      setSuccessMessage("Signup successful! Please login.");
      setError(null);

      // Optionally clear form fields
      setUsername("");
      setPassword("");
      setEmail("");
      setBirthday("");
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.message);
      setSuccessMessage(null);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="4"
          placeholder="Enter a username"
        />
        <Form.Text className="text-muted">
          Must be at least 4 characters long.
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
          placeholder="Enter a secure password"
        />
        <Form.Text className="text-muted">
          Must be at least 6 characters long.
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email address"
        />
      </Form.Group>
      <Form.Group controlId="formBdate">
        <Form.Label>Birthday:</Form.Label>
        <Form.Control
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </Form.Group>
      {error && <p className="text-danger">{error}</p>}{" "}
      {/* Display error message */}
      {successMessage && <p className="text-success">{successMessage}</p>}{" "}
      {/* Display success message */}
      <Button variant="primary" type="submit">
        Sign Up
      </Button>
    </Form>
  );
};

export default SignupView;
