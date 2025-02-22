import s from "./Loading.module.sass";
import { useState } from "react";
import { useEffect } from "react";
import brain1 from "../../assets/loading1.svg";
import brain2 from "../../assets/loading2.svg";
import brain3 from "../../assets/loading3.svg";
import brain4 from "../../assets/loading4.svg";

const images = [brain1, brain2, brain3, brain4];

export default function Loading() {
  return (
    <div className={s.container}>
      <img src={brain1} alt="Level 1" className={`${s.image} ${s.image1}`} />
      <img src={brain2} alt="Level 2" className={`${s.image} ${s.image2}`} />
      <img src={brain3} alt="Level 3" className={`${s.image} ${s.image3}`} />
      <img src={brain4} alt="Level 4" className={`${s.image} ${s.image4}`} />
    </div>
  );
}
