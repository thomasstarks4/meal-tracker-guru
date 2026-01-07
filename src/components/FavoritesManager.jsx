import { useState, useEffect } from "react";
import { getFavorites, removeFavorite } from "../utils/storage";

const FavoritesManager = ({ onSelectMeal }) => {
  const [favorites, setFavorites] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
  };

  const handleSelectFavorite = (favorite) => {
    onSelectMeal({
      name: favorite.name,
      protein: favorite.protein,
      fat: favorite.fat,
      carbs: favorite.carbs,
    });
    setIsOpen(false);
  };

  const handleRemoveFavorite = (id, e) => {
    e.stopPropagation();
    removeFavorite(id);
    loadFavorites();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-pink-500 text-white px-3 sm:px-6 py-2 text-sm sm:text-base rounded hover:bg-pink-700 focus:ring-2 focus:ring-pink-400 transition-all duration-300 border-2 border-pink-800"
      >
        ⭐ Favorites
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b-2 border-pink-800 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-pink-800">Favorite Meals</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4">
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No favorites saved yet</p>
              <p className="text-sm mt-2">
                Add meals to favorites to quickly reuse them later!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  onClick={() => handleSelectFavorite(favorite)}
                  className="p-4 border-2 border-pink-200 rounded hover:bg-pink-50 cursor-pointer transition-colors flex justify-between items-center group"
                >
                  <div>
                    <div className="font-semibold text-pink-900">
                      {favorite.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      P: {favorite.protein}g | F: {favorite.fat}g | C:{" "}
                      {favorite.carbs}g | Cal:{" "}
                      {favorite.protein * 4 +
                        favorite.fat * 9 +
                        favorite.carbs * 4}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Added: {new Date(favorite.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveFavorite(favorite.id, e)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesManager;
