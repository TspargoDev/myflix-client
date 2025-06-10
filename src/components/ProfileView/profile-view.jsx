import { useState } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { MovieCard } from "../MovieCard/MovieCard";

export const ProfileView = ({ movies }) => {
  // Retrieve user data and profile picture from localStorage
  const localUser = JSON.parse(localStorage.getItem("user"));
  const storedProfilePic = localStorage.getItem("profilePic");

  // Initialize state for profile fields and profile picture
  const [username, setUsername] = useState(localUser?.Username || "");
  const [password, setPassword] = useState(""); // Password is blank initially for security
  const [email, setEmail] = useState(localUser?.Email || "");
  const [birthday, setBirthday] = useState(localUser?.Birthday || "01/01/0001");
  const [profilePic, setProfilePic] = useState(storedProfilePic || "");

  // If no user is logged in, prompt to log in
  if (!localUser) {
    return (
      <p className="text-center mt-4">
        Please log in to view and edit your profile.
      </p>
    );
  }

  // Filter favorite movies based on IDs stored in user's data
  const favMovies = movies.filter((movie) =>
    localUser.FavoriteMovies?.includes(movie._id)
  );

  /**
   * Handles uploading and previewing profile picture.
   * Reads the image file and stores it in localStorage as a base64 string.
   * @param {Event} e - File input change event
   */
  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Save the image as base64 string in localStorage and update state
        localStorage.setItem("profilePic", reader.result);
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handles form submission to update user profile.
   * Sends PUT request to update user data on the backend.
   * @param {Event} event - Form submission event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare data object for updating user profile
    const data = {
      Username: username,
      // Include password only if it's changed (not blank)
      ...(password && { Password: password }),
      Email: email,
      Birthday: birthday,
    };

    // Send update request to backend API with authorization token
    fetch(`${process.env.REACT_APP_API_URL}/users/${localUser.Username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        alert("Profile updated successfully");
        response.json().then((updatedUser) => {
          // Update user info in localStorage and reload page to reflect changes
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.location.reload();
        });
      } else {
        alert("Profile update failed");
      }
    });
  };

  return (
    <div className="profile-container">
      {/* Profile editing card */}
      <Card className="profile-card text-center">
        <Card.Body>
          <h2 className="mb-3">Edit Profile</h2>

          {/* Profile picture display and upload */}
          <div className="mb-4">
            <Image
              src={profilePic || "https://via.placeholder.com/150?text=Profile"}
              roundedCircle
              width="120"
              height="120"
              className="mb-2 border"
              alt="Profile"
            />
            <Form.Group controlId="formProfilePic" className="mt-2">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handlePicUpload}
              />
            </Form.Group>
          </div>

          {/* Profile update form */}
          <Form onSubmit={handleSubmit}>
            {/* Username input */}
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={4}
              />
            </Form.Group>

            {/* Password input - optional */}
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password (leave blank to keep unchanged)</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {/* Email input */}
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* Birthday input */}
            <Form.Group controlId="formBdate" className="mb-4">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
              />
            </Form.Group>

            {/* Submit button */}
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Favorite movies section */}
      <div className="favorite-movies-section mt-5">
        <h3 className="text-center mb-4">Your Favorite Movies</h3>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {favMovies.length > 0 ? (
            favMovies.map((movie) => (
              <Col key={movie._id}>
                <MovieCard
                  movie={movie}
                  user={localUser}
                  updateFavorites={(updatedFavorites) => {
                    // Update favorite movies in localStorage and reload to refresh UI
                    const updatedUser = {
                      ...localUser,
                      FavoriteMovies: updatedFavorites,
                    };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    window.location.reload();
                  }}
                  loggedInUsername={localUser.Username}
                />
              </Col>
            ))
          ) : (
            <p className="text-center">You have no favorite movies.</p>
          )}
        </Row>
      </div>
    </div>
  );
};

export default ProfileView;
