import { useState, useMemo } from "react";

const App = () => {
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [meals, setMeals] = useState([]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">
        Meal Tracking Guru
      </h1>
      <p className="text-center text-gray-600 mb-6">{today}</p>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Today's Calorie Goal
          </label>
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) =>
              setCalorieGoal(Math.max(0, Number(e.target.value) || 2000))
            }
            className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Meals</h2>
          {meals.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No meals added yet
            </div>
          ) : (
            meals.map((meal, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-4 last:mb-0"
              >
                <input
                  type="text"
                  placeholder="Meal name"
                  value={meal.name}
                  onChange={(e) => updateMeal(index, "name", e.target.value)}
                  className="flex-1 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={meal.protein}
                  onChange={(e) => updateMeal(index, "protein", e.target.value)}
                  className="w-24 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={meal.fat}
                  onChange={(e) => updateMeal(index, "fat", e.target.value)}
                  className="w-24 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={meal.carbs}
                  onChange={(e) => updateMeal(index, "carbs", e.target.value)}
                  className="w-24 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="w-24 text-center text-blue-800 font-medium">
                  {meal.protein * 4 + meal.fat * 9 + meal.carbs * 4} cal
                </div>
              </div>
            ))
          )}
          <button
            onClick={addMeal}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add a meal!
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                Total Calories Consumed: {totals.calories}
              </h2>
              <p className="text-sm text-gray-600">
                Protein: {totals.protein}g ({totals.protein * 4} cal)
                <br />
                Fat: {totals.fat}g ({totals.fat * 9} cal)
                <br />
                Carbs: {totals.carbs}g ({totals.carbs * 4} cal)
              </p>
            </div>
            <div className="text-sm text-gray-600 italic">{statusMessage}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-300`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
