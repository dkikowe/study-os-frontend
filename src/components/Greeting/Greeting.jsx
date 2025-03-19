import { useState, useEffect } from "react";
import s from "./Greeting.module.sass";
import axios from "../../axios";
import CreateCourseModal from "../ModalsHome/CreateCourse";
import CreateModuleModal from "../ModalsHome/CreateModule";
import CreateSphereModal from "../ModalsHome/CreateSphere";

export default function Greeting() {
  const handleCreateSphere = (newSphere) => {
    console.log("Создана новая сфера:", newSphere);
  };
  const handleCreateCourse = (newCourse) => {
    console.log("Создан курс", newCourse);
  };

  const [openModal, setOpenModal] = useState(null);
  const [recentPages, setRecentPages] = useState([]);

  useEffect(() => {
    const fetchRecentPages = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post("/last_recently", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecentPages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecentPages();
  }, []);

  return (
    <div className={s.container}>
      <div className={s.headerResponsive}>
        <p className={s.studyOs}>
          Study <span>OS</span>
        </p>
        <img src="/images/icons/avatar.svg" className={s.avatar} alt="" />
      </div>
      <hr />
      <h1 className={s.text}>
        Good afternoon, <span>Ivan!</span>
      </h1>

      <div className={s.recently}>
        <img src="/images/icons/clocks.svg" alt="" />
        <p className={s.recentlyText}>Recently visited</p>
      </div>

      <div className={s.cards}>
        {recentPages.length === 0 ? (
          <p className={s.recentPagesText}>No recent pages.</p>
        ) : (
          recentPages.map((page) => (
            <div key={page.id} className={s.card}>
              <img src={page.image} alt={page.title} className={s.cardImage} />
              <h2 className={s.cardTitle}>{page.title}</h2>
              <div className={s.cardInfo}>
                <p className={s.cardInfoText}>Session</p>
                <p className={s.cardInfoTimeText}>{page.last_visited}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={s.creatings}>
        <div className={s.create} onClick={() => setOpenModal("sphere")}>
          <img src="/images/icons/plusik.svg" alt="" />
          <p className={s.textSphere}>Create sphere</p>
        </div>
        <div className={s.create} onClick={() => setOpenModal("course")}>
          <img src="/images/icons/plusik.svg" alt="" />
          <p className={s.textSphere}>Create course</p>
        </div>
        <div className={s.create} onClick={() => setOpenModal("module")}>
          <img src="/images/icons/plusik.svg" alt="" />
          <p className={s.textSphere}>Create module</p>
        </div>
      </div>

      <CreateSphereModal
        isOpen={openModal === "sphere"}
        onClose={() => setOpenModal(null)}
        onCreate={handleCreateSphere}
      />

      <CreateCourseModal
        isOpen={openModal === "course"}
        onClose={() => setOpenModal(null)}
        onCreate={handleCreateCourse}
      />
      <CreateModuleModal
        isOpen={openModal === "module"}
        onClose={() => setOpenModal(null)}
      />
    </div>
  );
}
