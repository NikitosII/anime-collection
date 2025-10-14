import { useState, useEffect } from 'react';
import { animeAPI } from '../services/AnimeApi';

export const useAnime = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchAnime = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const backendParams = {
        Search: filters.Search || filters.search || filters.title || '',
        SortBy: filters.SortBy || filters.sortBy || 'title',
        SortDesc: filters.SortDesc || filters.sortDesc || false,
        Page: filters.Page || filters.page || pagination.page,
        Count: filters.Count || filters.pageSize || pagination.pageSize,
      };

      const response = await animeAPI.getAnime(backendParams);
      console.log('API response:', response);

      // Обрабатываем ответ в формате PaginResponse
      if (response && response.data && Array.isArray(response.data)) {
        const animeList = response.data;
        console.log('Processed anime list:', animeList);

        setAnimes(animeList);
        setPagination(prev => ({
          ...prev,
          page: response.page || backendParams.Page,
          totalCount: response.totalCount || 0,
          totalPages: response.totalPages || 1,
        }));
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Unexpected response format from server');
      }
    } catch (err) {
      console.error('Error fetching anime:', err);
      setError(err.message);
      setAnimes([]);
    } finally {
      setLoading(false);
    }
  };

  const searchAnime = async (searchTerm) => {
    console.log('🔍 Searching for:', searchTerm);
    await fetchAnime({
      Search: searchTerm,
      Page: 1, // Сбрасываем на первую страницу при поиске
    });
  };

  const createAnime = async (animeData) => {
    try {
      const newAnime = await animeAPI.createAnime(animeData);
      await fetchAnime();
      return newAnime;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateAnime = async (id, animeData) => {
    try {
      const updatedAnime = await animeAPI.updateAnime(id, animeData);
      await fetchAnime();
      return updatedAnime;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAnime = async (id) => {
    try {
      await animeAPI.deleteAnime(id);
      await fetchAnime();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const uploadImage = async (file) => {
    try {
      const result = await animeAPI.uploadImage(file);
      return result.imageUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  return {
    animes,
    loading,
    error,
    pagination,
    fetchAnime,
    searchAnime,
    createAnime,
    updateAnime,
    deleteAnime,
    uploadImage,
  };
};