import { useState, useEffect } from "react";
import { searchFoodDatabase, addCustomFood } from "../utils/storage";

const FoodSearch = ({ onSelectFood, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: "",
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchFoodDatabase(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSelectFood = (food) => {
    onSelectFood(food);
    onClose();
  };

  const handleAddCustom = () => {
    if (customFood.name) {
      const newFood = addCustomFood(customFood);
      if (newFood) {
        handleSelectFood(customFood);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b-2 border-teal-800 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-teal-800">
              Search Food Database
            </h2>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for food..."
            className="w-full p-3 border-2 border-teal-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            autoFocus
          />
        </div>

        <div className="p-4">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-teal-800 mb-2">
                Search Results:
              </h3>
              {searchResults.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className="p-3 border-2 border-teal-200 rounded hover:bg-teal-50 cursor-pointer transition-colors"
                >
                  <div className="font-semibold text-teal-900">{food.name}</div>
                  <div className="text-sm text-gray-600">
                    P: {food.protein}g | F: {food.fat}g | C: {food.carbs}g |
                    Cal: {food.protein * 4 + food.fat * 9 + food.carbs * 4}
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <p className="text-gray-500 text-center py-4">
              No foods found matching "{searchQuery}"
            </p>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Start typing to search for foods
            </p>
          )}

          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <button
              onClick={() => setShowAddCustom(!showAddCustom)}
              className="w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700 transition-all duration-300"
            >
              {showAddCustom ? "Cancel" : "➕ Add Custom Food"}
            </button>

            {showAddCustom && (
              <div className="mt-4 p-4 bg-teal-50 rounded border-2 border-teal-200">
                <h3 className="font-semibold text-teal-800 mb-3">
                  Add Custom Food
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Food name"
                    value={customFood.name}
                    onChange={(e) =>
                      setCustomFood({ ...customFood, name: e.target.value })
                    }
                    className="w-full p-2 border-2 border-teal-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      placeholder="Protein (g)"
                      value={customFood.protein}
                      onChange={(e) =>
                        setCustomFood({
                          ...customFood,
                          protein: Number(e.target.value) || 0,
                        })
                      }
                      className="p-2 border-2 border-teal-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <input
                      type="number"
                      placeholder="Fat (g)"
                      value={customFood.fat}
                      onChange={(e) =>
                        setCustomFood({
                          ...customFood,
                          fat: Number(e.target.value) || 0,
                        })
                      }
                      className="p-2 border-2 border-teal-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <input
                      type="number"
                      placeholder="Carbs (g)"
                      value={customFood.carbs}
                      onChange={(e) =>
                        setCustomFood({
                          ...customFood,
                          carbs: Number(e.target.value) || 0,
                        })
                      }
                      className="p-2 border-2 border-teal-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                  <button
                    onClick={handleAddCustom}
                    disabled={!customFood.name}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Add & Use
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSearch;
