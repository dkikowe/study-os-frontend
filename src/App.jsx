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
import Sphere from "./Pages/Sphere/Sphere";

// Компонент для защиты маршрутов
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("access_token");
  return token ? element : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route
            path="/module/:id"
            element={<PrivateRoute element={<Module />} />}
          />
          <Route
            path="/sphere/:id"
            element={<PrivateRoute element={<Sphere />} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
