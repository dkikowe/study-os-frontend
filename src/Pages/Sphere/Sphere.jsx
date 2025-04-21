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
              </div>
            </div>
            <img src="/images/sphere-icons/Repeat.svg" alt="" />
          </div>
        </div>
        <Courses sphereId={sphere?.sphere?.id} />
      </div>
      <div className={s.mobileVersion}>
        <div className={s.headerResponsive}>
          <img src="/images/iconsModule/back.svg" alt="back" />
          <p className={s.studyOs}>
            Study<span>OS</span>
          </p>
          <img src="/images/iconsModule/iconsMobile.svg" alt="menu" />
        </div>
        <h4 className={s.sphereTitle}>
          {sphere ? sphere.sphere.name : "Loading..."} | <span> Sphere</span>
        </h4>
        <p className={s.description}>
          {sphere?.description ||
            "English is a West Germanic language in the Indo‑European language family, whose…"}
          <button className={s.more}>more…</button>
        </p>

        <div className={s.topGrid}>
          <img
            className={s.continueImg}
            src="/images/sphere-icons/contMobile.svg"
            alt=""
          />

          <div className={s.sideColumn}>
            <div className={s.createCard}>
              <img src="/images/sphere-icons/X.svg" alt="+" />
              <div className={s.createButtons}>
                <p>course</p>
                <p>module</p>
              </div>
            </div>

            <img
              width={108}
              height={105}
              src="/images/sphere-icons/Repeat.svg"
              alt="repeat"
            />
          </div>
        </div>

        <Courses sphereId={sphere?.sphere?.id} />
      </div>
    </div>
  );
}
