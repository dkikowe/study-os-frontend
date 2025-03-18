import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios.js";
import s from "./Sphere.module.sass";
import Nav from "../../components/Nav/Nav";
import Header from "../../components/Header/Header";
import Courses from "../../components/Courses/Courses";

export default function Sphere() {
  const [sphere, setSphere] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get(`/sphere/get_sphere/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSphere(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении сферы:", error);
      });
  }, [id]);

  return (
    <div className={s.container}>
      <Nav />
      <Header />
      <div className={s.desktopVersion}>
        <div className={s.title}>
          <div className={s.titleText}>
            <div className={s.text}>
              <h4 className={s.titleHead}>
                {/* Если сфера загружена, показываем её название; иначе - "Loading..." */}
                {sphere ? sphere.sphere.name : "Loading..."} |{" "}
                <span>Sphere</span>
              </h4>
              <div className={s.icons}>
                <img
                  src="/images/iconsModule/edit.svg"
                  width={22}
                  height={22}
                  alt=""
                />
                <img src="/images/iconsModule/settings.svg" alt="" />
              </div>
            </div>
          </div>
          <div className={s.titleDesc}>
            <p className={s.desc}>
              {/* Можно также вывести описание, если оно есть */}
              {sphere?.description ||
                "This module combines vocabulary building, grammar practice, and cultural insights..."}
            </p>
          </div>
        </div>
        <div className={s.recent}>
          <div className={s.recentCard}>
            <img src="/images/sphere-icons/continue.svg" alt="" />
          </div>
          <div className={s.repeat}>
            <div className={s.createContainer}>
              <img src="/images/sphere-icons/X.svg" alt="" />
              <div className={s.buttons}>
                <p className={s.button}>course</p>
                <p className={s.button}>module</p>
                <p className={s.button}>sphere</p>
              </div>
            </div>
            <img src="/images/sphere-icons/Repeat.svg" alt="" />
          </div>
        </div>
        <Courses sphereId={sphere?.sphere?.id} />
      </div>
    </div>
  );
}
