import { useState } from "react";

const MacroTargets = ({ totals, calorieGoal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targets, setTargets] = useState({
    protein: 150,
    fat: 65,
    carbs: 200,
  });

  const calculatePercentage = (actual, target) => {
    return target > 0 ? Math.round((actual / target) * 100) : 0;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90 && percentage <= 110) return "bg-green-500";
    if (percentage >= 80 && percentage <= 120) return "bg-yellow-500";
    return "bg-red-500";
  };

  const MacroProgressBar = ({ label, actual, target, unit = "g" }) => {
    const percentage = calculatePercentage(actual, target);
    const progressColor = getProgressColor(percentage);

    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {label}: {Math.round(actual)}
            {unit} / {target}
            {unit}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="mb-4 text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-500 text-white px-3 sm:px-6 py-2 text-sm sm:text-base rounded hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition-all duration-300 border-2 border-indigo-800"
        >
          🎯 Macro Targets
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-lg border-2 border-indigo-800 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-800">Macro Targets</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
        >
          Close
        </button>
      </div>

      <div className="mb-6 p-4 bg-indigo-50 rounded border-2 border-indigo-200">
        <h3 className="font-semibold text-indigo-800 mb-3">Set Your Targets</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              value={targets.protein}
              onChange={(e) =>
                setTargets({ ...targets, protein: Number(e.target.value) || 0 })
              }
              className="w-full p-2 border-2 border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              value={targets.fat}
              onChange={(e) =>
                setTargets({ ...targets, fat: Number(e.target.value) || 0 })
              }
              className="w-full p-2 border-2 border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              value={targets.carbs}
              onChange={(e) =>
                setTargets({ ...targets, carbs: Number(e.target.value) || 0 })
              }
              className="w-full p-2 border-2 border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Target calories from macros:{" "}
          {targets.protein * 4 + targets.fat * 9 + targets.carbs * 4} cal
        </p>
      </div>

      <div className="space-y-4">
        <MacroProgressBar
          label="Protein"
          actual={totals.protein}
          target={targets.protein}
        />
        <MacroProgressBar
          label="Fat"
          actual={totals.fat}
          target={targets.fat}
        />
        <MacroProgressBar
          label="Carbs"
          actual={totals.carbs}
          target={targets.carbs}
        />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded border-2 border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">Macro Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <span className="font-medium">Protein:</span>{" "}
              {Math.round(totals.protein)}g (
              {Math.round(((totals.protein * 4) / totals.calories) * 100) || 0}%
              of calories)
            </p>
            <p>
              <span className="font-medium">Fat:</span> {Math.round(totals.fat)}
              g ({Math.round(((totals.fat * 9) / totals.calories) * 100) || 0}%
              of calories)
            </p>
            <p>
              <span className="font-medium">Carbs:</span>{" "}
              {Math.round(totals.carbs)}g (
              {Math.round(((totals.carbs * 4) / totals.calories) * 100) || 0}%
              of calories)
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">Total Calories:</span>{" "}
              {Math.round(totals.calories)}
            </p>
            <p>
              <span className="font-medium">Calorie Goal:</span> {calorieGoal}
            </p>
            <p
              className={`font-semibold ${
                totals.calories <= calorieGoal + 100
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {totals.calories <= calorieGoal ? "Under goal" : "Over goal"} by{" "}
              {Math.abs(Math.round(totals.calories - calorieGoal))} cal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroTargets;
