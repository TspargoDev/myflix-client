import PropTypes from "prop-types";
import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  return (
    // Main navigation bar component using React Bootstrap's Navbar
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Brand logo/link redirects to home */}
        <Navbar.Brand as={Link} to="/">
          MyFlixDB
        </Navbar.Brand>

        {/* Toggle button for responsive collapse */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Collapsible navigation links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Show Login and Signup links when no user is logged in */}
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}

            {/* Show Movies, Profile, and Log Out links when user is logged in */}
            {user && (
              <>
                <Nav.Link as={Link} to="/">
                  Movies
                </Nav.Link>

                {/* Link to user profile */}
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>

                {/* Log Out link triggers onLoggedOut callback and redirects home */}
                <Nav.Link as={Link} to="/" onClick={onLoggedOut}>
                  Log Out
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// PropTypes for type checking props passed into NavigationBar component
NavigationBar.propTypes = {
  user: PropTypes.oneOfType([
    // If user is logged in, validate user object shape with required _id
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    // Allow null when no user is logged in
    PropTypes.oneOf([null]),
  ]),
  onLoggedOut: PropTypes.func.isRequired, // Must be a function for logout handling
};

export default NavigationBar;
