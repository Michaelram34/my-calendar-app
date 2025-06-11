import './App.css';
import Calendar from './Calendar';
import EventManager from './EventManager';
import { Container } from '@mui/material';

function App() {
  return (
    <Container className="App">
      <Calendar />
      <EventManager />
    </Container>
  );
}

export default App;
