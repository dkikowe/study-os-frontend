import axios from "axios";

const instance = axios.create({
  baseURL: "http://146.103.33.232:8000", // Замените на адрес вашего API
  withCredentials: true, // браузер автоматически отправляет куки
});

// Интерсептор для обработки ответа
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 && // Ошибка авторизации
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Получаем access token из куки
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_access_token="))
        ?.split("=")[1];

      // Проверяем, просрочен ли access token
      let isAccessTokenExpired = true;
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          const now = Math.floor(Date.now() / 1000);
          isAccessTokenExpired = payload.exp <= now;
        } catch (err) {
          console.error("Ошибка декодирования access token:", err);
          isAccessTokenExpired = true;
        }
      } else {
        // Если access token не найден — считаем его просроченным
        isAccessTokenExpired = true;
      }

      // Если access token еще действителен, то, возможно, ошибка вызвана чем-то иным
      if (!isAccessTokenExpired) {
        return Promise.reject(error);
      }

      // Получаем refresh token из куки
      const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_refresh_token="))
        ?.split("=")[1];

      if (!refreshToken) {
        return Promise.reject(new Error("Refresh token not found"));
      }

      try {
        // Запрос на обновление токенов — сервер должен вернуть новые куки
        await instance.post("/refresh_token", null, { withCredentials: true });
        // После успешного обновления повторяем исходный запрос
        return instance(originalRequest);
      } catch (refreshError) {
        // Ошибка при обновлении токенов
        return Promise.reject(refreshError);
      }
    }

    // Обработка других ошибок
    return Promise.reject(error);
  }
);

export default instance;
