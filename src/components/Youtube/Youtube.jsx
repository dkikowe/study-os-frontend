import React, { useEffect, useState } from "react";
import axios from "../../axios.js"; // проверьте правильность пути к вашему axios
import s from "./Youtube.module.sass";

export default function Youtube({ moduleId }) {
  const [videoData, setVideoData] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [module, setModule] = useState(null);

  // 1. Получаем данные модуля по moduleId, чтобы извлечь YouTube‑ссылку
  useEffect(() => {
    if (!moduleId) return;

    const token = localStorage.getItem("access_token");
    axios
      .get(`/module/get_module/${moduleId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Предположим, что бэкенд возвращает объект вида:
        // { module: { link: "https://www.youtube.com/watch?v=GeulXZP_kZ8", ... } }
        const link = res.data?.module?.link;
        const result = res.data?.module;
        setModule(result);
        console.log("Полученная ссылка из модуля:", link);
        if (link) {
          setYoutubeLink(link);
        }
      })
      .catch((err) => {
        console.error("Ошибка при получении данных модуля:", err);
      });
  }, [moduleId]);

  // 2. Как только youtubeLink получен, делаем запрос к oEmbed API YouTube
  useEffect(() => {
    if (!youtubeLink) return;
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      youtubeLink
    )}&format=json`;
    fetch(oEmbedUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("oEmbed данные:", data);
        setVideoData(data);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке oEmbed данных:", err);
      });
  }, [youtubeLink]);

  if (!videoData) {
    return <p>Loading video details...</p>;
  }
  const cleanDescription = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*/g, "") // убираем **
      .replace(/^Brief Overview:\s*/i, ""); // убираем "Brief Overview:"
  };

  return (
    <div className={s.container}>
      <img
        src={videoData.thumbnail_url}
        className={s.preview}
        alt="Video preview"
      />
      <div className={s.textContainer}>
        <div className={s.title}>
          <p className={s.titleHead}>{videoData.title}</p>
          <div className={s.icons}>
            <img
              src="/images/iconsModule/edit.svg"
              width={22}
              height={22}
              alt="edit"
            />
            <img src="/images/iconsModule/settings.svg" alt="settings" />
          </div>
        </div>
        <div className={s.titleDesc}>
          {/* oEmbed не возвращает описание и длительность, можно указать заглушки */}
          <p className={s.textDesc}>
            {module?.description
              ? cleanDescription(module.description)
              : "desc"}
          </p>
          <p className={s.time}>00:00</p>
        </div>
      </div>
      <div className={s.youtubeLink}>
        <a
          href={youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <p className={s.linkText}>to Youtube</p>
        </a>
      </div>
    </div>
  );
}
