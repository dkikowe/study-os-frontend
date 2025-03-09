import React, { useState } from "react";
import s from "./Module.module.sass";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import Youtube from "../../components/Youtube/Youtube";
import Sessions from "../../components/Sessions/Sessions";
import Video from "../../components/Video/Video";
import Cards from "../../components/Cards/Cards";
import { Play, Book, Layers } from "lucide-react";

export default function Module() {
  const [activeTab, setActiveTab] = useState("sessions");

  return (
    <div className={s.container}>
      <Nav />
      <Header />

      {/* Десктопная версия (ваш прежний код) */}
      <div className={s.desktopVersion}>
        <div className={s.title}>
          <div className={s.titleText}>
            <div className={s.text}>
              <h4 className={s.titleHead}>
                Party time | <span> Module 2</span>
              </h4>
              <div className={s.icons}>
                <img src="/images/iconsModule/dotpoints.svg" alt="" />
                <img
                  src="/images/iconsModule/edit.svg"
                  width={22}
                  height={22}
                  alt=""
                />
                <img src="/images/iconsModule/settings.svg" alt="" />
              </div>
            </div>
          </div>
          <div className={s.titleDesc}>
            <p className={s.desc}>
              This module combines vocabulary building, grammar practice, and
              cultural insights to prepare learners for real-world scenarios
              such as birthday parties, holiday celebrations, and casual
              get-togethers.
            </p>
          </div>
          <Youtube />
          <div className={s.sessions}>
            <Sessions />
            <Video />
            <Cards />
          </div>
          <div className={s.subtitleContainer}>
            <p className={s.subtitles}>Subtitles</p>
            <p className={s.summary}>Module Summary</p>
          </div>
        </div>
      </div>

      {/* Мобильная версия с табами */}
      <div className={s.mobileVersion}>
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
        <div className={s.mobileTabs}>
          <button
            className={activeTab === "sessions" ? s.activeTab : s.sessionButton}
            onClick={() => setActiveTab("sessions")}
          >
            <Play size={30}></Play>
            Sessions
          </button>
          <button
            className={activeTab === "study" ? s.activeTab : s.studyButton}
            onClick={() => setActiveTab("study")}
          >
            <Book size={30} />
            Study
          </button>
          <button
            className={activeTab === "cards" ? s.activeTabCards : s.cardsButton}
            onClick={() => setActiveTab("cards")}
          >
            <img
              src={
                activeTab === "cards"
                  ? "/images/iconsModule/cardActive.svg"
                  : "/images/iconsModule/cards.svg"
              }
              alt=""
            />
            Cards
          </button>
        </div>
        <div className={s.titleMobile}>
          <div className={s.titleTextMobile}>
            <div className={s.textMobile}>
              <h4 className={s.titleHeadMobile}>
                Party time | <span> Module 2</span>
              </h4>
            </div>
          </div>
          <div className={s.titleDescMobile}>
            <p className={s.descMobile}>
              This module combines vocabulary building, grammar practice, and
              cultural insights to prepare learners for real-world scenarios
              such as birthday parties, holiday celebrations, and casual
              get-togethers.
            </p>
          </div>
        </div>

        <div className={s.tabContent}>
          {activeTab === "sessions" && <Sessions />}
          {activeTab === "study" && (
            <>
              <Video />
              <div className={s.subtitleContainerMobile}>
                <p className={s.subtitlesMobile}>Subtitles</p>
                <p className={s.summaryMobile}>Module Summary</p>
              </div>
            </>
          )}
          {activeTab === "cards" && <Cards />}
        </div>
      </div>
    </div>
  );
}
