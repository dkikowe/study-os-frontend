import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Home.module.sass";
import Nav from "../../components/Nav/Nav";
import Header from "../../components/Header/Header";
import Greeting from "../../components/Greeting/Greeting";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, есть ли токен в localStorage
    const token = localStorage.getItem("access_token");
    if (!token) {
      // Если токена нет, значит пользователь не авторизован — уходим на /auth
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <div className="body">
      <Nav />
      <Header />
      <Greeting />
    </div>
  );
}
