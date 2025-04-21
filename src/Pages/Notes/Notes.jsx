import { useState } from "react";
import s from "./Notes.module.sass";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import RoughNotes from "../../components/RoughNotes/RoughNotes";
import SpheresDropdown from "../../components/Dropdown/Dropdown";
import NoteBlock from "../../components/NoteBlock/NoteBlock";

export default function Notes() {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (cardId, cardNumber, cardData) => {
    setSelectedCard({ id: cardId, number: cardNumber, ...cardData });
  };

  return (
    <div className={s.container}>
      <Nav />
      <Header />
      <div className={s.title}>
        <div className={s.titleText}>
          <div className={s.text}>
            <h4 className={s.titleHead}>Notes</h4>
          </div>
        </div>
      </div>
      <div className={s.blocks}>
        <SpheresDropdown onCardSelect={handleCardSelect} />
        <NoteBlock></NoteBlock>
        <RoughNotes card={selectedCard} />
      </div>
    </div>
  );
}
