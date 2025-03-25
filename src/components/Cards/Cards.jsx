import React, { useEffect, useState } from "react";
import s from "./Cards.module.sass";
import axios from "../../axios";

export default function Cards({ moduleId, selectedTopic }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [cards, setCards] = useState([]);
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

        // Если нет выбранного топика из пропсов, выбираем первый из списка
        if (!selectedTopic && allTopics.length > 0) {
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
  }, [moduleId, selectedTopic]);

  // Если пришёл выбранный топик из родителя, используем его
  useEffect(() => {
    if (selectedTopic && selectedTopic.id) {
      setSelectedTopicId(selectedTopic.id);
      fetchCards(selectedTopic.id);
    }
  }, [selectedTopic]);

  // Переключение между топиками
  const handleTopicClick = (topicId) => {
    if (topicId === selectedTopicId) {
      setShowCardsContainer(!showCardsContainer);
    } else {
      setSelectedTopicId(topicId);
      fetchCards(topicId);
    }
  };

  const currentTopic = topics.find((t) => t.id === selectedTopicId);

  return (
    <div className={s.containerForCard}>
      <div className={s.cardsWrapper}>
        <div className={s.cardNumbers}>
          <div className={s.topBar}>
            <button className={s.cards}>cards</button>
            <span className={s.label}>Session:</span>
          </div>
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
          <button
            className={showCardsContainer ? s.close : s.open}
            onClick={() => setShowCardsContainer(!showCardsContainer)}
          >
            {showCardsContainer ? "-" : "^"}
          </button>
        </div>

        {showCardsContainer && (
          <div className={s.cardsContainer}>
            <div className={s.header}>
              <h2 className={s.topicName}>
                {currentTopic?.name || "Topic name"}
              </h2>
            </div>
            <div key={selectedTopicId} className={s.cardsList}>
              {selectedTopicId &&
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
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
