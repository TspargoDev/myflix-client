// Import PropTypes for runtime type checking of props
import PropTypes from "prop-types";
import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// MovieCard component displays information about a single movie
// and allows users to mark/unmark the movie as a favorite.
export const MovieCard = ({ movie, user, updateFavorites, loggedInUsername }) => {
  // Determine if the current movie is already in the user's favorites
  const isFavorite = user?.FavoriteMovies?.includes(movie._id);

  // useNavigate hook to programmatically navigate to movie details page
  const navigate = useNavigate();

  // Handle click on "Open" button to navigate to the detailed movie view
  function handleClick() {
    // Encode movie ID to safely include it in the URL
    navigate(`/movies/${encodeURIComponent(movie._id)}`);
  }

  // Handle favorite toggle button click to add or remove movie from favorites
  const handleFavoriteToggle = (e) => {
    // Prevent click event from bubbling up to parent elements (like the card)
    e.stopPropagation();
    console.log("Favorite button clicked!");

    const movieID = movie._id;
    const method = isFavorite ? "DELETE" : "POST";

    // Try getting the username from props or from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const username =
      user?.Username ||
      user?.username ||
      storedUser?.Username ||
      storedUser?.username;

    if (!username) {
      console.error("Username is missing from both props and localStorage.");
      return;
    }

    const requestUrl = `${process.env.REACT_APP_API_URL}/users/${username}/movies/${movieID}`;
    console.log("Sending request to:", requestUrl);

    // Send request to backend API to update user's favorite movies
    fetch(requestUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}` // Authenticate the request
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((updatedUser) => {
        updateFavorites(updatedUser.FavoriteMovies);
      })
      .catch((err) => {
        console.error("Failed to update favorites:", err);
      });
  };

  return (
    <Card className="movie-card">
      {/* Movie poster image with fallback in case of error */}
      <Card.Img
        variant="top"
        src={movie.ImageURL}
        alt={movie.Title}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
        }}
      />
      <Card.Body>
        {/* Movie title */}
        <Card.Title>{movie.Title}</Card.Title>

        {/* Display movie director's name */}
        <Card.Text className="movie-director">
          {movie.Director?.Name}
        </Card.Text>

        {/* Display movie genre */}
        <Card.Text className="movie-genre">
          {movie.Genre?.Name}
        </Card.Text>

        {/* Button to open detailed movie view */}
        <Button className="btn-open" onClick={handleClick}>
          Open
        </Button>

        {/* Button to toggle favorite status */}
        <Button
          className={`btn-favorite ${isFavorite ? "favorite-active" : ""}`}
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </Button>
      </Card.Body>
    </Card>
  );
};

// Define expected prop types and shape for type checking and documentation
MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImageURL: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired
    }).isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string.isRequired,
      Birth: PropTypes.string,
      Death: PropTypes.string
    }).isRequired
  }).isRequired,
  user: PropTypes.shape({
    FavoriteMovies: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  updateFavorites: PropTypes.func.isRequired,
  loggedInUsername: PropTypes.string.isRequired
};

export default MovieCard;
