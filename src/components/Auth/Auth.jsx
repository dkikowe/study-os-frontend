import React, { useState } from "react";
import "./Auth.css";
import Loading from "../Loading/Loading";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/login" : "/auth/register";
      const data = isRegister
        ? { email, password }
        : { email, password, confirm_password: confirmPassword };

      const response = await axios.post(endpoint, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // чтобы куки обрабатывались корректно
      });

      if (response.status === 200 && isRegister) {
        // Сервер должен вернуть access token и refresh token
        const { access_token, refresh_token } = response.data;

        // Сохраняем токены в localStorage
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        setError("");

        navigate("/home"); // редирект после успешного входа
      }
      if (response.status === 200 && !isRegister) {
        setLoading(false);
        setMessage("Successfully registered, now you can log in");
        console.log(response.data);
      }
    } catch (error) {
      console.error("❌ Ошибка авторизации:", error);

      const detail = error.response?.data?.detail;

      setLoading(false);

      setError(
        Array.isArray(detail)
          ? detail[0].msg // Если массив, берем первый элемент
          : typeof detail.msg === "object"
          ? JSON.stringify(detail.msg) // Если объект, превращаем в строку
          : detail.msg || "Ошибка входа, попробуйте снова."
      );
    }
  };

  const handleLogout = () => {
    // Удаляем токены из localStorage при выходе
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/auth"); // редирект на страницу авторизации
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setConfirmPassword("");
    setEmail("");
    setError("");
    setPassword("");
    setMessage("");
  };

  return (
    <div className="body" id="body1">
      <div className={`container ${!isRegister ? "active" : ""}`}>
        <div className="content">
          <div className="right">
            <h1 className={isRegister ? "title" : "titleReg"}>
              Study<span>OS</span>
            </h1>
            <input
              className={error ? "inputErr" : "input1"}
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={error ? "inputErr" : "input2"}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isRegister && (
              <input
                className={error ? "inputErr" : "input2"}
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
            <p className={`error ${error ? "show" : ""}`}>{error || " "}</p>
            <p className={`success ${message ? "show1" : ""}`}>
              {message || " "}
            </p>
            <button className="signIn" onClick={handleAuth}>
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
            <button className="signUp" onClick={toggleMode}>
              {isRegister ? "Sign Up" : "Sign In"}
            </button>
          </div>

          <div className="left">
            <img
              src={
                isRegister
                  ? "/images/icons/brainLogin.svg"
                  : "/images/icons/brainRegister.svg"
              }
              alt="Auth Icon"
            />
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </div>
  );
}
