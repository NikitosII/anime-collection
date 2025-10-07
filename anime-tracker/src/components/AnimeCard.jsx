import { Edit3, Trash2, Star, Calendar, Image as ImageIcon } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusColors = {
    Planned: 'bg-blue-100 text-blue-800',
    Watching: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    Dropped: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

export const AnimeCard = ({ anime, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {anime.image ? ( 
          <img
            src={`http://localhost:5123${anime.image}`} 
            alt={anime.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon size={48} />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {anime.title}
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(anime)}
              className="text-blue-600 hover:text-blue-800 transition-colors p-1"
              title="Edit"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDelete(anime.id)}
              className="text-red-600 hover:text-red-800 transition-colors p-1"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={anime.status} />
            <div className="flex items-center text-amber-500">
              <Star size={16} className="fill-current" />
              <span className="ml-1 text-sm font-medium">{anime.rating}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={14} className="mr-1" />
            {new Date(anime.createdAt).toLocaleDateString()}
          </div>

          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {anime.genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};