import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

const STATUS_OPTIONS = ['Planned', 'Watching', 'Completed', 'Dropped'];
const GENRE_OPTIONS = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Slice of Life', 'Thriller'];

export const AnimeForm = ({ anime, onSubmit, onCancel, onUploadImage }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'Planned',
    rating: 0,
    genres: [],
    image: '',
  });
  const [customGenre, setCustomGenre] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (anime) {
      setFormData({
        title: anime.title,
        status: anime.status,
        rating: anime.rating,
        genres: anime.genres || [],
        imageUrl: anime.image || '',
      });
      if (anime.image) {
        const fullImageUrl = anime.image.startsWith('http')
          ? anime.image
          : `http://localhost:5123${anime.image}`;
        setImagePreview(fullImageUrl);
      }
    }
  }, [anime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const result = await onUploadImage(file);
      console.log('Upload result:', result);

      // Обрабатываем разные форматы ответа
      let imageUrl = '';
      if (typeof result === 'string') {
        imageUrl = result;
      } else if (result && result.imageUrl) {
        imageUrl = result.imageUrl;
      } else if (result && result.Image) {
        imageUrl = result.Image;
      }

      console.log('Final image URL:', imageUrl);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image: ' + error.message);
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const addCustomGenre = () => {
    if (customGenre.trim() && !formData.genres.includes(customGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, customGenre.trim()]
      }));
      setCustomGenre('');
    }
  };

  const removeGenre = (genreToRemove) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(genre => genre !== genreToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anime Image
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload size={24} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
        {uploading && (
          <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter anime title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
            className="flex-1"
          />
          <span className="text-lg font-semibold text-blue-600 min-w-[40px]">
            {formData.rating}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genres
        </label>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {GENRE_OPTIONS.map(genre => (
            <label key={genre} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.genres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
                className="rounded text-blue-600"
              />
              <span className="text-sm">{genre}</span>
            </label>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={customGenre}
            onChange={(e) => setCustomGenre(e.target.value)}
            placeholder="Add custom genre"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addCustomGenre}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Add
          </button>
        </div>

        {formData.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.genres.map(genre => (
              <span
                key={genre}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {genre}
                <button
                  type="button"
                  onClick={() => removeGenre(genre)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {anime ? 'Update Anime' : 'Add Anime'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};