import React, { useState } from "react";
import axios from "../../axios";
import s from "./Modal.module.sass";

// Импортируем нужные иконки из lucide-react
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

// Составляем массив иконок (добавлены новые иконки: Clipboard, PenTool, Folder, Calendar, Clock)
const subjectIcons = [
  { name: "Brain", component: Brain },
  { name: "Book", component: Book },
  { name: "BookOpen", component: BookOpen },
  { name: "GraduationCap", component: GraduationCap },
  { name: "Pencil", component: Pencil },
  { name: "Edit", component: Edit },
  { name: "Award", component: Award },
  { name: "Lightbulb", component: Lightbulb },
  { name: "Atom", component: Atom },
  { name: "FlaskConical", component: FlaskConical },
  { name: "Microscope", component: Microscope },
  { name: "Palette", component: Palette },
  { name: "Music", component: Music },
  { name: "Calculator", component: Calculator },
  { name: "Ruler", component: Ruler },
  { name: "Code", component: Code },
  { name: "Clipboard", component: Clipboard },
  { name: "PenTool", component: PenTool },
  { name: "Folder", component: Folder },
  { name: "Calendar", component: Calendar },
  { name: "Clock", component: Clock },
];

const CreateSphereModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("");
  const [showIcons, setShowIcons] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.post(
        "/sphere/create_sphere",
        { name, icon: iconName },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      onCreate(data); // Передаем созданную сферу в Nav
      setName("");
      setIconName("");
      onClose();
    } catch (error) {
      console.error("Ошибка при создании сферы:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.modal}>
      <div className={s.modalContent}>
        <span className={s.modalClose} onClick={onClose}>
          ×
        </span>
        <h2 className={s.modalTitle}>
          New <span>Sphere</span>
        </h2>

        <div
          style={{ cursor: "pointer", marginTop: "16px" }}
          onClick={() => setShowIcons(!showIcons)}
        >
          {iconName === "" ? (
            <img src="/images/icons/icon.svg" alt="Upload Icon" />
          ) : (
            React.createElement(
              subjectIcons.find((i) => i.name === iconName)?.component || Book,
              { size: 48 }
            )
          )}
        </div>

        {showIcons && (
          <div className={s.iconGrid}>
            {subjectIcons.map(({ name, component: IconComp }) => (
              <div
                key={name}
                className={`${s.iconItem} ${
                  iconName === name ? s.selected : ""
                }`}
                onClick={() => {
                  setIconName(name);
                  setShowIcons(false);
                }}
              >
                <IconComp size={32} />
              </div>
            ))}
          </div>
        )}

        <input
          type="text"
          className={s.modalInput}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className={s.modalButton}
          onClick={handleCreate}
          disabled={!name.trim() || !iconName || loading}
          style={{
            backgroundColor: !name.trim() || !iconName ? "#ccc" : "",
            cursor: !name.trim() || !iconName ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "сreating..." : "сreate"}
        </button>
      </div>
    </div>
  );
};

export default CreateSphereModal;
