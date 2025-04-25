import React, { useState, useEffect } from "react";
import axios from "../../axios";
import s from "./Nav.module.sass";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Book,
  BookOpen,
  GraduationCap,
  Pencil,
  Edit,
  Award,
  Lightbulb,
  Atom,
  FlaskConical,
  Microscope,
  Palette,
  Music,
  Calculator,
  Ruler,
  Code,
  Clipboard,
  PenTool,
  Folder,
  Calendar,
  Clock,
} from "lucide-react";

const subjectIcons = {
  brain: Brain,
  book: Book,
  bookopen: BookOpen,
  graduationcap: GraduationCap,
  pencil: Pencil,
  edit: Edit,
  award: Award,
  lightbulb: Lightbulb,
  atom: Atom,
  flaskconical: FlaskConical,
  microscope: Microscope,
  palette: Palette,
  music: Music,
  calculator: Calculator,
  ruler: Ruler,
  code: Code,
  clipboard: Clipboard,
  pentool: PenTool,
  folder: Folder,
  calendar: Calendar,
  clock: Clock,
};

export default function Nav() {
  const [spheres, setSpheres] = useState([]);
  const [showSpheres, setShowSpheres] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpheres = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get("/sphere/get_spheres", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        setSpheres(response.data.spheres || []);
      } catch (error) {
        console.error("Ошибка загрузки сфер:", error);
      }
    };

    fetchSpheres();
  }, []);

  const handleNavigateSphere = (sphereId) => {
    navigate(`/sphere/${sphereId}`);
  };

  const handleHomeNavigate = () => {
    navigate("/home");
  };

  return (
    <div className="body">
      {/* Десктоп навбар (ОСТАВИЛ БЕЗ ИЗМЕНЕНИЙ) */}
      <div className={s.desktopNav}>
        <img src="/images/icons/brainNav.svg" className={s.brain} alt="" />
        <div className={s.navBar}>
          <img src="/images/icons/avatar.svg" className={s.avatar} alt="" />
          <img src="/images/icons/Line.svg" className={s.line} alt="" />
          <img
            src="/images/icons/Home.svg"
            className={s.home}
            alt=""
            onClick={handleHomeNavigate}
          />

          {/* Контейнер для скролла, если сфер больше 5 */}
          <div className={s.spheresContainer}>
            {spheres.map((sphere) => {
              const iconKey = sphere.icon
                ? sphere.icon.trim().toLowerCase()
                : "";
              const IconComp = subjectIcons[iconKey];

              return IconComp ? (
                <div key={sphere.id} className={s.spheres}>
                  <div className={s.iconWrapper}>
                    <IconComp
                      size={30}
                      onClick={() => handleNavigateSphere(sphere.id)}
                    />
                  </div>
                </div>
              ) : null;
            })}
          </div>

          <img src="/images/icons/Line.svg" className={s.line} alt="" />
          <img
            src="/images/icons/Notes.svg"
            className={s.notes}
            alt=""
            onClick={() => {
              navigate("/notes");
            }}
          />
          <img src="/images/icons/Tags.svg" className={s.tags} alt="" />
        </div>
      </div>

      {/* Мобильный навбар */}
      <div className={s.mobileNav}>
        <img
          className={s.homeMobile}
          src="/images/icons/homeMobile.svg"
          onClick={handleHomeNavigate}
          alt=""
        />
        <img
          src={
            !showSpheres
              ? "/images/icons/spheresMobile.svg"
              : "/images/icons/spheresMobileActive.svg"
          }
          alt=""
          className={showSpheres ? s.active : ""}
          onClick={() => setShowSpheres(!showSpheres)}
        />
        <img src="/images/icons/plusHome.svg" alt="" />
        <img src="/images/icons/more.svg" alt="" />
        <img src="/images/icons/reshetka.svg" alt="" />
      </div>

      {/* Блок сфер для мобильного с условием скролла */}
      <div
        className={`${s.mobileSpheres} ${showSpheres ? s.show : ""} ${
          spheres.length > 5 ? s.scrollable : ""
        }`}
      >
        {spheres.map((sphere) => {
          const iconKey = sphere.icon ? sphere.icon.trim().toLowerCase() : "";
          const IconComp = subjectIcons[iconKey];

          return IconComp ? (
            <div key={sphere.id} className={s.sphere}>
              <IconComp
                size={30}
                onClick={() => handleNavigateSphere(sphere.id)}
              />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
