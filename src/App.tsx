import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './Components/Lobby';
import Room from './Components/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
        {/* inny routing */}
      </Routes>
    </Router>
  );
}

export default App;