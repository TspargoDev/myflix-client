import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = ({ movies, onBackClick }) => {
  const { movieId } = useParams();
  const movieData = movies.find((b) => b._id === movieId);

  if (!movieData) {
    return <div>Movie not found</div>;
  }

  return (
    <>
      <Image src={movieData.ImageUrl} fluid rounded />

      <ListGroup>
        <ListGroup.Item>
          <strong>Title:</strong> {movieData.Title}
        </ListGroup.Item>
      </ListGroup>

      <ListGroup>
        <ListGroup.Item>
          <strong>Description:</strong> {movieData.Description}
        </ListGroup.Item>
      </ListGroup>

      <ListGroup>
        <ListGroup.Item>
          <strong>ReleaseDate:</strong> {movieData.ReleaseDate}
        </ListGroup.Item>
      </ListGroup>

      <ListGroup>
        <ListGroup.Item>
          <strong>Cast:</strong> {movieData.Cast}
        </ListGroup.Item>
      </ListGroup>

      <div>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title >
              <strong className="nav">Genre</strong>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ListGroup>
              <ListGroup.Item>
                <strong>Name: </strong> {movieData.Genre.Name}
              </ListGroup.Item>
            </ListGroup>

            <ListGroup>
              <ListGroup.Item>
                <strong>Description: </strong> {movieData.Genre.Description}
              </ListGroup.Item>
            </ListGroup>
          </Modal.Body>
        </Modal.Dialog>
      </div>

      <div>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title >
              <strong className="nav">Director</strong>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ListGroup>
              <ListGroup.Item>
                <strong>Director Name: </strong> {movieData.Director.Name}
              </ListGroup.Item>
            </ListGroup>

            <ListGroup>
              <ListGroup.Item>
                <strong>Description: </strong> {movieData.Genre.Description}
              </ListGroup.Item>
            </ListGroup>

            <ListGroup>
              <ListGroup.Item>
                <strong>Bio: </strong> {movieData.Director.Bio}
              </ListGroup.Item>
            </ListGroup>

            <ListGroup>
              <ListGroup.Item>
                <strong>BirthYear:</strong> {movieData.Director.BirthYear}
              </ListGroup.Item>
            </ListGroup>

            <ListGroup>
              <ListGroup.Item>
                <strong>DeathYear:</strong> {movieData.Director.DeathYear}
              </ListGroup.Item>
            </ListGroup>
          </Modal.Body>
        </Modal.Dialog>
      </div>
      <Link to={`/`}>
        <Button
          onClick={onBackClick}
          className="back-button"
          // variant="info"
          style={{ cursor: "pointer" }}
        >
          Back
        </Button>
      </Link>
    </>
  );
};