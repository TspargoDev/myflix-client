import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = () => {
  // API base URL from environment variables
  const urlAPI = process.env.REACT_APP_API_URL;

  // Retrieve auth token from local storage for API requests
  const storedToken = localStorage.getItem("token");

  // Extract movieId parameter from the route
  const { movieId } = useParams();

  // State to hold the fetched movie data
  const [currentMovie, setCurrentMovie] = useState(null);

  // Loading state to indicate data fetching
  const [loading, setLoading] = useState(true);

  // Error state to handle and display any fetching errors
  const [error, setError] = useState(null);

  // Effect hook to fetch movie data when movieId or token changes
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true); // Start loading indicator

        // Fetch movie data with authorization header
        const response = await fetch(`${urlAPI}/movies/${movieId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        // Throw error if response is not successful
        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }

        // Parse the JSON response
        const movie = await response.json();

        // Debug: log fetched movie data structure
        console.log("Fetched movie:", movie);

        // Update state with the movie data
        setCurrentMovie(movie);
      } catch (err) {
        // Save error message to state to display to the user
        setError(err.message);
      } finally {
        // Stop loading indicator regardless of success or failure
        setLoading(false);
      }
    };

    // Fetch movie only if token and movieId exist
    if (storedToken && movieId) {
      fetchMovie();
    }
  }, [movieId, storedToken, urlAPI]);

  // Show loading state while fetching data
  if (loading) return <div>Loading...</div>;

  // Show error message if fetching failed
  if (error) return <div>Error: {error}</div>;

  // Show fallback if no movie was found
  if (!currentMovie) return <div>Movie not found!</div>;

  // Render movie details once data is successfully fetched
  return (
    <div className="movie-view">
      {/* Movie poster image */}
      {currentMovie.ImageURL && (
        <img
          src={currentMovie.ImageURL}
          alt={`${currentMovie.Title} poster`}
          className="movie-poster"
        />
      )}

      {/* Movie title */}
      <div>
        <strong>Title:</strong> <span>{currentMovie.Title}</span>
      </div>

      {/* Movie description */}
      <div>
        <strong>Description:</strong> <span>{currentMovie.Description}</span>
      </div>

      {/* Movie genre details */}
      {currentMovie.Genre?.Name && (
        <div>
          <strong>Genre:</strong> <span>{currentMovie.Genre.Name}</span>
          <p>{currentMovie.Genre.Description}</p>
        </div>
      )}

      {/* Movie director details */}
      {currentMovie.Director?.Name && (
        <div>
          <strong>Directed by:</strong> <span>{currentMovie.Director.Name}</span>
          <p>{currentMovie.Director.Bio}</p>
        </div>
      )}

      {/* Back button to return to the main movie list */}
      <Link to="/">
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
};

export default MovieView;
