import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const SignupView = () => {
  // State variables for form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  // State for error messages during signup
  const [error, setError] = useState(null);

  // State for success message after successful signup
  const [successMessage, setSuccessMessage] = useState(null);

  /**
   * Handles form submission for user signup.
   * Sends a POST request to the backend API with user data.
   * @param {Event} event - The form submission event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare data payload for API request
    const data = {
      username,
      password,
      email,
      birthday,
    };

    try {
      // Send signup request to API
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

      // Handle error response from API
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Signup failed. Please check your inputs."
        );
      }

      // Parse response JSON (if needed)
      await response.json();

      // Clear any previous errors and display success message
      setError(null);
      setSuccessMessage("Signup successful! Please login.");

      // Optionally clear form fields after successful signup
      setUsername("");
      setPassword("");
      setEmail("");
      setBirthday("");
    } catch (error) {
      // Handle and display any errors during signup
      console.error("Error during signup:", error);
      setError(error.message);
      setSuccessMessage(null);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Username input */}
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={4}
          placeholder="Enter a username"
        />
        <Form.Text className="text-muted">
          Must be at least 4 characters long.
        </Form.Text>
      </Form.Group>

      {/* Password input */}
      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Enter a secure password"
        />
        <Form.Text className="text-muted">
          Must be at least 6 characters long.
        </Form.Text>
      </Form.Group>

      {/* Email input */}
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

      {/* Birthday input */}
      <Form.Group controlId="formBdate">
        <Form.Label>Birthday:</Form.Label>
        <Form.Control
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </Form.Group>

      {/* Display error message if signup fails */}
      {error && <p className="text-danger">{error}</p>}

      {/* Display success message upon successful signup */}
      {successMessage && <p className="text-success">{successMessage}</p>}

      {/* Submit button */}
      <Button variant="primary" type="submit">
        Sign Up
      </Button>
    </Form>
  );
};

export default SignupView;
