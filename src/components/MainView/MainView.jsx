// src/components/MainView/MainView.jsx
import React, { useEffect, useState } from 'react';
import LoginView from '../LoginView/LoginView';
import MovieCard from '../MovieCard/MovieCard';
import MovieView from '../MovieView/Movieview.jsx';

const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const fetchMovies = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch('', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          setMovies(data);
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      }
    };
    fetchMovies();
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setIsLoggedIn(false); // Update your state to show login view
    };
    
    
  const onBackClick = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      {selectedMovie ? (
        <MovieView movie={selectedMovie} onBackClick={onBackClick} />
      ) : (
        <div>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onMovieClick={onMovieClick} />
          ))}
        </div>
      )}
    </div>
  );
};

return (
    <div>
      {isLoggedIn ? (
        <div>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onMovieClick={onMovieClick} />
          ))}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <LoginView onLogin={handleLogin} /> // Pass the login function as a prop
      )}
    </div>
  );
  
export default MainView;
