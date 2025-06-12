import { useState } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { MovieCard } from "../MovieCard/MovieCard";

export const ProfileView = ({ movies }) => {
  // Initialize state from localStorage user on mount
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedProfilePic = localStorage.getItem("profilePic");

  // Store user info in state for reactive updates
  const [user, setUser] = useState(storedUser);
  const [profilePic, setProfilePic] = useState(storedProfilePic || "");

  // Use user data or defaults for form inputs
  const [username, setUsername] = useState(user?.Username || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user?.Email || "");
  const [birthday, setBirthday] = useState(user?.Birthday || "01/01/0001");

  if (!user) {
    return (
      <p className="text-center mt-4">
        Please log in to view and edit your profile.
      </p>
    );
  }

  // Filter favorite movies using current user state
  const favMovies = movies.filter((movie) =>
    user.FavoriteMovies?.includes(movie._id)
  );

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("profilePic", reader.result);
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      ...(password && { Password: password }),
      Email: email,
      Birthday: birthday,
    };

    fetch(`${process.env.REACT_APP_API_URL}/users/${user.Username}`, {
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
          // Update localStorage and state so UI updates without reload
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        });
      } else {
        alert("Profile update failed");
      }
    });
  };

  return (
    <div className="profile-container">
      <Card className="profile-card text-center">
        <Card.Body>
          <h2 className="mb-3">Edit Profile</h2>

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

          <Form onSubmit={handleSubmit}>
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

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password (leave blank to keep unchanged)</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBdate" className="mb-4">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <div className="favorite-movies-section mt-5">
        <h3 className="text-center mb-4">Your Favorite Movies</h3>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {favMovies.length > 0 ? (
            favMovies.map((movie) => (
              <Col key={movie._id}>
                <MovieCard
                  movie={movie}
                  user={user}
                  updateFavorites={(updatedFavorites) => {
                    // Update user state & localStorage to update favorites in UI
                    const updatedUser = {
                      ...user,
                      FavoriteMovies: updatedFavorites,
                    };
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                  }}
                  loggedInUsername={user.Username}
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
