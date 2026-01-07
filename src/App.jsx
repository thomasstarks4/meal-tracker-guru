import { useState, useMemo, useEffect } from "react";
import DateNavigator from "./components/DateNavigator";
import HistoryView from "./components/HistoryView";
import WeeklySummary from "./components/WeeklySummary";
import DataManager from "./components/DataManager";
import FoodSearch from "./components/FoodSearch";
import FavoritesManager from "./components/FavoritesManager";
import MacroTargets from "./components/MacroTargets";
import Analytics from "./components/Analytics";
import { DarkModeToggle } from "./context/DarkModeContext";
import {
  getMealsForDate,
  saveMealsForDate,
  getCalorieGoalForDate,
  saveCalorieGoalForDate,
  addFavorite,
} from "./utils/storage";

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [meals, setMeals] = useState([]);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [searchingMealIndex, setSearchingMealIndex] = useState(null);

  // Load data when date changes
  useEffect(() => {
    const loadedMeals = getMealsForDate(currentDate);
    const loadedGoal = getCalorieGoalForDate(currentDate);
    setMeals(loadedMeals);
    setCalorieGoal(loadedGoal);
  }, [currentDate]);

  // Save meals whenever they change
  useEffect(() => {
    saveMealsForDate(currentDate, meals);
  }, [meals, currentDate]);

  // Save calorie goal whenever it changes
  useEffect(() => {
    saveCalorieGoalForDate(currentDate, calorieGoal);
  }, [calorieGoal, currentDate]);

  const addMeal = () => {
    setMeals([...meals, { name: "", protein: 0, fat: 0, carbs: 0 }]);
  };

  const updateMeal = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [field]: field === "name" ? value : Math.max(0, Number(value) || 0),
    };
    setMeals(updatedMeals);
  };

  const deleteMeal = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
  };

  const saveMealAsFavorite = (meal) => {
    if (meal.name && (meal.protein > 0 || meal.fat > 0 || meal.carbs > 0)) {
      addFavorite(meal);
      alert(`"${meal.name}" saved to favorites!`);
    }
  };

  const handleFoodSelect = (food) => {
    if (searchingMealIndex !== null) {
      const updatedMeals = [...meals];
      updatedMeals[searchingMealIndex] = {
        name: food.name,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
      };
      setMeals(updatedMeals);
    } else {
      setMeals([
        ...meals,
        {
          name: food.name,
          protein: food.protein,
          fat: food.fat,
          carbs: food.carbs,
        },
      ]);
    }
  };

  const handleFavoriteSelect = (meal) => {
    setMeals([...meals, { ...meal }]);
  };

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => ({
        calories:
          acc.calories + (meal.protein * 4 + meal.fat * 9 + meal.carbs * 4),
        protein: acc.protein + (meal.protein || 0),
        fat: acc.fat + (meal.fat || 0),
        carbs: acc.carbs + (meal.carbs || 0),
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  }, [meals]);

  const progress = (totals.calories / calorieGoal) * 100;
  const progressColor =
    totals.calories < calorieGoal
      ? "bg-yellow-400"
      : totals.calories <= calorieGoal + 100
      ? "bg-green-400"
      : "bg-red-400";

  const statusMessage =
    totals.calories < calorieGoal
      ? `You're ${calorieGoal - totals.calories} calories under your goal`
      : totals.calories <= calorieGoal + 100
      ? "You're within your calorie goal range!"
      : `You're ${totals.calories - calorieGoal} calories over your goal`;

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900 p-2 sm:p-6 font-sans transition-colors duration-300">
      <DarkModeToggle />

      <h1 className="text-2xl sm:text-4xl font-bold text-center text-blue-900 dark:text-blue-300 w-full bg-blue-100 dark:bg-blue-900 rounded mb-4 mx-auto p-2 sm:p-4 border-2 border-blue-800 dark:border-blue-600 shadow-lg">
        Meal Tracking Guru
      </h1>

      <DateNavigator currentDate={currentDate} onDateChange={setCurrentDate} />

      <div className="max-w-4xl mx-auto">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-4 sm:mb-6">
          <HistoryView onDateSelect={setCurrentDate} />
          <WeeklySummary currentDate={currentDate} />
          <MacroTargets totals={totals} calorieGoal={calorieGoal} />
          <Analytics currentDate={currentDate} />
          <FavoritesManager onSelectMeal={handleFavoriteSelect} />
          <button
            onClick={() => {
              setSearchingMealIndex(null);
              setShowFoodSearch(true);
            }}
            className="bg-teal-500 text-white px-3 sm:px-6 py-2 text-sm sm:text-base rounded hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 transition-all duration-300 border-2 border-teal-800"
          >
            🔍 Search Foods
          </button>
        </div>

        <DataManager />

        <div className="mb-8 text-center">
          <label className="font-bold block text-xl text-blue-800 dark:text-blue-300 mb-2">
            Today's Calorie Goal
          </label>
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) =>
              setCalorieGoal(Math.max(0, Number(e.target.value) || 2000))
            }
            className="text-center p-2 border-2 border-blue-800 dark:border-blue-600 dark:bg-gray-700 dark:text-white shadow rounded focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 hover:p-3 transition-all duration-300"
            min="0"
          />
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg border-2 border-blue-800 dark:border-blue-600 p-3 sm:p-6 mb-4 sm:mb-6 text-center sm:hover:p-8 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 text-center bg-blue-200 dark:bg-blue-900 shadow p-2 rounded">
            Meals
          </h2>
          {meals.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No meals added yet
            </div>
          ) : (
            meals.map((meal, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-3 rounded-lg mb-3 border-2 border-blue-200 dark:border-blue-600"
              >
                {/* Mobile: Stack vertically, Desktop: Grid layout */}
                <div className="flex flex-col sm:grid sm:grid-cols-11 gap-2 sm:gap-4 sm:items-center">
                  {/* Search button and Name - Mobile: row, Desktop: separate columns */}
                  <div className="flex gap-2 sm:contents">
                    <button
                      onClick={() => {
                        setSearchingMealIndex(index);
                        setShowFoodSearch(true);
                      }}
                      className="bg-teal-500 text-white p-2 rounded hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 transition-all duration-300 flex-shrink-0 sm:col-span-1 sm:self-end sm:mb-2"
                      title="Search foods"
                    >
                      🔍
                    </button>
                    <div className="flex-1 sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Meal name"
                        value={meal.name}
                        onChange={(e) => updateMeal(index, "name", e.target.value)}
                        className="w-full p-2 text-sm border border-blue-200 dark:border-blue-600 dark:bg-gray-700 dark:text-white shadow rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* Macros - Mobile: 3 columns, Desktop: separate columns */}
                  <div className="grid grid-cols-3 gap-2 sm:contents">
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Protein
                      </label>
                      <input
                        type="number"
                        placeholder="P (g)"
                        value={meal.protein}
                        onChange={(e) =>
                          updateMeal(index, "protein", e.target.value)
                        }
                        className="w-full p-2 text-sm border border-blue-200 dark:border-blue-600 dark:bg-gray-700 dark:text-white shadow rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Fat
                      </label>
                      <input
                        type="number"
                        placeholder="F (g)"
                        value={meal.fat}
                        onChange={(e) => updateMeal(index, "fat", e.target.value)}
                        className="w-full p-2 text-sm border border-blue-200 dark:border-blue-600 dark:bg-gray-700 dark:text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Carbs
                      </label>
                      <input
                        type="number"
                        placeholder="C (g)"
                        value={meal.carbs}
                        onChange={(e) => updateMeal(index, "carbs", e.target.value)}
                        className="w-full p-2 text-sm border border-blue-200 dark:border-blue-600 dark:bg-gray-700 dark:text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* Calories and actions - Mobile: row, Desktop: separate columns */}
                  <div className="flex justify-between items-center sm:contents mt-2 sm:mt-0">
                    <div className="sm:col-span-1 sm:self-end sm:mb-2">
                      <label className="block text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Cal
                      </label>
                      <div className="text-sm sm:text-base text-blue-900 dark:text-blue-300 font-medium">
                        {meal.protein * 4 + meal.fat * 9 + meal.carbs * 4}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:col-span-1 sm:self-end sm:mb-2">
                      <button
                        onClick={() => saveMealAsFavorite(meal)}
                        className="bg-pink-500 text-white p-1.5 rounded hover:bg-pink-700 focus:ring-2 border-2 border-pink-800 focus:ring-pink-400 transition-all duration-300"
                        title="Save as favorite"
                      >
                        ⭐
                      </button>
                      <button
                        onClick={() => deleteMeal(index)}
                        className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 focus:ring-2 border-2 border-red-800 focus:ring-red-400 transition-all duration-300"
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <button
            onClick={addMeal}
            className="mt-4 bg-blue-500 text-white p-3 sm:p-4 border-2 border-blue-800 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 sm:hover:p-6 transition-all duration-300 w-full sm:w-auto"
          >
            Add a meal!
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow border-2 border-blue-800 dark:border-blue-600 p-3 sm:p-6 sm:hover:p-8 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 text-center bg-blue-200 dark:bg-blue-900 shadow p-2 rounded">
            Overview
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Total Calories Consumed: {totals.calories}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Protein: {totals.protein}g ({totals.protein * 4} cal)
                <br />
                Fat: {totals.fat}g ({totals.fat * 9} cal)
                <br />
                Carbs: {totals.carbs}g ({totals.carbs * 4} cal)
              </p>
            </div>
            <div className="flex flex-col">
              <div className="text-center text-blue-800 dark:text-blue-300 font-semibold text-xl">
                Status:
              </div>
              <div className="text-gray-600 dark:text-gray-300 bg-blue-300 dark:bg-blue-900 p-4 rounded items-center">
                <div className="text-sm italic">{statusMessage}!</div>
              </div>
            </div>
          </div>
          <div className="text-center text-blue-800 dark:text-blue-300 mb-2 font-semibold">
            Calorie Progress
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-950 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-300`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {showFoodSearch && (
        <FoodSearch
          onSelectFood={handleFoodSelect}
          onClose={() => {
            setShowFoodSearch(false);
            setSearchingMealIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
