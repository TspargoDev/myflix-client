import './movie-view.scss';

export const MovieView = ({ movie, onBackClick }) => {
  console.log(movie)
    return (
      <div>
        <div>
          <img src={movie.imageURL} />
        </div>
        <div>
          <span>Title: </span>
          <span>{movie.title}</span>
        </div>
        <div>
            <span>Genre: </span>
            <span>{movie.genre.name}</span>
        </div>
        <div>
            <span>Description: </span>
            <span>{movie.description}</span>
        </div>
        <div>
          <span>Director: </span>
          <span>{movie.director}</span>
        </div>
        <button onClick= {onBackClick}>Back</button>

        <button 
      onClick={onBackClick} 
      className="back-button"
      style={{ cursor: "pointer" }}
    >

      Back
    </button>
      </div>
    );
  };
export default MovieCard;
