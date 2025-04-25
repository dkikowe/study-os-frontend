import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import s from "./Session.module.sass";
import axios from "../../axios";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import Loading from "../../components/Loading/Loading";
import Aichat from "../../components/Aichat/Aichat";

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
  const navigate = useNavigate();
  const { moduleId, topicId, sessionNumber } = useParams();

  const [topicName, setTopicName] = useState("");
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [videoData, setVideoData] = useState(null);

  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const [cardStatuses, setCardStatuses] = useState([]);
  const [showAiChat, setShowAiChat] = useState(false);

  /**
   * reviewData хранит информацию о результате проверки.
   * Пока null – пользователь не нажал "Check" или переключился на другую карточку.
   */
  const [reviewData, setReviewData] = useState(null);

  // ===================== A. Загрузка топика =====================
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`/topic/get_topic/${topicId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.topic) {
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

  // ===================== B. Загрузка модуля (YouTube-ссылка) =====================
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

  // ===================== C. Загрузка превью YouTube (oEmbed) =====================
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
        console.error("Ошибка при загрузке oEmbed:", err);
      });
  }, [youtubeLink]);

  // ===================== D. Загрузка карточек =====================
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

  // ===================== Обновление карточек =====================
  const refreshCards = async () => {
    try {
      const currentCard = cards[currentCardIndex];
      if (!currentCard) return;
      const token = localStorage.getItem("access_token");
      await axios.get(`/card/get_card/${currentCard.id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (currentCardIndex >= cards.length) {
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
    setReviewData(null);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
    setUserAnswer("");
    setReviewData(null);
  };

  const handleCardIndexClick = (index) => {
    setCurrentCardIndex(index);
    setUserAnswer("");
    setReviewData(null);
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
      console.log(response.data);

      // Заглушки для случая, если сервер возвращает другие поля
      const rating = response.data?.rating ?? 1;
      const mastery = response.data?.mastery ?? 50;
      const correctness = response.data?.correctness ?? "You are right";
      const correctDetails =
        response.data?.correctDetails ??
        "You correctly noted that the man's name is Tom.";
      const improvement =
        response.data?.improvement ?? "You didn't say that he comes for money.";
      const moreInfo = response.data?.expand;

      setCardStatuses((prevStatuses) => {
        const newStatuses = [...prevStatuses];
        newStatuses[currentCardIndex] = rating >= 3 ? "answered" : "incorrect";
        return newStatuses;
      });

      setReviewData({
        rating,
        mastery,
        correctness,
        correctDetails,
        improvement,
        moreInfo,
      });

      refreshCards();
    } catch (error) {
      console.error("Ошибка при проверке ответа:", error);
      alert("Ошибка при проверке ответа");
    } finally {
      setIsChecking(false);
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

      {/* --- Десктопная версия --- */}
      <div className={s.dekstopVersion}>
        <div className={s.title}>
          <div className={s.titleText}>
            <div className={s.text}>
              <h4 className={s.titleHead}>
                {topicName ? topicName : "Неизвестно"}|{" "}
                <span>Session: {sessionNumber}</span>
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
                width="868"
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

                {!reviewData ? (
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
                          className={userAnswer ? s.entered : s.checkButton}
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
                ) : (
                  <div className={s.reviewBlock}>
                    <div className={s.reviewAnswer}>
                      <p className={s.answer}>Answer :</p>
                      <p className={s.answerText}>{userAnswer}</p>
                      <svg
                        width="868"
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
                    </div>
                    <div className={s.masteryReport}>
                      <p>
                        Study<span>OS</span> mastery report:{" "}
                        <span className={s.grade}>
                          {reviewData.rating * 25}%
                        </span>
                      </p>
                    </div>
                    <div className={s.reviewLine}>
                      <p
                        className={
                          reviewData.correctness.toLowerCase().includes("right")
                            ? s.correct
                            : s.wrong
                        }
                      >
                        {reviewData.correctness}
                      </p>
                    </div>
                    <p className={s.detail}>{reviewData.correctDetails}</p>
                    <div className={s.reviewLine}>
                      <p className={s.wrong}>What can be improved</p>
                      <p className={s.detail}>{reviewData.improvement}</p>
                    </div>
                    <div className={s.reviewLine}>
                      <p className={s.more}>More information</p>
                      <p className={s.detail}>{reviewData.moreInfo}</p>
                    </div>
                    <svg
                      width="866"
                      height="90"
                      viewBox="0 0 966 90"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={handleNextCard}
                      className={s.forHover}
                    >
                      <g filter="url(#filter0_d_107_14293)">
                        <rect
                          y="20"
                          width="966"
                          height="60"
                          rx="15"
                          fill="#EED1B8"
                        />
                        <path
                          d="M465 66L480 50.5L465 35M486 66L501 50.5L486 35"
                          stroke="white"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_107_14293"
                          x="-50"
                          y="-30"
                          width="1066"
                          height="160"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset />
                          <feGaussianBlur stdDeviation="10" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_107_14293"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_107_14293"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>Карточек нет</p>
          )}
        </div>
        <Aichat />
      </div>

      {/* --- Мобильная версия --- */}
      <div className={s.mobileContainer}>
        <div
          className={isLoading ? s.headerResponsiveHidden : s.headerResponsive}
        >
          <img
            src="/images/iconsModule/back.svg"
            alt=""
            onClick={() => navigate(`/module/${moduleId}`)}
          />
          <p className={s.studyOs}>
            Study <span>OS</span>
          </p>
          <img
            src={
              showAiChat
                ? "/images/session-icons/cardsMobile.svg"
                : "/images/session-icons/chat.svg"
            }
            className={s.iconChat}
            alt=""
            onClick={() => setShowAiChat((prev) => !prev)}
          />
        </div>
        {showAiChat ? (
          <Aichat />
        ) : (
          <>
            <div className={s.mobileStatusRow}>
              <div className={s.mobileRow}>
                {cardStatuses.map((status, i) => {
                  let statusClass = "";
                  if (status === "answered") statusClass = s.correct;
                  else if (status === "incorrect") statusClass = s.incorrect;
                  else statusClass = s.notAnswered;
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
                    {topicName ? topicName : "Неизвестно"} |{" "}
                    <span>Session: {sessionNumber}</span>
                  </h4>
                </div>
              </div>
            </div>
            <div className={s.mobileSessionContainer}>
              {cards.length > 0 && currentCard ? (
                <>
                  <p className={s.mobileCardText}>
                    Card {currentCardIndex + 1}
                  </p>
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
                    {!reviewData ? (
                      <div className={s.mobileAnswerBlock}>
                        <textarea
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Answer..."
                          className={s.mobileTextarea}
                        />
                        <div className={s.buttons}>
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
                    ) : (
                      // Здесь для ревью на мобильном используем desktop-классы
                      <div className={s.reviewBlock}>
                        <div className={s.reviewAnswer}>
                          <p className={s.answer}>Answer :</p>
                          <p className={s.answerText}>{userAnswer}</p>
                          <svg
                            width="868"
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
                        </div>
                        <div className={s.masteryReport}>
                          <p>
                            Study<span>OS</span> mastery report:{" "}
                            <span className={s.grade}>
                              {reviewData.rating * 25}%
                            </span>
                          </p>
                        </div>
                        <div className={s.reviewLine}>
                          <p className={s.correct}>{reviewData.correctness}</p>
                          <p className={s.detail}>
                            {reviewData.correctDetails}
                          </p>
                        </div>
                        <div className={s.reviewLine}>
                          <p className={s.wrong}>What can be improved</p>
                          <p className={s.detail}>{reviewData.improvement}</p>
                        </div>
                        <div className={s.reviewLine}>
                          <p className={s.more}>More information</p>
                          <p className={s.detail}>{reviewData.moreInfo}</p>
                        </div>
                        <svg
                          width="297"
                          height="91"
                          viewBox="0 0 357 91"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={handleNextCard}
                        >
                          <g filter="url(#filter0_d_107_14474)">
                            <rect
                              y="20.0586"
                              width="357"
                              height="60"
                              rx="15"
                              fill="#EED1B8"
                            />
                            <path
                              d="M161 66L176 50.5L161 35M182 66L197 50.5L182 35"
                              stroke="white"
                              stroke-width="3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <filter
                              id="filter0_d_107_14474"
                              x="-50"
                              y="-29.9414"
                              width="457"
                              height="160"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset />
                              <feGaussianBlur stdDeviation="10" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_107_14474"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect1_dropShadow_107_14474"
                                result="shape"
                              />
                            </filter>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p>Карточек нет</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
