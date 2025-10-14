const API_BASE = 'http://localhost:5123';

// Функция для обработки ошибок HTTP
const handleResponse = async (response) => {
  console.log('API Response:', {
    status: response.status,
    statusText: response.statusText,
    url: response.url
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorText = await response.text();
      console.log('API Error response text:', errorText);

      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          // Если это ошибка валидации с массивом errors
          if (errorData.errors) {
            const validationErrors = Object.values(errorData.errors).flat();
            errorMessage = `Validation errors: ${validationErrors.join(', ')}`;
          }
          // Если это строка с ошибкой
          else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
          // Если это объект с полем error
          else if (errorData.error) {
            errorMessage = errorData.error;
          }
          else {
            errorMessage = errorText;
          }
        } catch {
          errorMessage = errorText || errorMessage;
        }
      }
    } catch (e) {
      console.error('Error reading error response:', e);
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return { success: true };
  }

  try {
    const data = await response.json();
    console.log('API Success response:', data);
    return data;
  } catch (e) {
    console.error('Error parsing JSON response:', e);
    throw new Error('Failed to parse response JSON');
  }
};


export const animeAPI = {
  async getAnime(params = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    // Используем правильный endpoint для фильтрации
    const url = `${API_BASE}/anime/filter?${queryParams}`;
    console.log('Making GET request to:', url);
    console.log('Query params:', Object.fromEntries(queryParams));

    const response = await fetch(url);
    return handleResponse(response);
  },


  // Получить аниме по ID
  async getAnimeById(id) {
    const url = `${API_BASE}/anime/${id}`;
    console.log('Making GET request to:', url);

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Создать новое аниме
  async createAnime(animeData) {
    const url = `${API_BASE}/anime`;
    console.log('Making POST request to:', url, animeData);

    // Используем Image вместо imageUrl
    const requestData = {
      Title: animeData.title,
      Status: animeData.status,
      Rating: animeData.rating,
      Genres: animeData.genres,
      Image: animeData.imageUrl || "" // Отправляем как Image
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    return handleResponse(response);
  },

  // Обновить аниме
  async updateAnime(id, animeData) {
    const url = `${API_BASE}/anime/${id}`;
    console.log('Making PUT request to:', url, animeData);

    const requestData = {
      Title: animeData.title,
      Status: animeData.status,
      Rating: animeData.rating,
      Genres: animeData.genres,
      Image: animeData.imageUrl || "" 
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    return handleResponse(response);
  },

  // Удалить аниме
  async deleteAnime(id) {
    const url = `${API_BASE}/anime/${id}`;
    console.log('Making DELETE request to:', url);

    const response = await fetch(url, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Загрузить изображение
  async uploadImage(file) {
    const url = `${API_BASE}/fileupload/upload`;
    console.log('Making FILE UPLOAD request to:', url);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const result = await handleResponse(response);
      console.log('Upload response result:', result);

      // Обрабатываем разные возможные форматы ответа
      if (result && (result.imageUrl || result.Image)) {
        return result.imageUrl || result.Image;
      } else if (typeof result === 'string') {
        return result;
      } else {
        console.error('Unexpected upload response format:', result);
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Upload error in api.js:', error);
      throw error;
    }
  },
};