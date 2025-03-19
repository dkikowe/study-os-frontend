import React, { useEffect, useState, useRef } from "react";
import YouTube from "react-youtube";
import axios from "../../axios.js"; // импорт вашего настроенного axios
import s from "./Video.module.sass";

export default function VideoMobile({ moduleId }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [videoId, setVideoId] = useState(null); // храним идентификатор YouTube-видео
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const playerRef = useRef(null);

  // 1. При монтировании/смене moduleId запрашиваем данные модуля
  useEffect(() => {
    if (!moduleId) return;

    const token = localStorage.getItem("access_token");
    axios
      .get(`/module/get_module/${moduleId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Предположим, что на бэкенде поле называется module.link
        const link = res.data?.module?.link;
        console.log(res.data);
        if (link) {
          const extractedId = extractYoutubeId(link);
          setVideoId(extractedId);
        }
      })
      .catch((err) => {
        console.error("Ошибка при получении модуля:", err);
      });
  }, [moduleId]);

  // 2. Функция, которая пытается извлечь videoId из полной ссылки
  const extractYoutubeId = (url) => {
    // Ищем параметр v= из строки
    const match = url.match(/[?&]v=([^?&]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // Если ссылка короткая, вида youtu.be/GeulXZP_kZ8
    const shortLink = url.match(/youtu\.be\/([^?&]+)/);
    if (shortLink && shortLink[1]) {
      return shortLink[1];
    }
    return null;
  };

  // 3. Логика таймера (10 минут) и оверлея
  useEffect(() => {
    let intervalId;

    const checkTime = () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime - startTime >= 600 && !showOverlay) {
          setShowOverlay(true);
          playerRef.current.pauseVideo();
        }
      }
    };

    intervalId = setInterval(checkTime, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [showOverlay, startTime]);

  // Когда плеер готов
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    setStartTime(0);
  };

  const handleStartSession = () => {
    alert("Start session!");
    setShowOverlay(false);
    // ...другие действия при старте сессии
  };

  const handleContinueLearning = () => {
    alert("Continue learning...");
    setShowOverlay(false);
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      setStartTime(currentTime);
      playerRef.current.playVideo();
    }
  };

  // 4. Настройки плеера
  const videoOptions = {
    width: "380",
    height: "230",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className={s.all}>
      <div className={s.container}>
        {videoId ? (
          <YouTube
            videoId={videoId}
            opts={videoOptions}
            onReady={onPlayerReady}
          />
        ) : (
          <p>Loading video...</p>
        )}

        {showOverlay && (
          <div className={s.overlay}>
            <h2>Do you want to proceed to session 1?</h2>
            <div className={s.buttons}>
              <button onClick={handleStartSession}>Start session</button>
              <button onClick={handleContinueLearning}>
                Continue learning
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={s.subtitleContainer}>
        <div className={s.buttons}>
          <p
            className={s.subtitles}
            onClick={() => setShowSubtitles(!showSubtitles)}
          >
            Subtitles
          </p>

          <p className={s.summary} onClick={() => setShowSummary(!showSummary)}>
            Module Summary
          </p>
        </div>
        {(showSubtitles || showSummary) && (
          <div className={s.containerText}>
            {showSubtitles && (
              <p className={s.sampleText}>
                ### **[Introduction]** **Scene**: The host sits in a cozy,
                well-lit room with bookshelves in the background, speaking
                directly to the camera. - **Host**: "Hello, English learners!
                Welcome to another episode of *Learn English with a Short
                Story*. I’m your teacher, Luke, and today we’re diving into a
                beautifully written piece called *The Birthday Party* by
                Katherine Brush. It’s a short story full of emotions and subtle
                lessons about relationships, making it perfect for language
                learning. Together, we’ll read the story, analyze its meaning,
                and learn some useful vocabulary and grammar." --- ###
                **[Reading the Story]** **Scene**: Text from the story appears
                on the screen as the host reads aloud. - **Host**: "Let me start
                by reading the story to you. Listen carefully to the tone and
                pay attention to the imagery. Don’t worry—I’ll explain any
                difficult words as we go." - *Story Excerpt*: - "They were a
                couple in their late thirties, and they looked unmistakably
                married. They sat on opposite sides of the restaurant booth, and
                they didn’t say much. But when the cake arrived, the wife beamed
                with shy pride…" - **Host interrupts**: "Let’s pause here.
                ‘Beamed with shy pride’—can you picture that? She’s smiling
                modestly, happy to have arranged this surprise for her husband.
                This shows her excitement and care." - The host continues
                reading, highlighting key phrases like: - "The cake, with its
                single pink candle, was deposited quietly at their table." -
                **Explanation**: "‘Deposited’ is a formal way to say ‘placed.’
                Notice how the story uses this word to emphasize the waiter’s
                careful approach." --- ### **[Key Moments Analysis]** **Scene**:
                The host uses visuals like drawings or animations to illustrate
                the events. 1. **The Wife’s Gesture**: - **Host**: "The wife’s
                action—arranging the cake—is thoughtful and heartfelt. She
                clearly wants to make her husband feel special, but things don’t
                go as planned." - *Visual*: A sketch of the husband looking
                embarrassed as the cake is placed on the table. 2. **The
                Husband’s Reaction**: - **Host**: "Instead of appreciating the
                gesture, the husband reacts with irritation. This moment is
                pivotal because it shifts the tone of the story from sweet to
                heartbreaking." - *Visual*: An animated frown on the husband’s
                face, while the wife’s smile fades. 3. **The Emotional Ending**:
                - **Host**: "The wife’s silent tears are described
                vividly—hidden under her large hat. This image stays with the
                reader and makes us feel her pain. Brush uses very few words,
                but they’re incredibly powerful." --- ### **[Language Focus]**
                **Scene**: A whiteboard-style visual displays key language
                points while the host explains. - **Grammar**: - "Let’s look at
                this sentence: ‘She had planned the surprise carefully.’ This is
                a great example of the past perfect tense, which we use to show
                that one action happened before another." - "For example, *She
                had planned* the surprise before *they arrived* at the
                restaurant." - **Vocabulary**: - "Here are some words to learn:
                - **Indignant**: Feeling annoyed or angry, especially when you
                think something is unfair. - **Deposited**: A formal way to say
                ‘placed.’ It suggests care or deliberation." --- ### **[Themes
                and Discussion]** **Scene**: The host sits back, inviting
                viewers to think critically. - **Host**: "This story gives us a
                lot to think about. It’s not just about a birthday party—it’s
                about human emotions, communication, and missed connections. The
                wife wanted to show love, but her husband’s reaction turned a
                joyful moment into a sad one." - **Questions for Reflection**: -
                "What do you think the wife felt after the party? How could the
                husband have responded differently?" - "Have you ever
                experienced a moment where a kind gesture was misunderstood? How
                did you handle it?" --- ### **[Interactive Exercise]**
                **Scene**: Text prompts appear on the screen for viewers to
                practice. - **Host**: "Now it’s your turn! Here are a few
                exercises to try: 1. Rewrite the ending of the story with a
                happy outcome. 2. Create a dialogue between the husband and wife
                after the dinner—what might they say to each other? 3. Write a
                diary entry as the wife, describing her feelings." --- ###
                **[Conclusion and Takeaways]** **Scene**: The host smiles
                warmly, encouraging viewers to keep practicing. - **Host**:
                "That’s it for today! I hope you enjoyed this emotional story
                and learned some new English skills. Remember, stories like this
                help us connect emotionally while improving our language. Don’t
                forget to like, subscribe, and check out the vocabulary list and
                discussion questions in the description below. See you next
                time!" --- This extended transcription includes elements of
                storytelling, analysis, and interactivity to make the lesson
                comprehensive and engaging for English learners.
              </p>
            )}
            {showSummary && (
              <p className={s.sampleText}>
                ### **[Reading the Story]** **Scene**: Text from the story
                appears on the screen as the host reads aloud. - **Host**: "Let
                me start by reading the story to you. Listen carefully to the
                tone and pay attention to the imagery. Don’t worry—I’ll explain
                any difficult words as we go." - *Story Excerpt*: - "They were a
                couple in their late thirties, and they looked unmistakably
                married. They sat on opposite sides of the restaurant booth, and
                they didn’t say much. But when the cake arrived, the wife beamed
                with shy pride…" - **Host interrupts**: "Let’s pause here.
                ‘Beamed with shy pride’—can you picture that? She’s smiling
                modestly, happy to have arranged this surprise for her husband.
                This shows her excitement and care." - The host continues
                reading, highlighting key phrases like: - "The cake, with its
                single pink candle, was deposited quietly at their table." -
                **Explanation**: "‘Deposited’ is a formal way to say ‘placed.’
                Notice how the story uses this word to emphasize the waiter’s
                careful approach." --- ### **[Key Moments Analysis]** **Scene**:
                The host uses visuals like drawings or animations to illustrate
                the events. 1. **The Wife’s Gesture**: - **Host**: "The wife’s
                action—arranging the cake—is thoughtful and heartfelt. She
                clearly wants to make her husband feel special, but things don’t
                go as planned." - *Visual*: A sketch of the husband looking
                embarrassed as the cake is placed on the table. 2. **The
                Husband’s Reaction**: - **Host**: "Instead of appreciating the
                gesture, the husband reacts with irritation. This moment is
                pivotal because it shifts the tone of the story from sweet to
                heartbreaking." - *Visual*: An animated frown on the husband’s
                face, while the wife’s smile fades. 3. **The Emotional Ending**:
                - **Host**: "The wife’s silent tears are described
                vividly—hidden under her large hat. This image stays with the
                reader and makes us feel her pain. Brush uses very few words,
                but they’re incredibly ### **[Introduction]** **Scene**: The
                host sits in a cozy, well-lit room with bookshelves in the
                background, speaking directly to the camera. - **Host**: "Hello,
                English learners! Welcome to another episode of *Learn English
                with a Short Story*. I’m your teacher, Luke, and today we’re
                diving into a beautifully written piece called *The Birthday
                Party* by Katherine Brush. It’s a short story full of emotions
                and subtle lessons about relationships, making it perfect for
                language learning. Together, we’ll read the story, analyze its
                meaning, and learn some useful vocabulary and grammar." --- ###
                **[Reading the Story]** **Scene**: Text from the story appears
                on the screen as the host reads aloud. - **Host**: "Let me start
                by reading the story to you. Listen carefully to the tone and
                pay attention to the imagery. Don’t worry—I’ll explain any
                difficult words as we go." - *Story Excerpt*: - "They were a
                couple in their late thirties, and they looked unmistakably
                married. They sat on opposite sides of the restaurant booth, and
                they didn’t say much. But when the cake arrived, the wife beamed
                with shy pride…" - **Host interrupts**: "Let’s pause here.
                ‘Beamed with shy pride’—can you picture that? She’s smiling
                modestly, happy to have arranged this surprise for her husband.
                This shows her excitement and care." - The host continues
                reading, highlighting key phrases like: - "The cake, with its
                single pink candle, was deposited quietly at their table." -
                **Explanation**: "‘Deposited’ is a formal way to say ‘placed.’
                Notice how the story uses this word to emphasize the waiter’s
                careful approach." --- ### **[Key Moments Analysis]** **Scene**:
                The host uses visuals like drawings or animations to illustrate
                the events. 1. **The Wife’s Gesture**: - **Host**: "The wife’s
                action—arranging the cake—is thoughtful and heartfelt. She
                clearly wants to make her husband feel special, but things don’t
                go as planned." - *Visual*: A sketch of the husband looking
                embarrassed as the cake is placed on the table. 2. **The
                Husband’s Reaction**: - **Host**: "Instead of appreciating the
                gesture, the husband reacts with irritation. This moment is
                pivotal because it shifts the tone of the story from sweet to
                heartbreaking." - *Visual*: An animated frown on the husband’s
                face, while the wife’s smile fades. 3. **The Emotional Ending**:
                - **Host**: "The wife’s silent tears are described
                vividly—hidden under her large hat. This image stays with the
                reader and makes us feel her pain. Brush uses very few words,
                but they’re incredibly powerful." --- ### **[Language Focus]**
                **Scene**: A whiteboard-style visual displays key language
                points while the host explains. - **Grammar**: - "Let’s look at
                this sentence: ‘She had planned the surprise carefully.’ This is
                a great example of the past perfect tense, which we use to show
                that one action happened before another." - "For example, *She
                had planned* the surprise before *they arrived* at the
                restaurant." - **Vocabulary**: - "Here are some words to learn:
                - **Indignant**: Feeling annoyed or angry, especially when you
                think something is unfair. - **Deposited**: A formal way to say
                ‘placed.’ It suggests care or deliberation." --- ### **[Themes
                and Discussion]** **Scene**: The host sits back, inviting
                viewers to think critically. - **Host**: "This story gives us a
                lot to think about. It’s not just about a birthday party—it’s
                about human emotions, communication, and missed connections. The
                wife wanted to show love, but her husband’s reaction turned a
                joyful moment into a sad one." - **Questions for Reflection**: -
                "What do you think the wife felt after the party? How could the
                husband have responded differently?" - "Have you ever
                experienced a moment where a kind gesture was misunderstood? How
                did you handle it?" --- ### **[Interactive Exercise]**
                **Scene**: Text prompts appear on the screen for viewers to
                practice. - **Host**: "Now it’s your turn! Here are a few
                exercises to try: 1. Rewrite the ending of the story with a
                happy outcome. 2. Create a dialogue between the husband and wife
                after the dinner—what might they say to each other? 3. Write a
                diary entry as the wife, describing her feelings." --- ###
                **[Conclusion and Takeaways]** **Scene**: The host smiles
                warmly, encouraging viewers to keep practicing. - **Host**:
                "That’s it for today! I hope you enjoyed this emotional story
                and learned some new English skills. Remember, stories like this
                help us connect emotionally while improving our language. Don’t
                forget to like, subscribe, and check out the vocabulary list and
                discussion questions in the description below. See you next
                time!" --- This extended transcription includes elements of
                storytelling, analysis, and interactivity to make the lesson
                comprehensive and engaging for English learners.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
