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
          errorMessage = errorData.message || errorData.title || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
      }
    } catch (e) {
      console.error('Error reading error response:', e);
    }
    
    throw new Error(errorMessage);
  }
  
  // Для пустых ответов 
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
  // Получить все аниме с фильтрацией
    async getAnime(params = {}) {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        const url = `${API_BASE}/anime?${queryParams}`; 
        console.log('Making GET request to:', url);
        
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
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animeData),
    });
    return handleResponse(response);
  },

  // Обновить аниме
  async updateAnime(id, animeData) {
    const url = `${API_BASE}/anime/${id}`;
    console.log('Making PUT request to:', url, animeData);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animeData),
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

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse(response);
  },
};