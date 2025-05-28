import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = () => {
  const urlAPI = process.env.REACT_APP_API_URL; // Using environment variable for API URL
  const storedToken = localStorage.getItem("token");


  const { movieId } = useParams();
  const [currentMovie, setCurrentMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [token] = useState(storedToken);


  useEffect(() => {
    // Fetch movie data from the API when the component mounts or movieId changes
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${urlAPI}/movies/${movieId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }
        
        const movie = await response.json();
        setCurrentMovie(movie);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId, token, urlAPI]); // Re-run the effect if the movieId or token changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentMovie) {
    return <div>Movie not found!</div>;
  }

  return (
    <div>
      <div>
        <span>Title: </span>
        <span>{currentMovie.Title}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{currentMovie.Description}</span>
      </div>
      <div>
        <span>Genre: </span>
        <span>{currentMovie.Genre.Name}</span>
        <p>{currentMovie.Genre.Description}</p>
      </div>
      <div>
        <span>Directed by: </span>
        <span>{currentMovie.Director.Name}</span>
        <p>{currentMovie.Director.Bio}</p>
      </div>
      <Link to={`/`}>
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
};

export default MovieView;
