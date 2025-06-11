import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./movie-view.scss";

// MovieView component displays detailed information about a selected movie
export const MovieView = () => {
  const urlAPI = process.env.REACT_APP_API_URL; // Backend API base URL
  const storedToken = localStorage.getItem("token"); // User's auth token
  const { movieId } = useParams(); // Get movie ID from URL

  // Component state
  const [currentMovie, setCurrentMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie details when component mounts or dependencies change
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        console.log("Fetching movie with ID:", movieId);

        // Optional: Append timestamp to bypass cache
        const response = await fetch(`${urlAPI}/movies/${movieId}?t=${Date.now()}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        // Handle 304 Not Modified (no new data to fetch)
        if (response.status === 304) {
          console.warn("Movie not modified — skipping update.");
          return;
        }

        // Handle error response
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch movie data: ${text}`);
        }

        // Parse and set movie data
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

    if (storedToken && movieId) {
      fetchMovie();
    }
  }, [movieId, storedToken, urlAPI]);

  // Conditional rendering
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!currentMovie || !currentMovie.Title) return <div>Movie not found!</div>;

  return (
    <div className="movie-view">
      {/* Movie Poster */}
      {currentMovie.ImageURL && (
        <img
          src={currentMovie.ImageURL}
          alt={`${currentMovie.Title} poster`}
          className="movie-poster"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
      )}

      {/* Movie Details */}
      <div className="movie-details">
        <div>
          <strong>Title:</strong> {currentMovie.Title}
        </div>
        <div>
          <strong>Description:</strong> {currentMovie.Description}
        </div>

        {currentMovie.Genre?.Name && (
          <div>
            <strong>Genre:</strong> {currentMovie.Genre.Name}
            <p>{currentMovie.Genre.Description}</p>
          </div>
        )}

        {currentMovie.Director?.Name && (
          <div>
            <strong>Director:</strong> {currentMovie.Director.Name}
            {currentMovie.Director.Bio && <p>{currentMovie.Director.Bio}</p>}
          </div>
        )}

        {currentMovie.Actors?.length > 0 && (
          <div>
            <strong>Actors:</strong> {currentMovie.Actors.join(", ")}
          </div>
        )}

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

        {/* Streaming Platforms */}
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

      {/* Back Button */}
      <Link to="/">
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
};

export default MovieView;
