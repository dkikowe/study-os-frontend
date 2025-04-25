import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Импортируем хук для навигации
import axios from "../../axios.js"; // импорт axios
import s from "./Courses.module.sass";

// Функция для извлечения идентификатора YouTube из URL
function extractYoutubeId(url) {
  // Формат: https://www.youtube.com/watch?v=GeulXZP_kZ8
  let match = url.match(/[?&]v=([^?&]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Формат: https://youtu.be/GeulXZP_kZ8
  match = url.match(/youtu\.be\/([^?&]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Формат: https://www.youtube.com/embed/GeulXZP_kZ8
  match = url.match(/youtube\.com\/embed\/([^?&]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

function ModuleCard({ module, sphereId }) {
  const [topicCount, setTopicCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get(`/topic/get_topics/${module.id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Предполагается, что API возвращает объект { topics: [...] }
        const topics = res.data?.topics || [];
        setTopicCount(topics.length);
      })
      .catch((err) => {
        console.error(
          `Ошибка при получении топиков для модуля ${module.id}:`,
          err
        );
      });
  }, [module.id]);

  // Если у модуля есть ссылка, пытаемся извлечь из неё YouTube videoId
  const videoId = module.link ? extractYoutubeId(module.link) : null;
  // Если videoId найден, формируем URL превью, иначе используем дефолтное изображение
  const previewUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "/images/sphere-icons/module.svg";

  return (
    // При клике переходим на страницу модуля по его id
    <div
      className={s.moduleCard}
      onClick={() =>
        navigate(`/module/${module.id}`, {
          state: { sphereId: sphereId },
        })
      }
    >
      <img src={previewUrl} alt="module preview" />
      <div className={s.text}>
        <p className={s.moduleName}>{module.name}</p>
        <div className={s.sessionsQuantity}>
          <img src="/images/icons/clocks.svg" alt="clock icon" />
          <p>{topicCount} sessions</p>
        </div>
      </div>
    </div>
  );
}

export default function Courses({ sphereId }) {
  const [courses, setCourses] = useState([]);
  // Для хранения модулей каждого курса: { [courseId]: [массив модулей] }
  const [modulesByCourse, setModulesByCourse] = useState({});

  // Запрашиваем курсы по ID сферы
  useEffect(() => {
    if (!sphereId) return;

    const token = localStorage.getItem("access_token");
    axios
      .get(`/course/${sphereId}/get_courses`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.courses) {
          setCourses(res.data.courses);
        } else {
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("Ошибка при получении курсов:", err);
      });
  }, [sphereId]);

  // Функция для запроса модулей по курсу
  const fetchModulesForCourse = (courseId) => {
    const token = localStorage.getItem("access_token");
    axios
      .get(`/module/get_modules/${courseId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(`Модули для курса ID=${courseId}:`, res.data);
        let modules = [];
        if (res.data?.modules) {
          modules = res.data.modules;
        } else if (Array.isArray(res.data)) {
          modules = res.data;
        }
        setModulesByCourse((prev) => ({
          ...prev,
          [courseId]: modules,
        }));
      })
      .catch((err) => {
        console.error(
          `Ошибка при получении модулей для курса ${courseId}:`,
          err
        );
      });
  };

  // После загрузки курсов сразу запрашиваем модули для каждого курса
  useEffect(() => {
    if (courses.length > 0) {
      courses.forEach((course) => {
        fetchModulesForCourse(course.id);
      });
    }
  }, [courses]);

  return (
    <div className={s.container}>
      {courses.map((course) => {
        const courseModules = modulesByCourse[course.id] || [];

        return (
          <div key={course.id} className={s.courseContainer}>
            <div className={s.headName}>
              <p className={s.courseName}>
                {course.name} <p className={s.div}>|</p> <span>Course</span>
              </p>
              <div className={s.icon}>
                <button
                  className={s.openCourse}
                  onClick={() => fetchModulesForCourse(course.id)}
                >
                  open course
                </button>
                <img src="/images/iconsModule/settings.svg" alt="settings" />
              </div>
            </div>

            {courseModules.length > 0 ? (
              <div className={s.moduleCards}>
                {courseModules.map((module, index) => (
                  <ModuleCard
                    key={module.id || index}
                    module={module}
                    sphereId={sphereId}
                  />
                ))}
              </div>
            ) : (
              <p className={s.moduleName}>No modules loaded</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
