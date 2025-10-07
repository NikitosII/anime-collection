import { useState, useEffect } from 'react';
import { animeAPI } from '../services/AnimeApi';

export const useAnime = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchAnime = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page: filters.page || pagination.page,
        pageSize: pagination.pageSize,
      };
      const data = await animeAPI.getAnime(params);
      setAnimes(data.data || []);
      setPagination(prev => ({
        ...prev,
        page: data.page || 1,
        totalCount: data.totalCount || 0,
        totalPages: data.totalPages || 0,
      }));
    } catch (err) {
      setError(err.message);
      setAnimes([]);
    } finally {
      setLoading(false);
    }
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
    createAnime,
    updateAnime,
    deleteAnime,
    uploadImage,
  };
};