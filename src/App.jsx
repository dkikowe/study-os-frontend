import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth/Auth";
import Home from "./Pages/Home/Home";

function App() {
  return (
    <Router>
      <div
        className="App"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f5f5f5"
        }}
      >
        <Routes>
          <Route path="" element={<Navigate to="/auth" />}></Route>
          <Route path="/auth" element={<Auth />}></Route>
          <Route path="/home" element={<Home />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
