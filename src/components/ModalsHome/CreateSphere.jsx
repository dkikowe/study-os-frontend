import React, { useState } from "react";
import axios from "../../axios";
import s from "./Modal.module.sass";

const CreateSphereModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token"); // Получаем токен

      const { data } = await axios.post(
        "/sphere/create_sphere",
        { name, icon: "" },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Передаем токен
          },
          withCredentials: true, // Отправляем куки
        }
      );

      onCreate(data);
      setName("");
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
        <img src="/images/icons/icon.svg" alt="" />
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
          disabled={!name.trim() || loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};

export default CreateSphereModal;
