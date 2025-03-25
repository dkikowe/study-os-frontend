import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import s from "./Session.module.sass";
import axios from "../../axios";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import Loading from "../../components/Loading/Loading";

// Функция для выбора иконки по статусу (для десктопа)
function getIconByStatus(status) {
  if (status === "answered") {
    return "/images/session-icons/correct.svg";
  } else if (status === "incorrect") {
    return "/images/session-icons/incorrect.svg";
  } else {
    return "/images/session-icons/notAnswered.svg";
  }
}

export default function Session() {
  const { moduleId, topicId, sessionNumber } = useParams();

  const [topicName, setTopicName] = useState("");
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [videoData, setVideoData] = useState(null);

  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Статусы карточек: не трогаем их после refresh
  const [cardStatuses, setCardStatuses] = useState([]);

  // ===================== A. Загрузка топика по topicId =====================
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`/topic/get_topic/${topicId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.topic) {
          setTopicName(response.data.topic.name);
        }
      } catch (error) {
        console.error("Ошибка при загрузке топика:", error);
      }
    };

    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  // ===================== B. Загрузка модуля для YouTube-ссылки =====================
  useEffect(() => {
    const fetchModule = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`/module/get_module/${moduleId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const link = response.data?.module?.link;
        if (link) {
          setYoutubeLink(link);
        }
      } catch (error) {
        console.error("Ошибка при получении данных модуля:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  // ===================== C. Загрузка oEmbed данных для YouTube-превью =====================
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

  // ===================== D. Загрузка карточек по выбранному топику =====================
  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`/card/get_cards/${topicId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      const cardsData = response.data.cards || [];
      setCards(cardsData);
      setCurrentCardIndex(0);
      // Инициализируем статусы "notAnswered" для каждой карточки
      setCardStatuses(Array(cardsData.length).fill("notAnswered"));
    } catch (error) {
      console.error("Ошибка при загрузке карточек:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      fetchCards();
    }
  }, [topicId]);

  // Обновление карточек (без сброса статусов)
  const refreshCards = async () => {
    try {
      const currentCard = cards[currentCardIndex];
      if (!currentCard) return;

      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `/card/get_card/${currentCard.info.card_id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const cardsData = response.data.cards || [];
      // Если текущий индекс выходит за границы, сбрасываем его на 0
      if (cardsData.length <= currentCardIndex) {
        setCurrentCardIndex(0);
      }
    } catch (error) {
      console.error("Ошибка при обновлении карточек:", error);
    }
  };

  // ===================== E. Навигация по карточкам =====================
  const handlePrevCard = () => {
    setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setUserAnswer("");
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
    setUserAnswer("");
  };

  const handleCardIndexClick = (index) => {
    setCurrentCardIndex(index);
    setUserAnswer("");
  };

  // ===================== F. Проверка ответа =====================
  const handleCheckAnswer = async () => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;

    try {
      setIsChecking(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `/card/review_card/${currentCard.id}?user_answer=${encodeURIComponent(
          userAnswer
        )}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { rating } = response.data;

      setCardStatuses((prevStatuses) => {
        const newStatuses = [...prevStatuses];
        newStatuses[currentCardIndex] = rating >= 3 ? "answered" : "incorrect";
        return newStatuses;
      });
    } catch (error) {
      console.error("Ошибка при проверке ответа:", error);
      alert("Ошибка при проверке ответа");
    } finally {
      setIsChecking(false);
      // После проверки обновляем карточки
      refreshCards();
    }
  };

  if (isLoading) {
    return (
      <div className={s.container}>
        <Nav />
        <Header />
        <Loading />
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className={s.container}>
      <Nav />
      <Header />

      {/* Десктопная версия: тут оставляем картинки */}
      <div className={s.dekstopVersion}>
        <div className={s.title}>
          <div className={s.titleText}>
            <div className={s.text}>
              <h4 className={s.titleHead}>
                {topicName
                  ? topicName.length > 2
                    ? topicName.slice(2)
                    : topicName
                  : "Неизвестно"}{" "}
                | <span>Session: {sessionNumber}</span>
              </h4>
            </div>
          </div>
        </div>

        <div className={s.sessionContainer}>
          {cards.length > 0 && currentCard ? (
            <>
              <div className={s.statusRow}>
                <div className={s.row}>
                  {cardStatuses.map((status, i) => (
                    <img
                      key={i}
                      src={getIconByStatus(status)}
                      alt={status}
                      className={s.statusIcon}
                      onClick={() => handleCardIndexClick(i)}
                    />
                  ))}
                </div>
                <span className={s.statusText}>
                  {currentCardIndex + 1}/{cards.length}
                </span>
              </div>
              <p className={s.cardText}>Card {currentCardIndex + 1}</p>

              <svg
                width="968"
                height="2"
                viewBox="0 0 968 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1H967"
                  stroke="#E5E5E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {videoData && (
                <div className={s.videoPreview}>
                  <img
                    src={videoData.thumbnail_url}
                    alt={videoData.title}
                    className={s.preview}
                  />
                </div>
              )}

              <div className={s.card}>
                <div className={s.question}>
                  <h3>Question:</h3>
                  <p>{currentCard.front_card}</p>
                </div>

                <div className={s.answerBlock}>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Answer..."
                  />
                  <div className={s.buttons}>
                    {isChecking ? (
                      <Loading />
                    ) : (
                      <div
                        className={s.checkButton}
                        onClick={handleCheckAnswer}
                      >
                        <svg
                          width="34"
                          height="34"
                          viewBox="0 0 34 34"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M32 2V4.625C32 10.9256 32 14.0759 30.7738 16.4824C29.6952 18.5992 27.9742 20.3202 25.8574 21.3988C23.4509 22.625 20.3006 22.625 14 22.625H2M2 22.625L11.375 13.25M2 22.625L11.375 32"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <img
                      src="/images/session-icons/next.svg"
                      alt="Next"
                      onClick={handleNextCard}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Карточек нет</p>
          )}
        </div>
        <img src="/images/session-icons/AIchat.svg" className={s.ai} alt="" />
      </div>

      {/* Мобильная версия: здесь делаем div-блоки с цветом */}
      <div className={s.mobileContainer}>
        <div className={s.headerResponsive}>
          <img src="/images/iconsModule/back.svg" alt="" />
          <p className={s.studyOs}>
            Study <span>OS</span>
          </p>
          <img
            src="/images/iconsModule/iconsMobile.svg"
            className={s.icons}
            alt=""
          />
        </div>
        <div className={s.mobileStatusRow}>
          <div className={s.mobileRow}>
            {cardStatuses.map((status, i) => {
              // Определяем класс в зависимости от статуса
              let statusClass = "";
              if (status === "answered") statusClass = s.correct; // Зелёный
              else if (status === "incorrect")
                statusClass = s.incorrect; // Красный
              else statusClass = s.notAnswered; // Серый

              return (
                <div
                  key={i}
                  className={`${s.mobileStatusBox} ${statusClass}`}
                  onClick={() => handleCardIndexClick(i)}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
        <hr />
        <div className={s.mobileTitle}>
          <div className={s.mobileTitleText}>
            <div className={s.mobileText}>
              <h4 className={s.mobileTitleHead}>
                {topicName
                  ? topicName.length > 2
                    ? topicName.slice(2)
                    : topicName
                  : "Неизвестно"}{" "}
                | <span>Session: {sessionNumber}</span>
              </h4>
            </div>
          </div>
        </div>

        <div className={s.mobileSessionContainer}>
          {cards.length > 0 && currentCard ? (
            <>
              <p className={s.mobileCardText}>Card {currentCardIndex + 1}</p>

              <svg
                width="968"
                height="2"
                viewBox="0 0 968 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={s.mobileSvgLine}
              >
                <path
                  d="M1 1H967"
                  stroke="#E5E5E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {videoData && (
                <div className={s.mobileVideoPreview}>
                  <img
                    src={videoData.thumbnail_url}
                    alt={videoData.title}
                    className={s.mobilePreview}
                  />
                </div>
              )}

              <div className={s.mobileCard}>
                <div className={s.mobileQuestion}>
                  <h3>Question:</h3>
                  <p>{currentCard.front_card}</p>
                </div>

                <div className={s.mobileAnswerBlock}>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Answer..."
                    className={s.mobileTextarea}
                  />
                  <div className={s.mobileButtons}>
                    {isChecking ? (
                      <Loading />
                    ) : (
                      <div
                        className={s.mobileCheckButton}
                        onClick={handleCheckAnswer}
                      >
                        <svg
                          width="34"
                          height="34"
                          viewBox="0 0 34 34"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M32 2V4.625C32 10.9256 32 14.0759 30.7738 16.4824C29.6952 18.5992 27.9742 20.3202 25.8574 21.3988C23.4509 22.625 20.3006 22.625 14 22.625H2M2 22.625L11.375 13.25M2 22.625L11.375 32"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <img
                      src="/images/session-icons/next.svg"
                      alt="Next"
                      className={s.mobileNextButton}
                      onClick={handleNextCard}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Карточек нет</p>
          )}
        </div>
      </div>
    </div>
  );
}
