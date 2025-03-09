import React, { useState, useEffect } from "react";
import s from "./Modal.module.sass";
import axios from "../../axios";
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

const CreateModuleModal = ({ isOpen, onClose, onCreate }) => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [sphere, setSphere] = useState(null);
  const [course, setCourse] = useState(null);

  // Храним сферы, курсы и модули
  const [spheres, setSpheres] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]); // ← Добавили стейт для модулей

  // Раскрытие выпадающего списка
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // -------------------------------------------------
  // 1. Загружаем список сфер
  // -------------------------------------------------
  useEffect(() => {
    const fetchSpheres = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get("/sphere/get_spheres", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpheres(response.data.spheres);
      } catch (error) {
        console.error("Ошибка загрузки сфер:", error);
      }
    };

    fetchSpheres();
  }, []);

  // -------------------------------------------------
  // 2. Загружаем курсы по выбранной сфере
  // -------------------------------------------------
  useEffect(() => {
    if (!sphere) return;

    const fetchCourses = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`/course/${sphere.id}/get_courses`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.courses);
        console.log("Курсы по сфере:", response.data);
      } catch (error) {
        console.error("Ошибка загрузки курсов:", error);
      }
    };

    fetchCourses();
  }, [sphere]);

  // -------------------------------------------------
  // 3. Загружаем модули по выбранному курсу
  // -------------------------------------------------
  useEffect(() => {
    if (!course?.id) return; // Если курс не выбран — выходим

    const fetchModules = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`/module/get_modules/${course.id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Список модулей для курса:", response.data);
        setModules(response.data.modules || []); // Сохраняем модули в стейт
      } catch (error) {
        console.error("Ошибка получения модулей:", error);
      }
    };

    fetchModules();
  }, [course]);

  // -------------------------------------------------
  // 4. Когда модули загрузились, берём первый и делаем fetchModule
  // -------------------------------------------------
  useEffect(() => {
    if (modules.length === 0) return; // Если нет модулей, выходим

    // Допустим, нам нужен первый модуль:
    const firstModule = modules[0];
    // firstModule.id = 19, firstModule.module_id = 38 (по вашему скриншоту)
    // Обычно "id" — это и есть primary key, но ваш бэкенд может ожидать именно module_id
    // Посмотрите, что нужно в вашем случае. Предположим, что /module/get_module/38

    const fetchModuleById = async (modId) => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`/module/get_module/${modId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Детали модуля (fetchModuleById):", response.data);
      } catch (error) {
        console.error("Ошибка получения модуля:", error);
      }
    };

    // Предположим, что нужно вызывать /module/get_module/firstModule.module_id
    // Если нужно по "id", то поменяйте на firstModule.id
    fetchModuleById(firstModule.id);
  }, [modules]);

  // -------------------------------------------------
  // 5. Создание нового module
  // -------------------------------------------------
  const handleCreateModule = async () => {
    if (!course) return;
    const token = localStorage.getItem("access_token");

    const requestData = {
      name: course.name,
      link: youtubeLink,
      module_id: course.id,
    };

    try {
      const response = await axios.post("/module/create_module", requestData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("module создан:", response.data);
      // Добавляем новый "курс" (по факту это module) в список
      // если нужно — или пересобираем данные
      // setCourses([...courses, response.data]);

      // Ставим его "текущим"
      setCourse(response.data);
    } catch (error) {
      console.error("Ошибка при создании module:", error);
    }
  };

  // -------------------------------------------------
  // 6. Выбор сферы
  // -------------------------------------------------
  const handleSelectSphere = (item) => {
    setSphere(item);
    setDropdownOpen(false);
    setCourse(null);
    setCourses([]);
    setModules([]); // очищаем модули
  };

  // -------------------------------------------------
  // 7. Если окно закрыто — ничего не рендерим
  // -------------------------------------------------
  if (!isOpen) return null;

  // -------------------------------------------------
  // 8. Возвращаем JSX
  // -------------------------------------------------
  return (
    <div className={s.modal}>
      <div className={s.modalContent}>
        <span className={s.modalClose} onClick={onClose}>
          ×
        </span>
        <h2 className={s.modalTitle}>
          New <span>Module</span>
        </h2>

        <input
          type="text"
          className={s.modalInput}
          placeholder="YouTube link"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
        />

        <div className={s.text}>
          <p>+PDF</p>
          <p>+Video/Audio</p>
        </div>

        <img src="/images/icons/Line 63.svg" className={s.lineModule} alt="" />

        {/* Выбор сферы */}
        <div className={s.customSelect}>
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

        {/* Выбор курса */}
        {sphere && (
          <div className={s.customSelect}>
            <select
              className={s.modalInput}
              value={course ? course.id : ""}
              onChange={(e) => {
                const selectedCourse = courses.find(
                  (c) => c.id === parseInt(e.target.value)
                );
                setCourse(selectedCourse || null);
              }}
            >
              <option value="" disabled>
                Select Course
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className={s.modalButton}
          onClick={handleCreateModule}
          disabled={!youtubeLink.trim() || !course || !sphere}
        >
          Create Module
        </button>
      </div>
    </div>
  );
};

export default CreateModuleModal;
