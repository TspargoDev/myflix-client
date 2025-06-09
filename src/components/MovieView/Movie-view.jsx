import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = () => {
  const urlAPI = process.env.REACT_APP_API_URL; // Environment API URL
  const storedToken = localStorage.getItem("token");

  const { movieId } = useParams();
  const [currentMovie, setCurrentMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${urlAPI}/movies/${movieId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }

        const movie = await response.json();
        console.log("Fetched movie:", movie); // Debug log to check response shape
        setCurrentMovie(movie);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storedToken && movieId) {
      fetchMovie();
    }
  }, [movieId, storedToken, urlAPI]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentMovie) return <div>Movie not found!</div>;

  return (
    <div className="movie-view">
      {currentMovie.ImageURL && (
        <img
          src={currentMovie.ImageURL}
          alt={`${currentMovie.Title} poster`}
          className="movie-poster"
        />
      )}
      <div>
        <strong>Title:</strong> <span>{currentMovie.Title}</span>
      </div>
      <div>
        <strong>Description:</strong> <span>{currentMovie.Description}</span>
      </div>
      {currentMovie.Genre?.Name && (
        <div>
          <strong>Genre:</strong> <span>{currentMovie.Genre.Name}</span>
          <p>{currentMovie.Genre.Description}</p>
        </div>
      )}
      {currentMovie.Director?.Name && (
        <div>
          <strong>Directed by:</strong> <span>{currentMovie.Director.Name}</span>
          <p>{currentMovie.Director.Bio}</p>
        </div>
      )}
      <Link to="/">
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
};

export default MovieView;
