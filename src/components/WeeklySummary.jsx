import { useState, useEffect } from "react";
import { getWeeklySummary } from "../utils/storage";

const WeeklySummary = ({ currentDate }) => {
  const [summary, setSummary] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const data = getWeeklySummary(currentDate);
      setSummary(data);
    }
  }, [isOpen, currentDate]);

  const weeklyTotals = summary.reduce(
    (acc, day) => ({
      calories: acc.calories + day.calories,
      protein: acc.protein + day.protein,
      fat: acc.fat + day.fat,
      carbs: acc.carbs + day.carbs,
      goalTotal: acc.goalTotal + day.goal,
      mealsTotal: acc.mealsTotal + day.mealsCount,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0, goalTotal: 0, mealsTotal: 0 }
  );

  const weeklyAverages = {
    calories: Math.round(weeklyTotals.calories / 7),
    protein: Math.round(weeklyTotals.protein / 7),
    fat: Math.round(weeklyTotals.fat / 7),
    carbs: Math.round(weeklyTotals.carbs / 7),
    goal: Math.round(weeklyTotals.goalTotal / 7),
  };

  if (!isOpen) {
    return (
      <div className="mb-4 text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-all duration-300 border-2 border-green-800"
        >
          📊 Weekly Summary
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-lg border-2 border-green-800 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-800">
          Last 7 Days Summary
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Daily Averages
          </h3>
          <div className="space-y-1">
            <p>
              <span className="font-medium">Calories:</span>{" "}
              {weeklyAverages.calories} / {weeklyAverages.goal}
            </p>
            <p>
              <span className="font-medium">Protein:</span>{" "}
              {weeklyAverages.protein}g
            </p>
            <p>
              <span className="font-medium">Fat:</span> {weeklyAverages.fat}g
            </p>
            <p>
              <span className="font-medium">Carbs:</span> {weeklyAverages.carbs}
              g
            </p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Weekly Totals
          </h3>
          <div className="space-y-1">
            <p>
              <span className="font-medium">Total Calories:</span>{" "}
              {Math.round(weeklyTotals.calories)}
            </p>
            <p>
              <span className="font-medium">Total Meals:</span>{" "}
              {weeklyTotals.mealsTotal}
            </p>
            <p>
              <span className="font-medium">Protein:</span>{" "}
              {Math.round(weeklyTotals.protein)}g
            </p>
            <p>
              <span className="font-medium">Fat:</span>{" "}
              {Math.round(weeklyTotals.fat)}g
            </p>
            <p>
              <span className="font-medium">Carbs:</span>{" "}
              {Math.round(weeklyTotals.carbs)}g
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Daily Breakdown
        </h3>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-green-100 border-b-2 border-green-800">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-center">Calories</th>
              <th className="px-4 py-2 text-center">vs Goal</th>
              <th className="px-4 py-2 text-center">Protein</th>
              <th className="px-4 py-2 text-center">Fat</th>
              <th className="px-4 py-2 text-center">Carbs</th>
              <th className="px-4 py-2 text-center">Meals</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((day) => {
              const difference = day.calories - day.goal;
              const statusColor =
                Math.abs(difference) <= 100
                  ? "bg-green-50"
                  : difference < 0
                  ? "bg-yellow-50"
                  : "bg-red-50";

              return (
                <tr key={day.date} className={`border-b ${statusColor}`}>
                  <td className="px-4 py-2">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 text-center font-semibold">
                    {Math.round(day.calories)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {difference > 0
                      ? `+${Math.round(difference)}`
                      : Math.round(difference)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {Math.round(day.protein)}g
                  </td>
                  <td className="px-4 py-2 text-center">
                    {Math.round(day.fat)}g
                  </td>
                  <td className="px-4 py-2 text-center">
                    {Math.round(day.carbs)}g
                  </td>
                  <td className="px-4 py-2 text-center">{day.mealsCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklySummary;
