import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = ({ movies, onBackClick }) => {
  const { movieId } = useParams();
  const movieData = movies.find((b) => b._id === movieId);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  if (!movieData) {
    return <div>Movie not found</div>;
  }

  const urlAPI 

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${urlAPI}/movies/${movieId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch movie data");
      }
      
      const movie = await response.json();
      setCurrentMovie(movie);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchMovie();
}, [movieId]); // Re-run the effect if the movieId changes

if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error}</div>;
}

if (!currentMovie) {
  return <div>Movie not found!</div>;
}


  return (
    <>
      {/* Movie Image */}
      <Image src={movieData.ImageUrl} fluid rounded />

      {/* Movie Details */}
      <ListGroup className="my-3">
        <ListGroup.Item>
          <strong>Title:</strong> {movieData.Title}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Description:</strong> {movieData.Description}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Release Date:</strong> {movieData.ReleaseDate}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Cast:</strong> {movieData.Cast.join(', ')} {/* Join the array */}
        </ListGroup.Item>
      </ListGroup>

      {/* Genre Information */}
      {movieData.Genre && (
        <div className="my-4">
          <h5><strong>Genre</strong></h5>
          <ListGroup>
            <ListGroup.Item>
              <strong>Name:</strong> {movieData.Genre.Name}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Description:</strong> {movieData.Genre.Description}
            </ListGroup.Item>
          </ListGroup>
        </div>
      )}

      {/* Director Information */}
      {movieData.Director && (
        <div className="my-4">
          <h5><strong>Director</strong></h5>
          <ListGroup>
            <ListGroup.Item>
              <strong>Director Name:</strong> {movieData.Director.Name}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Description:</strong> {movieData.Director.Description}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Bio:</strong> {movieData.Director.Bio}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Birth Year:</strong> {movieData.Director.BirthYear || 'N/A'}
            </ListGroup.Item>
            {movieData.Director.DeathYear && (
              <ListGroup.Item>
                <strong>Death Year:</strong> {movieData.Director.DeathYear}
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      )}

      {/* Back Button */}
      <Link to={`/`}>
        <Button
          onClick={onBackClick}
          className="back-button"
          style={{ cursor: "pointer" }}
        >
          Back
        </Button>
      </Link>
    </>
  );


export default MovieView;
