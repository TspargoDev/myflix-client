import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useSelector } from "react-redux";

export const NavigationBar = ({ onLoggedOut }) => {
  const user = useSelector((state) => state.user.user);

  return (
    <Navbar bg="light" expand="lg" className="pb-5 fixed-top">
      <Container>
        <Navbar.Brand href="/" className="d-md-flex align-items-center fw-bold fs-2">
          myFlix
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="gap-3">
            {/* Home Link */}
            <Nav.Item>
              <Nav.Link href="/" className="fs-5">
                Home
              </Nav.Link>
            </Nav.Item>

            {/* Signup Link */}
            <Nav.Item>
              <Nav.Link href="/signup" className="m-3">
                Signup
              </Nav.Link>
            </Nav.Item>

            {/* Conditional Login/Logout Link */}
            <Nav.Item>
              {user ? (
                <Nav.Link onClick={onLoggedOut} className="m-3">
                  Logout
                </Nav.Link>
              ) : (
                <Nav.Link href="/login" className="m-3">
                  Login
                </Nav.Link>
              )}
            </Nav.Item>

            {/* Profile Link */}
            <Nav.Item>
              <Nav.Link href="/profile" className="m-3">
                Profile
              </Nav.Link>
            </Nav.Item>

            {/* Signed-in User Display */}
            <Nav.Item>
              <div className="bg-primary m-3 px-4 text-white d-flex align-items-center rounded-3 gap-2">
                <span className="text-white fs-5">
                  Signed in as: {user ? user.Username : "Guest"}
                </span>
              </div>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
