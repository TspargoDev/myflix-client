// src/components/MainView/MainView.jsx
import React, { useState } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import MovieView from '../MovieView/Movieview.jsx';

const MainView = () => {
  const [movies] = useState([
    { id: 1, title: 'Inception', description: 'A thief who steals corporate secrets ...', director: 'Christopher Nolan', genre: 'Sci-Fi', poster: 'path_to_inception_poster.jpg' },
    { id: 2, title: 'The Matrix', description: 'A computer hacker learns from mysterious rebels ...', director: 'Lana Wachowski, Lilly Wachowski', genre: 'Action', poster: 'path_to_matrix_poster.jpg' },
    { id: 3, title: 'Interstellar', description: 'A team of explorers travel through a wormhole ...', director: 'Christopher Nolan', genre: 'Adventure', poster: 'path_to_interstellar_poster.jpg' }
  ]);
  
  const [selectedMovie, setSelectedMovie] = useState(null);

  const onMovieClick = (movie) => {
    setSelectedMovie(movie);
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
