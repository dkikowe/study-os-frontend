import React, { useEffect, useState } from "react";
import s from "./Cards.module.sass";
import axios from "../../axios"; // проверь правильность пути к axios

export default function Cards({ moduleId }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [cards, setCards] = useState([]);
  // Управляет показом/скрытием всего блока с карточками
  const [showCardsContainer, setShowCardsContainer] = useState(true);

  // Загрузка карточек для конкретного топика
  const fetchCards = async (topicId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`/card/get_cards/${topicId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(response.data.cards || []);
      console.log("Cards for topic:", topicId, response.data.cards);
    } catch (error) {
      console.error("Ошибка при загрузке карточек:", error);
    }
  };

  // Запрашиваем список топиков для данного moduleId
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const topicsResponse = await axios.get(
          `/topic/get_topics/${moduleId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const allTopics = topicsResponse.data.topics || [];
        setTopics(allTopics);

        if (allTopics.length > 0) {
          // Берем первый топик из массива как выбранный по умолчанию
          const firstTopicId = allTopics[0].id;
          setSelectedTopicId(firstTopicId);
          fetchCards(firstTopicId);
        }
      } catch (error) {
        console.error("Ошибка при загрузке топиков:", error);
      }
    };

    if (moduleId) {
      fetchTopics();
    }
  }, [moduleId]);

  // Переключение между топиками (сессиями) + скрытие при повторном нажатии
  const handleTopicClick = (topicId) => {
    if (topicId === selectedTopicId) {
      // Если нажали на уже выбранный топик — убираем выбор и очищаем карточки
      setShowCardsContainer(!showCardsContainer);
    } else {
      // Иначе выбираем новый топик и грузим карточки
      setSelectedTopicId(topicId);
      fetchCards(topicId);
    }
  };

  // Текущий выбранный топик (для отображения названия)
  const currentTopic = topics.find((t) => t.id === selectedTopicId);

  return (
    <div className={s.containerForCard}>
      {/* Верхняя панель с header */}
      <div className={s.cardsWrapper}>
        <div className={s.cardNumbers}>
          {/* Верхняя панель с кнопкой cards, Session: */}
          <div className={s.topBar}>
            <button className={s.cards}>cards</button>
            <span className={s.label}>Session:</span>
          </div>

          {/* Прокручиваемая часть — кнопки 1,2,3,... */}
          <div className={s.sessionsScroll}>
            {topics.map((topic, index) => (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                className={
                  selectedTopicId === topic.id ? s.activeSession : s.buttonCard
                }
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Кнопка сворачивания / разворачивания блока карточек */}
          <button
            className={showCardsContainer ? s.close : s.open}
            onClick={() => setShowCardsContainer(!showCardsContainer)}
          >
            {showCardsContainer ? "-" : "^"}
          </button>
        </div>

        {/* Если showCardsContainer === false, блок скрыт */}
        {showCardsContainer && (
          <div className={s.cardsContainer}>
            <div className={s.header}>
              <h2 className={s.topicName}>
                {currentTopic?.name || "Topic name"}
              </h2>
            </div>

            <div key={selectedTopicId} className={s.cardsList}>
              {/* Показываем карточки только если выбран топик */}
              {selectedTopicId && cards.length > 0 ? (
                cards.map((card, index) => (
                  <div key={card.id} className={s.card}>
                    <div className={s.cardHeader}>
                      <div className={s.cardNumber}>{index + 1}</div>
                      <div className={s.cardIcons}>
                        <img
                          src="/images/iconsModule/edit.svg"
                          width={16}
                          height={16}
                          alt=""
                        />
                        <img src="/images/iconsModule/delete.svg" alt="" />
                      </div>
                    </div>
                    <img
                      className={s.line}
                      src="/images/iconsModule/lineCard.svg"
                      alt=""
                    />
                    <div className={s.cardContent}>
                      <div className={s.question}>
                        <strong className={s.questionTitle}>Question</strong>
                        <div className={s.questionBlock}>
                          <p>{card.front_card}</p>
                          <img src="/images/iconsModule/rectangle.svg" alt="" />
                        </div>
                        <strong className={s.answerTitle}>Answer</strong>
                        <p>{card.back_card}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : selectedTopicId ? (
                // Если топик выбран, но карточек нет
                <p>No cards found for this topic.</p>
              ) : (
                // Если топик не выбран
                <p>Select a session above.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
