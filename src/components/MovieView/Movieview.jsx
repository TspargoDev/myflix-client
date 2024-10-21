import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import './movie-view.scss';

export const MovieView = ({ movies }) => {
  const {movieId } = useParams();

  const movie = movie.find((m) => m.id === movieId);

    return (
      <div>
        <div>
          <img className="w-100" src={movie.ImageUrl} />
        </div>
        <div>
          <span>Title: </span>
          <span>{movie.Title}</span>
        </div>
        <div>
          <span>Director: </span>
          <span>{movie.Director}</span>
        </div>
        <div>
          <span>Genre: </span>
          <span>{movie.Genre}</span>
        </div>
        <Link to={`/`}>
        <button
        className="back-button"
        style={{cursor: "pointer"}}
        >Back</button>
        </Link>
      </div>
    );
  };