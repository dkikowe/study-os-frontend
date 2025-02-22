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

  const [openModal, setOpenModal] = useState(null);
  const [recentPages, setRecentPages] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchRecentPages = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.get("/last_recently", {
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
        <img
          src="/images/icons/plusik.svg"
          className={s.img}
          alt=""
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <p className={s.studyOs}>
          Study <span>OS</span>
        </p>
        <img src="/images/icons/avatar.svg" className={s.avatar} alt="" />
      </div>

      {mobileMenuOpen && (
        <div className={s.mobileMenu}>
          <div className={s.menuItem} onClick={() => setOpenModal("sphere")}>
            Create Sphere
          </div>
          <div className={s.menuItem} onClick={() => setOpenModal("course")}>
            Create Course
          </div>
          <div className={s.menuItem} onClick={() => setOpenModal("module")}>
            Create Module
          </div>
        </div>
      )}

      <h1 className={s.text}>Good afternoon, Ivan!</h1>

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
      />
      <CreateModuleModal
        isOpen={openModal === "module"}
        onClose={() => setOpenModal(null)}
      />
    </div>
  );
}
