import React, { useEffect, useState } from "react";
import s from "./Sessions.module.sass"; // ваш scss-модуль
import axios from "../../axios"; // проверьте корректность пути к axios

export default function Sessions({ moduleId }) {
  const [topics, setTopics] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    if (!moduleId) return;
    const token = localStorage.getItem("access_token");

    // 1) Загружаем сам модуль, чтобы получить ссылку на YouTube
    axios
      .get(`/module/get_module/${moduleId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Предположим, что бэкенд возвращает объект:
        // { module: { link: "https://www.youtube.com/watch?v=xxx", ... } }
        const link = res.data?.module?.link;
        if (link) {
          setYoutubeLink(link);
        }
      })
      .catch((err) => {
        console.error("Ошибка при получении данных модуля:", err);
      });

    // 2) Загружаем топики (сессии)
    axios
      .get(`/topic/get_topics/${moduleId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const allTopics = response.data.topics || [];
        setTopics(allTopics);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке топиков:", err);
      });
  }, [moduleId]);

  // 3) Когда youtubeLink появился, запрашиваем данные о видео через oEmbed
  useEffect(() => {
    if (!youtubeLink) return;

    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      youtubeLink
    )}&format=json`;

    fetch(oEmbedUrl)
      .then((response) => response.json())
      .then((data) => {
        setVideoData(data);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке oEmbed данных:", err);
      });
  }, [youtubeLink]);

  // Если oEmbed ещё не загрузился, показываем заглушку
  if (!videoData) {
    return <p>Loading video details...</p>;
  }

  // Посчитаем общее число топиков
  const totalSessions = topics.length;

  return (
    <div className={s.container}>
      {/* --- Блок с YouTube-превью из oEmbed --- */}

      {/* --- Блок с сессиями (топиками) --- */}
      <p className={s.sessionsTitle}>Sessions</p>
      <div className={s.sessions}>
        {topics.map((topic, index) => (
          <div key={topic.id} className={s.cardContainer}>
            <div className={s.sessionCard}>
              <div className={s.sessionSide}>
                <div className={s.syncIcon}>
                  <img
                    src="/images/iconsModule/refresh.svg"
                    alt="Session Icon"
                  />
                </div>
              </div>
              <div className={s.sessionContent}>
                <div className={s.imageWrapper}>
                  {/* Если у каждого топика тоже есть своя YouTube‑ссылка,
                      можно сделать аналогичный oEmbed-запрос или вставить превью */}
                  <img
                    src={videoData.thumbnail_url}
                    className={s.preview}
                    alt="Video preview"
                  />
                  <div className={s.overlay}>
                    <span className={s.sessionNumber}>{index + 1}</span>
                    <span className={s.sessionTitle}>{topic.name}</span>
                    <div className={s.times}>
                      <p className={s.cardCount}>{totalSessions} cards</p>
                      <div className={s.timeCodes}>
                        <span>--:-- - --:--</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={s.buttons}>
              <button className={s.toCards}>to cards</button>
              <button className={s.toTimeCode}>to time-code</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
