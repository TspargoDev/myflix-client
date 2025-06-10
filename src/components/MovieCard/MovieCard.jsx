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
    // Choose HTTP method based on whether the movie is already a favorite
    const method = isFavorite ? "DELETE" : "POST";

    // Send request to backend API to update user's favorite movies
    fetch(`${process.env.REACT_APP_API_URL}/users/${loggedInUsername}/movies/${movieID}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}` // Authenticate the request
      }
    })
      .then((response) => {
        if (!response.ok) {
          // If response is not ok, throw an error to be caught in catch block
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        // Parse the JSON response containing the updated user data
        return response.json();
      })
      .then((updatedUser) => {
        // Update the favorites state in the parent component with new favorites list
        updateFavorites(updatedUser.FavoriteMovies);
      })
      .catch((err) => {
        // Log any errors encountered during the request
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
          // Replace broken image with placeholder image
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
        <Button variant="link" onClick={handleClick}>
          Open
        </Button>

        {/* Button to toggle favorite status */}
        <Button variant={isFavorite ? "danger" : "primary"} onClick={handleFavoriteToggle}>
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
