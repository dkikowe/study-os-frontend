import { useState } from "react";
import s from "./Notes.module.sass";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import RoughNotes from "../../components/RoughNotes/RoughNotes";
import SpheresDropdown from "../../components/Dropdown/Dropdown";
import NoteBlock from "../../components/NoteBlock/NoteBlock";

export default function Notes() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAiChat, setShowAiChat] = useState(false);

  const handleCardSelect = (cardId, cardNumber, cardData) => {
    setSelectedCard({ id: cardId, number: cardNumber, ...cardData });
  };

  return (
    <div className={s.container}>
      <Nav />
      <Header />

      {/* Десктопная версия */}
      <div className={s.desktopVersion}>
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

      {/* Мобильная версия */}
      <div className={s.mobileVersion}>
        <div className={s.headerResponsive}>
          <img
            src="/images/iconsModule/back.svg"
            alt="back"
            onClick={() => window.history.back()}
          />
          <p className={s.studyOs}>
            Study <span>OS</span>
          </p>
          <img
            src="/images/iconsModule/iconsMobile.svg"
            className={s.icons}
            alt="menu"
          />
        </div>
        <hr />
        <div className={s.mobileTitleContainer}>
          <h4 className={s.mobileTitle}>Notes</h4>
        </div>
        <div className={s.mobileBlocks}>
          <SpheresDropdown onCardSelect={handleCardSelect} />
          <NoteBlock />
          <RoughNotes card={selectedCard} />
        </div>
      </div>
    </div>
  );
}
