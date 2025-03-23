import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/login";
import Help from "./components/help";  // ✅ Fixed import path
import Community from "./components/CommunityPage";
function App() {
  return (
    <div>
    

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/Community" element={<Community />} />
      </Routes>
    </div>
  );
}

export default App;
