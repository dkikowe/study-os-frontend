import s from "./Youtube.module.sass";

export default function Youtube() {
  return (
    <div className={s.container}>
      <img
        src="/images/iconsModule/youtubePreview.svg"
        className={s.preview}
        alt=""
      />
      <div className={s.textContainer}>
        <div className={s.title}>
          <p className={s.titleHead}>
            The Birthday Party (Learn English with a Short Story)
          </p>
          <div className={s.icons}>
            <img
              src="/images/iconsModule/edit.svg"
              width={22}
              height={22}
              alt=""
            />
            <img src="/images/iconsModule/settings.svg" alt="" />
          </div>
        </div>
        <div className={s.titleDesc}>
          <p className={s.textDesc}>
            Learn English with another short story. This time it's a 300-word
            story by Konstantine Drug, often used in literature classes, full of
            vivid imagery and with an emotional twist. I read the story to you,
            and then go through each line, explaining vocabulary and grammar.
          </p>
          <p className={s.time}>47:28</p>
        </div>
      </div>
      <div className={s.youtubeLink}>
        <p className={s.linkText}>to Youtube</p>
      </div>
    </div>
  );
}
