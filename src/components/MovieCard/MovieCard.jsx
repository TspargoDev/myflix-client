import PropTypes from 'prop-types';
import React from 'react';
import { Button, Card } from 'react-bootstrap';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img 
        variant="top" 
        src={movie.imageURL || 'https://via.placeholder.com/150'} // Fallback image URL if none provided
        alt={movie.Title}
      />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title> {/* Capitalized 'Title' as per API response */}
        <Card.Text>{movie.Description}</Card.Text> {/* Capitalized 'Description' */}
        <Button variant="primary" onClick={() => onMovieClick(movie)}>View Details</Button>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired, // Ensure 'Title' is capitalized to match API response
    Description: PropTypes.string.isRequired, // Ensure 'Description' is capitalized to match API response
    imageURL: PropTypes.string,
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};

export default MovieCard;
