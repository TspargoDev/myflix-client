import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { BrowserRouter } from "react-router-dom";
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

  // Filter movies based on the search query
  useEffect(() => {
    setFilteredMovies(
      movies.filter((movie) =>
        movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, movies]);

  // If no user, show the login/signup view
  if (!user) {
    return (
      <>
        <LoginView onLoggedIn={(user, token) => {
          setUser(user);
          setToken(token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        }} />
        or
        <SignupView />
      </>
    );
  }

  // If a movie is selected, show MovieView
  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  // If there are no movies, show a message
  if (movies.length === 0) {
    return (
      <>
        <button
          onClick={() => {
            setUser(null);
            setToken(null);
            localStorage.clear();
          }}
        >
          Logout
        </button>
        <div>The list is empty!</div>
      </>
    );
  }

  // Main view displaying movies
  return (
    <BrowserRouter>
      <Row>
        {filteredMovies.map((movie) => (
          <Col className='md-5' key={movie._id || movie.id}> {/* Ensure the key is unique */}
            <MovieCard
              movie={movie}
              onMovieClick={(newSelectedMovie) => {
                setSelectedMovie(newSelectedMovie);
              }}
            />
          </Col>
        ))}
        <button onClick={() => { 
          setUser(null); 
          setToken(null); 
          localStorage.clear(); 
        }}>Logout</button>
      </Row>
    </BrowserRouter>
  );
};

export default MainView;
