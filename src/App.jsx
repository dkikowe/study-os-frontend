import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth/Auth";
import Home from "./Pages/Home/Home";
import Module from "./Pages/Module/Module";

function App() {
  return (
    <Router>
      <div className="App" style={{}}>
        <Routes>
          <Route path="" element={<Navigate to="/auth" />}></Route>
          <Route path="/auth" element={<Auth />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/module" element={<Module />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
