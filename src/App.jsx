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

  const deleteMeal = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
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
    <div className="min-h-screen bg-gray-300 p-6 font-sans ">
      <h1 className="text-4xl font-bold text-center text-blue-900 w-full bg-blue-100 rounded mb-4 mx-auto p-4 border-2 border-blue-800 shadow-lg">
        Meal Tracking Guru
      </h1>
      <p className="font-bold text-center text-xl text-blue-800 mb-6">
        {today}
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <label className="font-bold block text-xl text-blue-800 mb-2 ">
            Today's Calorie Goal
          </label>
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) =>
              setCalorieGoal(Math.max(0, Number(e.target.value) || 2000))
            }
            className="text-center p-2 border-2 border-blue-800 shadow rounded focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 hover:p-3 transition-all duration-300"
            min="0"
          />
        </div>

        <div className="bg-gray-100 rounded-lg shadow-lg border-2 border-blue-800 p-6 mb-6 text-center hover:p-8 transition-all duration-300">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center bg-blue-200 shadow p-2 rounded">
            Meals
          </h2>
          {meals.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No meals added yet
            </div>
          ) : (
            meals.map((meal, index) => (
              <div
                key={index}
                className="grid grid-cols-10 gap-4 mb-4 last:mb-0 items-center text-center"
              >
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Meal name"
                    value={meal.name}
                    onChange={(e) => updateMeal(index, "name", e.target.value)}
                    className="w-full p-2 border border-blue-200 shadow rounded focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 hover:p-3 transition-all duration-300"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Protein
                  </label>
                  <input
                    type="number"
                    placeholder="Protein (g)"
                    value={meal.protein}
                    onChange={(e) =>
                      updateMeal(index, "protein", e.target.value)
                    }
                    className="w-full p-2 border border-blue-200 shadow rounded focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 hover:p-3 transition-all duration-300"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Fat
                  </label>
                  <input
                    type="number"
                    placeholder="Fat (g)"
                    value={meal.fat}
                    onChange={(e) => updateMeal(index, "fat", e.target.value)}
                    className="w-full p-2 border border-blue-200 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 hover:p-3 transition-all duration-300"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Carbs
                  </label>
                  <input
                    type="number"
                    placeholder="Carbs (g)"
                    value={meal.carbs}
                    onChange={(e) => updateMeal(index, "carbs", e.target.value)}
                    className="w-full p-2 border border-blue-200 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 hover:p-3 transition-all duration-300"
                  />
                </div>
                <div className="flex items-center flex-col col-span-1">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Calories
                  </label>
                  <div className="w-full text-center text-blue-900 font-medium">
                    {meal.protein * 4 + meal.fat * 9 + meal.carbs * 4} cal
                  </div>
                </div>
                <div className="flex items-center justify-center col-span-1 ml-4 mt-5">
                  <button
                    onClick={() => deleteMeal(index)}
                    className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 focus:ring-2 border-2 border-red-800 focus:ring-red-400 hover:p-2 transition-all duration-300"
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          )}
          <button
            onClick={addMeal}
            className="mt-4 bg-blue-500 text-white p-4 border-2 border-blue-800  rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 hover:p-6 transition-all duration-300"
          >
            Add a meal!
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg shadow border-2 border-blue-800 p-6 hover:p-8 transition-all duration-300">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center bg-blue-200 shadow p-2 rounded">
            Overview
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
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
            <div className="flex flex-col">
              <div className="text-center text-blue-800 font-semibold text-xl">
                Status:
              </div>
              <div className="text-gray-600  bg-blue-300 p-4 rounded items-center">
                <div className="text-sm italic">{statusMessage}!</div>
              </div>
            </div>
          </div>
          <div className="text-center text-blue-800 mb-2 font-semibold">
            Calorie Progress
          </div>
          <div className="w-full bg-blue-200 rounded-full h-4 overflow-hidden">
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
