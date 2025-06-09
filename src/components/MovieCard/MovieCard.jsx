// Import the PropTypes library
import PropTypes from "prop-types";
import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// The MovieCard function component
export const MovieCard = ({ movie, user, updateFavorites, loggedInUsername }) => {
  // Check if the movie is in the user's favorites list
  const isFavorite = user?.FavoriteMovies?.includes(movie._id);

  const navigate = useNavigate();

  function handleClick() {
    navigate(`/movies/${encodeURIComponent(movie._id)}`);
  }

  // Handle toggle of the favorite movies
  const handleFavoriteToggle = () => {
    const movieID = movie._id;
    const method = isFavorite ? "DELETE" : "POST";

    if (isFavorite && method === "POST") {
      console.log("Movie is already in the favorites list. No action taken.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/users/${loggedInUsername}/movies/${movieID}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
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
      <Card.Img
        variant="top"
        src={movie.ImageURL}
        alt={movie.Title}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
        }}
      />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Card.Text>{movie.Director?.Name}</Card.Text>
        <Card.Text>{movie.Genre?.Name}</Card.Text>

        <Button variant="link" onClick={handleClick}>
          Open
        </Button>

        <Button variant={isFavorite ? "danger" : "primary"} onClick={handleFavoriteToggle}>
          {isFavorite ? "Unfavorite" : "Favorite"}
        </Button>
      </Card.Body>
    </Card>
  );
};

// Defined props constraints for the MovieCard
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
