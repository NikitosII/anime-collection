import { useState } from 'react';
import { useAnime } from './hooks/useAnime';
import { AnimeList } from './components/AnimeList';
import { AnimeForm } from './components/AnimeForm';
import { FilterPanel } from './components/FilterPanel';
import { Pagination } from './components/Pagination';
import { Modal } from './components/Modal';

function App() {
  const {
    animes,
    loading,
    error,
    pagination,
    fetchAnime,
    createAnime,
    updateAnime,
    deleteAnime,
    uploadImage,
  } = useAnime();

  const [filters, setFilters] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState(null);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchAnime(updatedFilters);
  };

  const handlePageChange = (newPage) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    fetchAnime(updatedFilters);
  };

  const handleAddAnime = () => {
    setEditingAnime(null);
    setIsFormOpen(true);
  };

  const handleEditAnime = (anime) => {
    setEditingAnime(anime);
    setIsFormOpen(true);
  };

  const handleDeleteAnime = async (id) => {
    if (window.confirm('Are you sure you want to delete this anime?')) {
      try {
        await deleteAnime(id);
      } catch (err) {
        alert('Failed to delete anime: ' + err.message);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingAnime) {
        await updateAnime(editingAnime.id, formData);
      } else {
        await createAnime(formData);
      }
      setIsFormOpen(false);
      setEditingAnime(null);
    } catch (err) {
      alert('Failed to save anime: ' + err.message);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingAnime(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Anime Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Track and manage your anime collection
          </p>
        </header>

        <FilterPanel
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />

        <AnimeList
          animes={animes}
          loading={loading}
          error={error}
          onAddAnime={handleAddAnime}
          onEditAnime={handleEditAnime}
          onDeleteAnime={handleDeleteAnime}
        />

        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />

        <Modal
          isOpen={isFormOpen}
          onClose={handleFormCancel}
          title={editingAnime ? 'Edit Anime' : 'Add New Anime'}
        >
          <AnimeForm
            anime={editingAnime}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            onUploadImage={uploadImage}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;