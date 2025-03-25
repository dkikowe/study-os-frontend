import React, { useState, useEffect } from "react";
import s from "./Loading.module.sass";
import brain1 from "../../assets/loading1.svg";
import brain2 from "../../assets/loading2.svg";
import brain3 from "../../assets/loading3.svg";
import brain4 from "../../assets/loading4.svg";

const images = [brain1, brain2, brain3, brain4];

export default function Loading() {
  // Индекс текущей картинки
  const [index, setIndex] = useState(0);
  // Флаг для анимации (каждый раз, когда меняется индекс, запускаем fadeIn)
  const [fade, setFade] = useState(false);

  // Запускаем интервал, который каждые 700 мс переключает индекс
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  // При каждом изменении индекса запускаем анимацию fadeIn
  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => {
      setFade(false);
    }, 300); // продолжительность анимации в мс (должна совпадать с настройками в SASS)
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div className={s.container}>
      <img
        key={index} // заставляем перерендериваться элемент при смене индекса
        src={images[index]}
        alt={`Level ${index + 1}`}
        className={`${s.image} ${fade ? s.fade : ""}`}
      />
    </div>
  );
}
