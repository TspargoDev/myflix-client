// src/components/MainView/MainView.jsx
import React, { useState } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import MovieView from '../MovieView/MovieView.jsx';

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

<<<<<<< Updated upstream
  const onBackClick = () => {
    setSelectedMovie(null);
  };
=======
    fetch("http://travismovieapi-7207728f28d4.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, [token]);

  //       setMovies(moviesFromApi);
  //     });
  // }, []);

  useEffect(() => {
    setFilteredMovies(
      movies.filter((movie) =>
        movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, movies]);

  if (!user) {
        return (
          <>
            <LoginView onLoggedIn={(user, token) => {
              setUser(user);
              setToken(token);
            }} />
            or
            <SignupView />
          </>
        );
      }

  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  if (movies.length === 0) {
    return (
      <>
        <button
          onClick={() => {
            setUser(null);
          }}
        >
          Logout
        </button>
        <div>The list is empty!</div>
      </>
    );
  }
>>>>>>> Stashed changes

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

export default MainView;
