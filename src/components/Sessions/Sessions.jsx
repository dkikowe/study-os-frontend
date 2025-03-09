import s from "./Sessions.module.sass";

export default function Sessions() {
  const sessionsData = [
    {
      id: 1,
      topic: "/*Topic name*/",
      startTime: "3:42",
      endTime: "12:52",
      cardsCount: 15,
      iconSrc: "/images/iconsModule/refresh.svg",
    },
    {
      id: 2,
      topic: "/*Topic name*/",
      startTime: "3:42",
      endTime: "12:52",
      cardsCount: 10,
      iconSrc: "/images/iconsModule/syncIcon.svg",
    },
    {
      id: 3,
      topic: "/*Topic name*/",
      startTime: "3:42",
      endTime: "12:52",
      cardsCount: 12,
      iconSrc: "/images/iconsModule/pause.svg", // Тут исправь путь, если название другое
    },
  ];

  return (
    <div className={s.container}>
      <p className={s.sessionsTitle}>Sessions</p>
      <div className={s.sessions}>
        {sessionsData.map((session) => (
          <div key={session.id} className={s.cardContainer}>
            <div className={s.sessionCard}>
              <div className={s.sessionSide}>
                <div className={s.syncIcon}>
                  <img src={session.iconSrc} alt="Session Icon" />
                </div>
              </div>

              <div className={s.sessionContent}>
                <div className={s.imageWrapper}>
                  <img
                    src="/images/iconsModule/youtubePreview.svg"
                    alt="Session Preview"
                    className={s.sessionImage}
                  />
                  <div className={s.overlay}>
                    <span className={s.sessionNumber}>{session.id}</span>
                    <span className={s.sessionTitle}>{session.topic}</span>
                    <div className={s.times}>
                      <p className={s.cardCount}>{session.cardsCount} cards</p>
                      <div className={s.timeCodes}>
                        <span>
                          {session.startTime} - <span>{session.endTime}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={s.buttons}>
              <button className={s.toCards}>to cards</button>
              <button className={s.toTimeCode}>to time-code</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
