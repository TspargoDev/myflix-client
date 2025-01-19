import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import LoginView from '../LoginView/login-view';
import MovieCard from '../MovieCard/MovieCard';
import MovieView from '../MovieView/Movie-view';
import SignupView from '../SignupView/signup-view';

const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  // Initialize state from local storage
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedToken);
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(movies);

  // Fetch movies if token is available
  useEffect(() => {
    if (!token) return;

    fetch("https://travismovie-api-f55e5b0e3ed5.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMovies(data); // Store the fetched movies
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetch("https://movie-api-bqfe.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const movies = data.map((doc) => ({
          id: doc._id,
          title: doc.title,
          description: doc.description,
          genre: doc.genre,
          director: doc.director.name,
        }));
        setMovies(movies);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [token]);

  return (
    <Row>
      {!user ? (
        <Col md={5}>
          <LoginView
            onLoggedIn={(user, token) => {
              setUser(user);
              setToken(token);
            }}
          />
         
          <SignupView />
        </Col>
      ) : selectedMovie ? (
        <Col md={8}>
          <MovieView
            movie={selectedMovie}
            onBackClick={() => setSelectedMovie(null)}
          />
        </Col>
      ) : movies.length === 0 ? (
        <div>The list is empty!</div>
      ) : (
        <>
          {movies.map((movie) => (
            <Col className="mb-5" key={movie.id} md={3}>
              <MovieCard
                movie={movie}
                onMovieClick={(newSelectedMovie) => {
                  setSelectedMovie(newSelectedMovie);
                }}
              />
            </Col>
          ))}
        </>
      )}
    </Row>
  );
};

export default MainView;
