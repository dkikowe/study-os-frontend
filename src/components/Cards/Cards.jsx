import React, { useEffect, useState, useRef } from "react";
import s from "./Cards.module.sass";
import axios from "../../axios";

export default function Cards({ moduleId, selectedTopic }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [cards, setCards] = useState([]);
  const [showCardsContainer, setShowCardsContainer] = useState(true);

  const [editingCardId, setEditingCardId] = useState(null);
  const [editedFront, setEditedFront] = useState("");
  const [editedBack, setEditedBack] = useState("");

  const [creatingCard, setCreatingCard] = useState(false);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");

  const frontTextareaRef = useRef(null);

  const fetchCards = async (topicId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`/card/get_cards/${topicId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(response.data.cards || []);
    } catch (error) {
      console.error("Ошибка при загрузке карточек:", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`/topic/get_topics/${moduleId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      const allTopics = response.data.topics || [];
      setTopics(allTopics);
      if (!selectedTopic && allTopics.length > 0) {
        const firstTopicId = allTopics[0].id;
        setSelectedTopicId(firstTopicId);
        fetchCards(firstTopicId);
      }
    } catch (error) {
      console.error("Ошибка при загрузке топиков:", error);
    }
  };

  const handleCreateCard = async () => {
    if (!newCardFront.trim() || !newCardBack.trim()) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "/card/create_card",
        {
          front_card: newCardFront,
          back_card: newCardBack,
          topic_id: selectedTopicId,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewCardFront("");
      setNewCardBack("");
      setCreatingCard(false);
      fetchCards(selectedTopicId);
    } catch (error) {
      console.error("Ошибка при создании карточки:", error);
    }
  };

  const handleEditClick = (card) => {
    setEditingCardId(card.id);
    setEditedFront(card.front_card);
    setEditedBack(card.back_card);
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditedFront("");
    setEditedBack("");
  };

  const handleUpdateCard = async (cardId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `/card/update_card/${cardId}`,
        {
          front_card: editedFront,
          back_card: editedBack,
          topic_id: selectedTopicId,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingCardId(null);
      fetchCards(selectedTopicId);
    } catch (error) {
      console.error("Ошибка при обновлении карточки:", error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`/card/delete_card/${cardId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCards(selectedTopicId);
    } catch (error) {
      console.error("Ошибка при удалении карточки:", error);
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchTopics();
    }
  }, [moduleId]);

  useEffect(() => {
    if (selectedTopic?.id) {
      setSelectedTopicId(selectedTopic.id);
      fetchCards(selectedTopic.id);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (creatingCard && frontTextareaRef.current) {
      frontTextareaRef.current.focus();
    }
  }, [creatingCard]);

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
            <img
              src="/images/iconsModule/createCard.svg"
              alt="Create"
              className={s.createCard}
              onClick={() => setCreatingCard(true)}
            />
            <div className={s.header}>
              <h2 className={s.topicName}>{currentTopic?.name || "Topic"}</h2>
            </div>

            {creatingCard && (
              <div className={s.card}>
                <div className={s.cardHeader}>
                  <div className={s.cardNumber}>create card</div>
                </div>
                <div className={s.cardContent}>
                  <div className={s.question}>
                    <strong className={s.questionTitle}>Question</strong>
                    <div className={s.questionBlock}>
                      <textarea
                        ref={frontTextareaRef}
                        className={s.textarea}
                        value={newCardFront}
                        onChange={(e) => setNewCardFront(e.target.value)}
                        placeholder="Enter question..."
                      />
                      <img src="/images/iconsModule/rectangle.svg" alt="" />
                    </div>
                    <strong className={s.answerTitle}>Answer</strong>
                    <textarea
                      className={s.textarea}
                      value={newCardBack}
                      onChange={(e) => setNewCardBack(e.target.value)}
                      placeholder="Enter answer..."
                    />
                  </div>
                </div>
                <div className={s.cardIcons}>
                  <button onClick={handleCreateCard}>Save</button>
                  <button
                    onClick={() => {
                      setCreatingCard(false);
                      setNewCardFront("");
                      setNewCardBack("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className={s.cardsList}>
              {cards.map((card, index) => (
                <div key={card.id} className={s.card}>
                  <div className={s.cardHeader}>
                    <div className={s.cardNumber}>{index + 1}</div>
                    <div className={s.cardIcons}>
                      {editingCardId === card.id ? (
                        <>
                          <button onClick={() => handleUpdateCard(card.id)}>
                            Save
                          </button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <img
                          src="/images/iconsModule/edit.svg"
                          width={16}
                          height={16}
                          alt="Edit"
                          onClick={() => handleEditClick(card)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                      <img
                        src="/images/iconsModule/delete.svg"
                        alt="Delete"
                        onClick={() => handleDeleteCard(card.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                  <img
                    className={s.line}
                    src="/images/iconsModule/lineCard.svg"
                    alt="Line"
                  />
                  <div className={s.cardContent}>
                    <div className={s.question}>
                      <strong className={s.questionTitle}>Question</strong>
                      <div className={s.questionBlock}>
                        {editingCardId === card.id ? (
                          <textarea
                            className={s.textarea}
                            value={editedFront}
                            onChange={(e) => setEditedFront(e.target.value)}
                          />
                        ) : (
                          <p>{card.front_card}</p>
                        )}
                        <img src="/images/iconsModule/rectangle.svg" alt="" />
                      </div>
                      <strong className={s.answerTitle}>Answer</strong>
                      {editingCardId === card.id ? (
                        <textarea
                          className={s.textarea}
                          value={editedBack}
                          onChange={(e) => setEditedBack(e.target.value)}
                        />
                      ) : (
                        <p>{card.back_card}</p>
                      )}
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
