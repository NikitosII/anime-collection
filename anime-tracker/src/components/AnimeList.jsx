import { AnimeCard } from './AnimeCard';
import { Plus, Loader } from 'lucide-react';

export const AnimeList = ({ 
  animes, 
  loading, 
  error, 
  onAddAnime,
  onEditAnime,
  onDeleteAnime 
}) => {
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size={32} className="animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading anime...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Anime Collection</h2>
          <p className="text-gray-600">
            {animes.length} anime found
          </p>
        </div>
        <button
          onClick={onAddAnime}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Anime
        </button>
      </div>

      {animes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No anime found</div>
          <p className="text-gray-400 mt-2">Try adjusting your filters or add a new anime</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {animes.map(anime => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              onEdit={onEditAnime}
              onDelete={onDeleteAnime}
            />
          ))}
        </div>
      )}
    </div>
  );
};