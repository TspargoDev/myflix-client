import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container } from 'react-bootstrap';
import './App.scss';
import MainView from './components/MainView/MainView';

function App() {
  return (
    <Container>
      <MainView />
    </Container>
  );
}

export default App;
