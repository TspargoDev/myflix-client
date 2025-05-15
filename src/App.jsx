import React from 'react';
import { Container } from 'react-bootstrap';
import MainView from './components/MainView/MainView';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

function App() {
  return (
    <Container>
      <MainView />
    </Container>
  );
}

export default App;
