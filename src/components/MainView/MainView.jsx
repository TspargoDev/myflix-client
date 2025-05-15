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
    const urlAPI = process.env.REACT_APP_API_URL;
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
  

    // Initialize state from local storage
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [user, setUser] = useState(storedUser);
    const [token, setToken] = useState(storedToken);
    
    const onLoggedOut = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    };
  
    useEffect(() => {
      console.log("TOKEN:" + token);
      if (!token) return;
  
      fetch(urlAPI + "/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setMovies(data);
        });
    }, [token, urlAPI]);

    // Filters movies as the user types
    useEffect(() => {
      if (searchVal === "") {
        setFilteredMovies(movies); // show all movies if input is empty
      } else {
        const filtered = movies.filter((movie) =>
          movie.Genre.Name.toLowerCase().includes(searchVal.toLowerCase())
        );
        setFilteredMovies(filtered);
      }
    }, [searchVal, movies]); // Trigger whenever searchVal or movies change

    const AuthenticatedApp = () => {
      const location = useLocation();

      return (
        <>
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
            {/* Conditionally render search bar only on the home page */}
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
            <Routes>
              <Route
                path="/movies/:movieId"
                element={
                  <Col md={8}>
                    <MovieView movies={movies} />
                  </Col>
                }
              />
              <Route
                path="/"
                element={
                  filteredMovies.length === 0 ? (
                    <Col>The list is empty!</Col>
                  ) : (
                    filteredMovies.map((movie) => (
                      <Col className="mb-4" key={movie._id} md={3}>
                        <MovieCard
                          movie={movie}
                          user={user}
                          updateFavorites={(updatedFavorites) => {
                            setUser({ ...user, FavoriteMovies: updatedFavorites });
                          }}
                          loggedInUsername={user.Username}
                        />
                      </Col>
                    ))
                  )
                }
              />
              <Route path="/profile" element={<ProfileView movies={movies} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Row>
        </>
      );
    };

    if (!user) {
      return (
        <BrowserRouter>
          <NavigationBar user={user} onLoggedOut={onLoggedOut} />
          <Row className="justify-content-md-center">
            <Routes>
              <Route
                path="/signup"
                element={
                  <Col md={5}>
                    <SignupView />
                  </Col>
                }
              />
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
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Row>
        </BrowserRouter>
      );
    }

    return (
      <BrowserRouter>
        <AuthenticatedApp />
      </BrowserRouter>
    );
  };

export default MainView;