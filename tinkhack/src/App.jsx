import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/login";
import Help from "./components/help";  // ✅ Fixed import path

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Login</Link></li>
          <li><Link to="/Help">Help</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Help" element={<Help />} />
      </Routes>
    </div>
  );
}

export default App;
