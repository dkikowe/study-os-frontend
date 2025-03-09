import React, { useEffect, useState } from "react";
import s from "./Cards.module.sass";
import axios from "../../axios"; // проверь правильность пути к axios

export default function Cards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const topicsResponse = await axios.get("/topic/get_topics/19", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Результат /topic/get_topics/18:", topicsResponse.data);

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
        console.log("Результат /card/get_cards:", cardsResponse.data);

        setCards(cardsResponse.data.cards || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={s.cardNumbers}>
      <div className={s.containerCard}>
        <span className={s.label}>Session:</span>
        <button className={s.cards}>cards</button>
        <button className={s.close}>-</button>

        {cards.map((card, index) => (
          <button key={card.id} className={s.buttonCard}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
