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
  const [error, setError] = useState("");

  const [spheres, setSpheres] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
      } catch (error) {
        console.error("Ошибка загрузки курсов:", error);
      }
    };

    fetchCourses();
  }, [sphere]);

  useEffect(() => {
    if (!course?.id) return;
    const fetchModules = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`/module/get_modules/${course.id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setModules(response.data.modules || []);
      } catch (error) {
        console.error("Ошибка получения модулей:", error);
      }
    };

    fetchModules();
  }, [course]);

  useEffect(() => {
    if (modules.length === 0) return;
    const firstModule = modules[0];
    const fetchModuleById = async (modId) => {
      const token = localStorage.getItem("access_token");
      try {
        await axios.get(`/module/get_module/${modId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Ошибка получения модуля:", error);
      }
    };

    fetchModuleById(firstModule.id);
  }, [modules]);

  const validateYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleYoutubeLinkChange = (e) => {
    const value = e.target.value;
    setYoutubeLink(value);
    setError("");

    if (value && !validateYoutubeUrl(value)) {
      setError("Please enter a valid YouTube video link");
    }
  };

  const handleCreateModule = async () => {
    if (!course) return;
    if (!validateYoutubeUrl(youtubeLink)) {
      setError("Please enter a valid YouTube video link");
      return;
    }

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

      setCourse(response.data);
      setSuccessMessage("Your module will be ready within a few minutes");
      setYoutubeLink("");
      setSphere(null);
      setCourse(null);
      setCourses([]);
      setModules([]);
      setError("");
    } catch (error) {
      console.error("Ошибка при создании module:", error);
      setError("An error occurred while creating the module");
    }
  };

  const handleSelectSphere = (item) => {
    setSphere(item);
    setDropdownOpen(false);
    setCourse(null);
    setCourses([]);
    setModules([]);
    setSuccessMessage(""); // сбрасываем сообщение
  };

  if (!isOpen) return null;

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
          className={`${s.modalInput} ${error ? s.error : ""}`}
          placeholder="YouTube link"
          value={youtubeLink}
          onChange={handleYoutubeLinkChange}
        />
        {error && <p className={s.errorMessage}>{error}</p>}

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

        {successMessage && <p className={s.successMessage}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default CreateModuleModal;
