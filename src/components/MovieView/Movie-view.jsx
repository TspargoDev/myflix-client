import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./movie-view.scss";

/**
 * MovieView component
 * Displays detailed information about a selected movie.
 * Fetches movie data from backend API using the movie ID from URL params.
 */
export const MovieView = () => {
  // Backend API base URL (from environment variables)
  const urlAPI = process.env.REACT_APP_API_URL;

  // User authentication token stored in localStorage
  const storedToken = localStorage.getItem("token");

  // Extract movieId parameter from the route URL
  const { movieId } = useParams();

  // Component state
  const [currentMovie, setCurrentMovie] = useState(null); // Movie data object
  const [loading, setLoading] = useState(true);           // Loading status flag
  const [error, setError] = useState(null);               // Error message

  /**
   * Fetch movie details from API when component mounts or dependencies change.
   */
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        console.log("Fetching movie with ID:", movieId);

        // Append timestamp to URL to prevent cached response
        const response = await fetch(`${urlAPI}/movies/${movieId}?t=${Date.now()}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`, // Bearer token for auth
          },
        });

        // Handle HTTP 304 Not Modified status (optional)
        if (response.status === 304) {
          console.warn("Movie not modified — skipping update.");
          return;
        }

        // Throw error if response is not OK (status 200-299)
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch movie data: ${text}`);
        }

        // Parse JSON response and update state
        const movie = await response.json();
        console.log("Fetched movie:", movie);
        setCurrentMovie(movie);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if token and movieId are present
    if (storedToken && movieId) {
      fetchMovie();
    }
  }, [movieId, storedToken, urlAPI]);

  // Conditional rendering for loading, error, and no data states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentMovie || !currentMovie.Title) return <div>Movie not found!</div>;

  // Main component render
  return (
    <div className="movie-view">
      {/* Movie Poster */}
      {currentMovie.ImageURL && (
        <img
          src={currentMovie.ImageURL}
          alt={`${currentMovie.Title} poster`}
          className="movie-poster"
          onError={(e) => {
            // Fallback image if poster fails to load
            e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
      )}

      {/* Movie Details Section */}
      <div className="movie-details">
        <div>
          <strong>Title:</strong> {currentMovie.Title}
        </div>
        <div>
          <strong>Description:</strong> {currentMovie.Description}
        </div>

        {/* Genre Info */}
        {currentMovie.Genre?.Name && (
          <div>
            <strong>Genre:</strong> {currentMovie.Genre.Name}
            <p>{currentMovie.Genre.Description}</p>
          </div>
        )}

        {/* Director Info */}
        {currentMovie.Director?.Name && (
          <div>
            <strong>Director:</strong> {currentMovie.Director.Name}
            {currentMovie.Director.Bio && <p>{currentMovie.Director.Bio}</p>}
          </div>
        )}

        {/* Actors List */}
        {currentMovie.Actors?.length > 0 && (
          <div>
            <strong>Actors:</strong> {currentMovie.Actors.join(", ")}
          </div>
        )}

        {/* Additional Movie Details */}
        {currentMovie.ReleaseYear && (
          <div>
            <strong>Release Year:</strong> {currentMovie.ReleaseYear}
          </div>
        )}
        {currentMovie.Runtime && (
          <div>
            <strong>Runtime:</strong> {currentMovie.Runtime} min
          </div>
        )}
        {currentMovie.Rating && (
          <div>
            <strong>Rating:</strong> {currentMovie.Rating}/10
          </div>
        )}
        {currentMovie.Language && (
          <div>
            <strong>Language:</strong> {currentMovie.Language}
          </div>
        )}

        {/* Streaming Platforms List */}
        {currentMovie.streamingPlatforms && currentMovie.streamingPlatforms.length > 0 && (
          <div className="streaming-platforms">
            <strong>Available on:</strong>
            <ul>
              {currentMovie.streamingPlatforms.map((platform) => (
                <li key={platform.name}>
                  <a href={platform.url} target="_blank" rel="noopener noreferrer">
                    {platform.logoURL && (
                      <img
                        src={platform.logoURL}
                        alt={platform.name}
                        style={{ height: "24px", marginRight: "8px", verticalAlign: "middle" }}
                      />
                    )}
                    {platform.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Back Navigation Button */}
      <Link to="/">
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
};

export default MovieView;