import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "../../axios.js"; // импорт вашего настроенного axios
import s from "./Video.module.sass";

export default function Video({ moduleId }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [videoId, setVideoId] = useState(null); // храним идентификатор YouTube-видео

  const playerRef = useRef(null);

  // 1. При монтировании/смене moduleId запрашиваем данные модуля
  useEffect(() => {
    if (!moduleId) return;

    const token = localStorage.getItem("access_token");
    axios
      .get(`/module/get_module/${moduleId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Предположим, что на бэкенде поле называется module.link
        const link = res.data?.module?.link;
        console.log(res.data);
        if (link) {
          const extractedId = extractYoutubeId(link);
          setVideoId(extractedId);
        }
      })
      .catch((err) => {
        console.error("Ошибка при получении модуля:", err);
      });
  }, [moduleId]);

  // 2. Функция, которая пытается извлечь videoId из полной ссылки
  const extractYoutubeId = (url) => {
    // Простейший способ: ищем параметр v= из строки
    // Пример ссылки: https://www.youtube.com/watch?v=GeulXZP_kZ8
    const match = url.match(/[?&]v=([^?&]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // Если short-link вида youtu.be/GeulXZP_kZ8
    const shortLink = url.match(/youtu\.be\/([^?&]+)/);
    if (shortLink && shortLink[1]) {
      return shortLink[1];
    }
    // Если ничего не нашли, возвращаем null или пустую строку
    return null;
  };

  // 3. Логика таймера (10 минут) и оверлея
  useEffect(() => {
    let intervalId;

    const checkTime = () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime - startTime >= 600 && !showOverlay) {
          setShowOverlay(true);
          playerRef.current.pauseVideo();
        }
      }
    };

    intervalId = setInterval(checkTime, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [showOverlay, startTime]);

  // Когда плеер готов
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    setStartTime(0);
  };

  const handleStartSession = () => {
    alert("Start session!");
    setShowOverlay(false);
    // ...другие действия
  };

  const handleContinueLearning = () => {
    alert("Continue learning...");
    setShowOverlay(false);
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      setStartTime(currentTime);
      playerRef.current.playVideo();
    }
  };

  // 4. Настройки плеера
  const videoOptions = {
    width: "660",
    height: "400",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className={s.container}>
      {/* Если videoId не найден, можно показать "Loading..." или ничего */}
      {videoId ? (
        <YouTube
          videoId={videoId}
          opts={videoOptions}
          onReady={onPlayerReady}
        />
      ) : (
        <p>Loading video...</p>
      )}

      {showOverlay && (
        <div className={s.overlay}>
          <h2>Do you want to proceed to session 1?</h2>
          <div className={s.buttons}>
            <button onClick={handleStartSession}>Start session</button>
            <button onClick={handleContinueLearning}>Continue learning</button>
          </div>
        </div>
      )}
    </div>
  );
}
