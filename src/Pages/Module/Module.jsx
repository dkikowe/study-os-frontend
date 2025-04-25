import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import s from "./Module.module.sass";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import Youtube from "../../components/Youtube/Youtube";
import Sessions from "../../components/Sessions/Sessions";
import Video from "../../components/Video/Video";
import Cards from "../../components/Cards/Cards";
import { Play, Book } from "lucide-react";
import VideoMobile from "../../components/Video/VideoMobile";
import axios from "../../axios";

export default function Module() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [module, setModule] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const sphereId = location.state?.sphereId;

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("access_token");

    // Получаем модуль и youtube-ссылку
    axios
      .get(`/module/get_module/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const module = res.data.module;
        console.log(module);
        setModule(module);
      })
      .catch((err) => {
        console.error("Ошибка при получении модуля:", err);
      });

    // Загружаем топики (сессии)
  }, [id]);

  const getBackPath = () => {
    const path = location.pathname;

    if (path.startsWith("/module")) {
      return `/sphere/${sphereId}`; // предполагаем, что sphereId == moduleId (или адаптируй под свою логику)
    }

    return "/home";
  };

  const cleanDescription = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*/g, "") // убираем **
      .replace(/^Brief Overview:\s*/i, ""); // убираем "Brief Overview:"
  };

  return (
    <div className={s.container}>
      <Nav />
      <Header />

      {/* Десктопная версия */}
      <div className={s.desktopVersion}>
        <div className={s.title}>
          <div className={s.titleText}>
            <div className={s.text}>
              <h4 className={s.titleHead}>
                {module?.name ? module?.name : "name"}
              </h4>
              <div className={s.icons}>
                <img src="/images/iconsModule/dotpoints.svg" alt="" />
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
              {module?.description
                ? cleanDescription(module.description)
                : "desc"}
            </p>
          </div>
          <Youtube moduleId={id} />
          <div className={s.sessions}>
            <Sessions
              moduleId={id}
              onSelectTopic={setSelectedTopic}
              changeTab={setActiveTab}
            />
            <Video moduleId={id} />
            <Cards moduleId={id} selectedTopic={selectedTopic} />
          </div>
        </div>
      </div>

      {/* Мобильная версия с табами */}
      <div className={s.mobileVersion}>
        <div className={s.headerResponsive}>
          <img
            src="/images/iconsModule/back.svg"
            alt="back"
            onClick={() => navigate(getBackPath())}
          />
          <p className={s.studyOs}>
            Study <span>OS</span>
          </p>
          <img
            src="/images/iconsModule/iconsMobile.svg"
            className={s.icons}
            alt="menu"
          />
        </div>
        <hr />
        <div className={s.mobileTabs}>
          <button
            className={activeTab === "sessions" ? s.activeTab : s.sessionButton}
            onClick={() => setActiveTab("sessions")}
          >
            <Play size={30} />
            Sessions
          </button>
          <button
            className={activeTab === "study" ? s.activeTab : s.studyButton}
            onClick={() => setActiveTab("study")}
          >
            <Book size={30} />
            Study
          </button>
          <button
            className={activeTab === "cards" ? s.activeTabCards : s.cardsButton}
            onClick={() => setActiveTab("cards")}
          >
            <img
              src={
                activeTab === "cards"
                  ? "/images/iconsModule/cardActive.svg"
                  : "/images/iconsModule/cards.svg"
              }
              alt=""
            />
            Cards
          </button>
        </div>
        <div className={s.titleMobile}>
          <div className={s.titleTextMobile}>
            <div className={s.textMobile}>
              <h4 className={s.titleHeadMobile}>{module?.name}</h4>
            </div>
          </div>
          <div className={s.titleDescMobile}>
            <p className={s.descMobile}>
              {module?.description
                ? cleanDescription(module.description)
                : "desc"}
            </p>
          </div>
        </div>

        <div className={s.tabContent}>
          {activeTab === "sessions" && (
            <Sessions
              moduleId={id}
              onSelectTopic={setSelectedTopic}
              changeTab={setActiveTab}
            />
          )}
          {activeTab === "study" && <VideoMobile moduleId={id} />}
          {activeTab === "cards" && (
            <Cards moduleId={id} selectedTopic={selectedTopic} />
          )}
        </div>
      </div>
    </div>
  );
}
