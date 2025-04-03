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
      }));
      setMovies(movies);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}, [token]);


if (!user) {
  return (
      <Row className="justify-content-md-center">
          <Col md={5}>

              <LoginView onLoggedIn={(user, token) => {
                  setUser(user);
                  localStorage.setItem("user", user);
                  setToken(token);
                  localStorage.setItem("token", token);
              }} />
              or
              <SignupView />
          </Col>
      </Row>
  )
}

if (selectedMovie) {
  let similarMovies = movies.filter((movie) => {
      return movie.genre.name === selectedMovie.genre.name
          && movie.title !== selectedMovie.title;
  })
  console.log(similarMovies);
  return (
      <Row className="justify-content-md-center">
          <Col md={8}>
              <MovieView
                  movie={selectedMovie}
                  onBackClick={() => setSelectedMovie(null)} />
              <hr />
              <h2>Similar Movies</h2>
              <Row className="justify-content-md-center">
                  {similarMovies.map((movie) => (
                      <Col className="mb-5" key={movie.id} lg={3} md={4} sm={12}>
                          <MovieCard
                              movie={movie}
                              onMovieClick={(newSelection) => {
                                  setSelectedMovie(newSelection);
                              }}
                          />
                      </Col>
                  ))}
              </Row>
          </Col>
      </Row>
  );
}

if (movies.length === 0) {
  return <div>The list is empty!</div>;
}

return (
  <Row>
      {movies.map((movie) => (
          <Col className="mb-5" key={movie.id} lg={2} md={3} sm={12}>
              <MovieCard
                  movie={movie}
                  onMovieClick={(newSelection) => {
                      setSelectedMovie(newSelection);
                  }}
              />
          </Col>
      ))}
      <Col sm={12}>
          <Button variant="primary" onClick={() => { setUser(null); setToken(null); }}>Logout</Button>
      </Col>
  </Row>
);
};