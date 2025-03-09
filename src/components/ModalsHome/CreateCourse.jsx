import React, { useState, useRef, useEffect } from "react";
import axios from "../../axios";
import s from "./Modal.module.sass";
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
};

const CreateCourseModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [sphere, setSphere] = useState(null);
  const [spheres, setSpheres] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSpheres = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get("/sphere/get_spheres", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Ответ API:", response.data);
        setSpheres(response.data.spheres);
      } catch (error) {
        console.error("Ошибка загрузки сфер:", error);
      }
    };

    fetchSpheres();
  }, []);

  const handleSelectSphere = (item) => {
    console.log("Sphere by id", item.id);
    setSphere(item);
    setDropdownOpen(false);
  };

  const handleCreateCourse = async () => {
    if (!name.trim() || !sphere) return;

    const token = localStorage.getItem("access_token");
    const requestData = {
      name,
      sphere_id: sphere.id, // Используем id выбранной сферы
    };

    try {
      const response = await axios.post("/course/create_course", requestData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Курс создан:", response.data);
      onCreate(response.data); // Вызываем переданный пропс
      onClose(); // Закрываем модалку
      setName("");
      setSphere(null);
    } catch (error) {
      console.error(
        "Ошибка при создании курса:",
        error.response?.data || error
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className={s.modal}>
      <div className={s.modalContent}>
        <span className={s.modalClose} onClick={onClose}>
          ×
        </span>
        <h2 className={s.modalTitle}>
          New <span>Course</span>
        </h2>
        <input
          type="text"
          className={s.modalInput}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <img src="/images/icons/Line 63.svg" className={s.lineModule} alt="" />

        {/* Кастомный Select */}
        <div className={s.customSelect} ref={dropdownRef}>
          <div
            className={s.selectedOption}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {sphere ? (
              <div className={s.sphereContainer}>
                {React.createElement(subjectIcons[sphere.icon] || Book)}
                <span className={s.sphereLabel}>{sphere.name}</span>
              </div>
            ) : (
              "Select Sphere"
            )}
            <span className={s.dropdownIcon}>▼</span>
          </div>

          {dropdownOpen && (
            <ul className={s.customDropdown}>
              {spheres.map((item) => {
                const IconComponent = subjectIcons[item.icon] || Book;
                return (
                  <li key={item.id} onClick={() => handleSelectSphere(item)}>
                    <IconComponent />
                    <span className={s.sphereLabel}>{item.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          className={s.modalButton}
          onClick={handleCreateCourse}
          disabled={!name.trim() || !sphere}
        >
          create
        </button>
      </div>
    </div>
  );
};

export default CreateCourseModal;
