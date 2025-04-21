import { useState, useEffect } from "react";
import axios from "../../axios.js";
import s from "./Dropdown.module.sass";

// Принимаем пропс onCardSelect для передачи выбранного card id и данных.
const SpheresDropdown = ({ onCardSelect }) => {
  const [data, setData] = useState([]);
  // activePath – массив id от корня до выбранного (активного) элемента
  const [activePath, setActivePath] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Получение данных с сервера
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      try {
        // 1) Получаем список сфер
        const { data: responseData } = await axios.get("/sphere/get_spheres", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const spheres = Array.isArray(responseData)
          ? responseData
          : responseData.spheres;

        const spheresWithNested = await Promise.all(
          spheres.map(async (sphere) => {
            // 2) Для каждой сферы получаем курсы
            const { data: coursesData } = await axios.get(
              `/course/${sphere.id}/get_courses`,
              {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const courses = Array.isArray(coursesData)
              ? coursesData
              : coursesData.courses;

            const coursesWithModules = await Promise.all(
              courses.map(async (course) => {
                // 3) Для каждого курса получаем модули
                const { data: modulesData } = await axios.get(
                  `/module/get_modules/${course.id}`,
                  {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                const modules = Array.isArray(modulesData)
                  ? modulesData
                  : modulesData.modules;

                const modulesWithTopics = await Promise.all(
                  modules.map(async (module) => {
                    // 4) Для каждого модуля получаем топики
                    const { data: topicsData } = await axios.get(
                      `/topic/get_topics/${module.id}`,
                      {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    const topics = Array.isArray(topicsData)
                      ? topicsData
                      : topicsData.topics;

                    // 5) Для каждого топика получаем карточки
                    const topicsWithCards = await Promise.all(
                      topics.map(async (topic) => {
                        const { data: cardsData } = await axios.get(
                          `/card/get_cards/${topic.id}`,
                          {
                            withCredentials: true,
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        const cards = Array.isArray(cardsData)
                          ? cardsData
                          : cardsData.cards;
                        return { ...topic, cards, isOpen: false };
                      })
                    );
                    return {
                      ...module,
                      topics: topicsWithCards,
                      isOpen: false,
                    };
                  })
                );
                return { ...course, modules: modulesWithTopics, isOpen: false };
              })
            );
            return { ...sphere, courses: coursesWithModules, isOpen: false };
          })
        );
        setData(spheresWithNested);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  // Обработчик клика – обновляем активный путь.
  // Если клик по уже активному элементу – сворачиваем его,
  // иначе устанавливаем путь от корня до этого элемента.
  const handleItemClick = (item, currentPath) => {
    if (activePath.join("-") === currentPath.join("-")) {
      setActivePath(currentPath.slice(0, currentPath.length - 1));
    } else {
      setActivePath(currentPath);
    }
  };

  // Вспомогательные функции для работы с данными
  const hasChildren = (item) =>
    (item.courses && item.courses.length > 0) ||
    (item.modules && item.modules.length > 0) ||
    (item.topics && item.topics.length > 0) ||
    (item.cards && item.cards.length > 0);

  const getChildren = (item) => {
    if (item.courses) return item.courses;
    if (item.modules) return item.modules;
    if (item.topics) return item.topics;
    if (item.cards) return item.cards;
    return [];
  };

  // Для всех уровней, кроме карточек, используется поле name
  const getTitle = (item) => item.name ?? "Без названия";

  // Рекурсивный рендер элемента.
  // level – глубина вложенности.
  // currentPath – путь (массив id) от корня до текущего элемента.
  // На уровне 3 (топики) выводим "Session N", на уровне 4 (карточки) – "Card N".
  const renderItem = (item, level = 0, index = 0, currentPath = []) => {
    const newPath = [...currentPath, item.id];
    // Элемент открыт, если его путь является префиксом activePath
    const isOpen =
      activePath.slice(0, newPath.length).join("-") === newPath.join("-");
    // Элемент активный, если его путь совпадает с activePath полностью
    const isActive = activePath.join("-") === newPath.join("-");

    let title;
    if (level === 3) {
      title = `Session ${index + 1}`;
    } else if (level === 4) {
      title = `Card ${index + 1}`;
    } else {
      title = getTitle(item);
    }

    return (
      <div key={item.id} className={s.item}>
        <div
          className={`${s.itemHeader} ${isActive ? s.active : ""} ${
            !isActive && isOpen ? s.inactive : ""
          }`}
          onClick={() => {
            // Если это карточка (level 4), передаём card id и объект
            if (level === 4 && onCardSelect) {
              onCardSelect(item.id, index + 1, item);
              setActivePath(newPath);
            } else {
              handleItemClick(item, newPath);
            }
          }}
        >
          {hasChildren(item) && (
            <img
              src="/images/notes-icons/arrowDown.svg"
              alt=""
              className={isOpen ? s.rotated : ""}
            />
          )}
          <span>{title}</span>
        </div>

        {isOpen && hasChildren(item) && (
          <div className={s.subItems}>
            {getChildren(item).map((child, i) =>
              renderItem(child, level + 1, i, newPath)
            )}
          </div>
        )}
      </div>
    );
  };

  // Фильтрация (поиск) – оставляем без изменений
  const filterData = (items, query) => {
    if (!query) return items;
    return items.reduce((acc, item) => {
      const itemTitle = getTitle(item).toLowerCase();
      const match = itemTitle.includes(query.toLowerCase());
      let children = [];
      if (hasChildren(item)) {
        children = filterData(getChildren(item), query);
      }
      if (match || children.length > 0) {
        const newItem = { ...item };
        if (children.length > 0) {
          if (newItem.courses) newItem.courses = children;
          else if (newItem.modules) newItem.modules = children;
          else if (newItem.topics) newItem.topics = children;
          else if (newItem.cards) newItem.cards = children;
        }
        acc.push(newItem);
      }
      return acc;
    }, []);
  };

  const filteredData = searchQuery ? filterData(data, searchQuery) : data;

  return (
    <div className={s.container}>
      <div className={s.searchFrame}>
        <input
          type="text"
          placeholder="Search"
          className={s.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={s.searchIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#B8B8B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.7 16.7"
              stroke="#B8B8B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className={s.list}>
        {filteredData.length > 0 ? (
          filteredData.map((item, i) => renderItem(item, 0, i))
        ) : (
          <div className={s.noResults}>Ничего не найдено</div>
        )}
      </div>
    </div>
  );
};

export default SpheresDropdown;
