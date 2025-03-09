import React, { useEffect, useState } from "react";
import s from "./Cards.module.sass";
import axios from "../../axios";

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [selectedSession, setSelectedSession] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const topicsResponse = await axios.get("/topic/get_topics/19", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        const topics = topicsResponse.data.topics || [];
        if (!topics.length) {
          console.warn("Нет топиков в курсе");
          return;
        }

        const firstTopicId = topics[0].id;

        // карточки первого топика
        const cardsResponse = await axios.get(
          `/card/get_cards/${firstTopicId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCards(cardsResponse.data.cards || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={s.cardsContainer}>
      <div className={s.header}>
        <span className={s.label}>Session:</span>
        <button className={s.cards}>cards</button>
        <button className={s.close}>-</button>
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            className={`${s.sessionButton} ${
              selectedSession === num ? s.active : ""
            }`}
            onClick={() => setSelectedSession(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <div className={s.cardsList}>
        {cards.map((card, index) => (
          <div key={card.id} className={s.card}>
            <div className={s.cardHeader}>
              <span className={s.cardNumber}>{index + 1}</span>
            </div>
            <div className={s.cardContent}>
              <div className={s.question}>
                <strong>Question</strong>
                <p>{card.back_card}</p>
              </div>
              <div className={s.answer}>
                <strong>Answer</strong>
                <p>{card.front_card}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
