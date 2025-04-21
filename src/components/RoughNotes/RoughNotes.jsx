import React from "react";
import "./RoughNotes.sass";

const RoughNotes = ({ card }) => {
  if (!card) {
    return (
      <div className="subBody">
        <div className="content"></div>
      </div>
    );
  }

  return (
    <div className="subBody">
      <div className="header">
        <span className="title">rough notes</span>
      </div>

      <div className="content">
        <div className="cardHeader">
          <span className="cardTitle">Card {card.number}</span>
        </div>

        <div className="divider" />

        <div className="questionCard">
          <span className="label">Question</span>
          <div className="questionContent">
            <p className="questionText">
              {card.front_card || "No question available"}
            </p>
            <div className="questionFrame" />
          </div>
        </div>

        <span className="label">Answer</span>

        <div className="answerCard">
          <div className="answerIcon">
            <div className="iconCircle">
              <div className="iconRectangle" />
            </div>
          </div>

          <div className="answerContent">
            <span className="date">28.05.2025</span>

            <div className="answerFrame">
              <div className="answerTextContainer">
                <p className="answerText">
                  The primary goal of knowledge representation in AI is to
                  enable the system to know information, represent it, and draw
                  inferences from it. This capability contributes...
                </p>
                <span className="openMore">open more</span>
              </div>
            </div>

            <div className="answerFooter">
              <span className="correctness">Correctness: 80%</span>
              <div className="eyeIcon">
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 0C4.36364 0 1.25818 2.28 0 5.5C1.25818 8.72 4.36364 11 8 11C11.6364 11 14.7418 8.72 16 5.5C14.7418 2.28 11.6364 0 8 0ZM8 9.16667C5.99273 9.16667 4.36364 7.51167 4.36364 5.5C4.36364 3.48833 5.99273 1.83333 8 1.83333C10.0073 1.83333 11.6364 3.48833 11.6364 5.5C11.6364 7.51167 10.0073 9.16667 8 9.16667ZM8 3.3C6.79273 3.3 5.81818 4.29833 5.81818 5.5C5.81818 6.70167 6.79273 7.7 8 7.7C9.20727 7.7 10.1818 6.70167 10.1818 5.5C10.1818 4.29833 9.20727 3.3 8 3.3Z"
                    fill="#B8B8B8"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="arrow">
            <svg
              width="5"
              height="12"
              viewBox="0 0 5 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0L5 6L0 12V0Z" fill="#B0B0B0" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoughNotes;
