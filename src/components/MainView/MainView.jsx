import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LoginView from '../LoginView/login-view';
import MovieCard from '../MovieCard/MovieCard';
import MovieView from '../MovieView/Movie-view';
import NavigationBar from '../NavgationBar/navigation-bar';
import ProfileView from '../ProfileView/profile-view';
import SignupView from '../SignupView/signup-view';

export const MainView = () => {
  const urlAPI = process.env.REACT_APP_API_URL; // Base API URL from environment variables

  // Retrieve stored user info and token from local storage for persistent login
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  // State to hold the list of all movies fetched from the backend
  const [movies, setMovies] = useState([]);
  // State to hold movies filtered by search input (genre)
  const [filteredMovies, setFilteredMovies] = useState([]);
  // State to hold current search input value
  const [searchVal, setSearchVal] = useState("");
  // State for current logged-in user info
  const [user, setUser] = useState(storedUser);
  // State for authentication token
  const [token, setToken] = useState(storedToken);

  // Logout handler: clears user info and token from state and localStorage
  const onLoggedOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Fetch movies from API whenever token or API URL changes
  useEffect(() => {
    console.log("TOKEN:" + token);
    if (!token) return; // Do nothing if no token present

    fetch(urlAPI + "/movies", {
      headers: { Authorization: `Bearer ${token}` }, // Send token for authorization
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log fetched movies for debugging
        setMovies(data);   // Store movies in state
      });
  }, [token, urlAPI]);

  // Update filtered movies whenever search input or full movies list changes
  useEffect(() => {
    if (searchVal === "") {
      setFilteredMovies(movies); // No filter if search is empty, show all movies
    } else {
      // Filter movies by genre name (case-insensitive match)
      const filtered = movies.filter((movie) =>
        movie.Genre.Name.toLowerCase().includes(searchVal.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchVal, movies]);

  // Component that renders the main authenticated app UI
  const AuthenticatedApp = () => {
    const location = useLocation(); // Get current route location

    return (
      <>
        {/* Navigation bar with user info and logout callback */}
        <NavigationBar
          user={user}
          onLoggedOut={() => {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }}
        />
        <Row className="justify-content-md-center">
          {/* Show search input only on the homepage */}
          {location.pathname === "/" && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <input
                type="text"
                placeholder="Search by Genre"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
          )}

          {/* Define app routes */}
          <Routes>
            {/* Route for individual movie details */}
            <Route
              path="/movies/:movieId"
              element={
                <Col md={8}>
                  <MovieView movies={movies} />
                </Col>
              }
            />

            {/* Homepage route showing filtered list of movies */}
            <Route
              path="/"
              element={
                filteredMovies.length === 0 ? (
                  <Col>The list is empty!</Col> // Message when no movies found
                ) : (
                  filteredMovies.map((movie) => (
                    <Col className="mb-4" key={movie._id} md={3}>
                      <MovieCard
                        movie={movie}
                        user={user}
                        updateFavorites={(updatedFavorites) => {
                          // Update user's favorites list when changed in MovieCard
                          setUser({ ...user, FavoriteMovies: updatedFavorites });
                        }}
                        loggedInUsername={user.Username}
                      />
                    </Col>
                  ))
                )
              }
            />

            {/* Route for user profile view */}
            <Route path="/profile" element={<ProfileView movies={movies} />} />

            {/* Redirect all unknown routes to homepage */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Row>
      </>
    );
  };

  // If user is not logged in, render authentication routes
  if (!user) {
    return (
      <BrowserRouter>
        <NavigationBar user={user} onLoggedOut={onLoggedOut} />
        <Row className="justify-content-md-center">
          <Routes>
            {/* Signup route */}
            <Route
              path="/signup"
              element={
                <Col md={5}>
                  <SignupView />
                </Col>
              }
            />
            {/* Login route with callback to update user and token state */}
            <Route
              path="/login"
              element={
                <Col md={5}>
                  <LoginView
                    onLoggedIn={(user, token) => {
                      setUser(user);
                      setToken(token);
                    }}
                  />
                </Col>
              }
            />
            {/* Redirect unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Row>
      </BrowserRouter>
    );
  }

  // If user is logged in, render the authenticated app routes
  return (
    <BrowserRouter>
      <AuthenticatedApp />
    </BrowserRouter>
  );
};

export default MainView;
