import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { MovieCard } from "../MovieCard/MovieCard";

export const ProfileView = ({ movies }) => {
  const localUser = JSON.parse(localStorage.getItem("user"));
  
  // Define useState hooks before any conditional returns
  const [username, setUsername] = useState(localUser?.Username || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(localUser?.Email || "");
  const [birthday, setBirthday] = useState(localUser?.Birthday || "01/01/0001");
  
  if (!localUser) {
    return <p>Please log in to view and edit your profile.</p>;
  }

  const favMovies = movies.filter((movie) => {
    return localUser.FavoriteMovies.includes(movie._id);
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      ...(password && { Password: password }),  // Only include the password if it's changed
      Email: email,
      Birthday: birthday
    };

    fetch(`${process.env.REACT_APP_API_URL}/users/${localUser.Username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (response.ok) {
        alert("Profile updated successfully");
        response.json().then((updatedUser) => {
          // Update localStorage with the new user details
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.location.reload();  // Optionally reload the page
        });
      } else {
        alert("Profile update failed");
      }
    });
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
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password (leave blank to keep unchanged):</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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

      <Button variant="primary" type="submit">Edit Profile</Button>

      <h3>Your Favorite Movies</h3>
      <div className="favorite-movies">
        {favMovies.length > 0 ? (
          favMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))
        ) : (
          <p>You have no favorite movies.</p>
        )}
      </div>
    </Form>
  );
};

export default ProfileView;
