import React, { useState, useRef, useEffect } from "react";
import s from "./Modal.module.sass";

const spheres = [
  { value: "ai", label: "AI", icon: "/images/icons/AI.svg" },
  { value: "biology", label: "Biology", icon: "/images/icons/Biology.svg" },
  { value: "math", label: "Math", icon: "/images/icons/Math.svg" },
  { value: "english", label: "English", icon: "/images/icons/Languages.svg" },
  { value: "new", label: "New sphere", icon: "/images/icons/plusik.svg" },
];

const CreateModuleModal = ({ isOpen, onClose, onCreate }) => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [sphere, setSphere] = useState("");
  const [course, setCourse] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelectSphere = (value) => {
    setSphere(value);
    setDropdownOpen(false);
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

        {/* Кастомный Select */}
        <div className={s.customSelect} ref={dropdownRef}>
          <div
            className={s.selectedOption}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {sphere ? (
              <>
                <img
                  src={spheres.find((item) => item.value === sphere)?.icon}
                  alt={sphere}
                  className={s.selectedIcon}
                />
                {spheres.find((item) => item.value === sphere)?.label}
              </>
            ) : (
              "Select Sphere"
            )}
            <span className={s.dropdownIcon}>▼</span>
          </div>
          {dropdownOpen && (
            <ul className={s.customDropdown}>
              {spheres.map((item) => (
                <li
                  key={item.value}
                  onClick={() => handleSelectSphere(item.value)}
                >
                  <img src={item.icon} alt={item.label} />
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="text"
          className={s.modalInput}
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button
          className={s.modalButton}
          onClick={() => onCreate(youtubeLink, sphere, course)}
          disabled={!youtubeLink.trim() || !sphere.trim() || !course.trim()}
        >
          create
        </button>
      </div>
    </div>
  );
};

export default CreateModuleModal;
