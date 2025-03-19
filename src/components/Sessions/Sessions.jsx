import React, { useEffect, useState } from "react";
import s from "./Sessions.module.sass";
import axios from "../../axios"; // проверьте правильность пути к axios

export default function Sessions({ moduleId }) {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (!moduleId) return;
    const token = localStorage.getItem("access_token");
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

  // Общее количество сессий равно количеству топиков
  const totalSessions = topics.length;

  return (
    <div className={s.container}>
      <p className={s.sessionsTitle}>Sessions</p>
      <div className={s.sessions}>
        {topics.map((topic, index) => (
          <div key={topic.id} className={s.cardContainer}>
            <div className={s.sessionCard}>
              <div className={s.sessionSide}>
                <div className={s.syncIcon}>
                  {/* Здесь можно задать иконку для сессии */}
                  <img
                    src="/images/iconsModule/refresh.svg"
                    alt="Session Icon"
                  />
                </div>
              </div>
              <div className={s.sessionContent}>
                <div className={s.imageWrapper}>
                  {/* Превью можно оставить статичным или заменить на динамический, если потребуется */}
                  <img
                    src="/images/iconsModule/youtubePreview.svg"
                    alt="Session Preview"
                    className={s.sessionImage}
                  />
                  <div className={s.overlay}>
                    <span className={s.sessionNumber}>{index + 1}</span>
                    {/* Используем topic.name из API вместо заглушки */}
                    <span className={s.sessionTitle}>{topic.name}</span>
                    <div className={s.times}>
                      {/* Количество карточек или сессий — общее число топиков */}
                      <p className={s.cardCount}>{totalSessions} cards</p>
                      <div className={s.timeCodes}>
                        {/* Если у топика нет данных по времени, можно оставить заглушку */}
                        <span>--:-- - --:--</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div key={topic.id} className={s.buttons}>
              <button className={s.toCards}>to cards</button>
              <button className={s.toTimeCode}>to time-code</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
