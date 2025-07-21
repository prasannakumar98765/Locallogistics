import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminTracker from './common/Tracker';
import ExecutiveTracker from './common/ExecutiveTracker';
import SimulateLocation from './common/SimulateLocation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminTracker />} />
        <Route path="/executive" element={<ExecutiveTracker />} />
        <Route path="/simulate" element={<SimulateLocation />} />
      </Routes>
    </Router>
  );
}

export default App;
