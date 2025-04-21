import React, { useEffect, useState } from "react";
import s from "./Sessions.module.sass";
import axios from "../../axios";
import { Link } from "react-router-dom";

export default function Sessions({ moduleId, onSelectTopic, changeTab }) {
  const [topics, setTopics] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    if (!moduleId) return;
    const token = localStorage.getItem("access_token");

    // 1) Загружаем модуль, чтобы получить ссылку на YouTube
    axios
      .get(`/module/get_module/${moduleId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
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
      .then(async (response) => {
        const allTopics = response.data.topics || [];
        console.log(allTopics);
        const cardCountPromises = allTopics.map((topic) =>
          axios
            .get(`/card/get_cards/${topic.id}`, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((resp) => resp.data.cards?.length || 0)
            .catch(() => 0)
        );
        const cardCounts = await Promise.all(cardCountPromises);
        const topicsWithCounts = allTopics.map((topic, index) => ({
          ...topic,
          cardCount: cardCounts[index],
        }));
        console.log(topicsWithCounts);
        setTopics(topicsWithCounts);
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

  if (!videoData) {
    return <p>Loading video details...</p>;
  }

  return (
    <div className={s.container}>
      <p className={s.sessionsTitle}>Sessions</p>
      <div className={s.sessions}>
        {topics.map((topic, index) => (
          <div key={topic.id} className={s.cardContainer}>
            <div className={s.sessionCard}>
              <div className={s.sessionSide}>
                <Link to={`/session/${moduleId}/${topic.id}/${index + 1}`}>
                  <div className={s.syncIcon}>
                    <img
                      src="/images/iconsModule/refresh.svg"
                      alt="Session Icon"
                    />
                  </div>
                </Link>
              </div>
              <div className={s.sessionContent}>
                <div className={s.imageWrapper}>
                  <img
                    src={videoData.thumbnail_url}
                    className={s.preview}
                    alt="Video preview"
                  />
                  <div className={s.overlay}>
                    <span className={s.sessionNumber}>{index + 1}</span>
                    <span className={s.sessionTitle}>{topic.name}</span>
                    <div className={s.times}>
                      <p className={s.cardCount}>{topic.cardCount} cards</p>
                      <div className={s.timeCodes}>
                        <span>--:-- - --:--</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={s.buttons}>
              {/* При клике вызываем колбэк для смены таба и выбора топика */}
              <button
                className={s.toCards}
                onClick={() => {
                  onSelectTopic && onSelectTopic(topic);
                  changeTab && changeTab("cards");
                }}
              >
                to cards
              </button>
              <button className={s.toTimeCode}>to time-code</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
