import { useState, useEffect } from "react";
import {
  getAllDatesWithData,
  getMealsForDate,
  getCalorieGoalForDate,
} from "../utils/storage";

const HistoryView = ({ onDateSelect }) => {
  const [historyData, setHistoryData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    const dates = getAllDatesWithData();
    const data = dates.map((dateStr) => {
      const meals = getMealsForDate(dateStr);
      const goal = getCalorieGoalForDate(dateStr);

      const totals = meals.reduce(
        (acc, meal) => ({
          calories:
            acc.calories + (meal.protein * 4 + meal.fat * 9 + meal.carbs * 4),
          protein: acc.protein + (meal.protein || 0),
          fat: acc.fat + (meal.fat || 0),
          carbs: acc.carbs + (meal.carbs || 0),
        }),
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
      );

      return {
        date: dateStr,
        displayDate: new Date(dateStr).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        mealsCount: meals.length,
        ...totals,
        goal,
      };
    });
    setHistoryData(data);
  };

  const handleDateClick = (dateStr) => {
    onDateSelect(new Date(dateStr));
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="mb-4 text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 transition-all duration-300 border-2 border-purple-800"
        >
          📅 View History
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-lg border-2 border-purple-800 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-800">History</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
        >
          Close
        </button>
      </div>

      {historyData.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No history data available
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-purple-100 border-b-2 border-purple-800">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-center">Meals</th>
                <th className="px-4 py-2 text-center">Calories</th>
                <th className="px-4 py-2 text-center">Goal</th>
                <th className="px-4 py-2 text-center">P/F/C</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((day) => {
                const difference = day.calories - day.goal;
                const statusColor =
                  Math.abs(difference) <= 100
                    ? "text-green-600"
                    : difference < 0
                    ? "text-yellow-600"
                    : "text-red-600";

                return (
                  <tr
                    key={day.date}
                    onClick={() => handleDateClick(day.date)}
                    className="border-b hover:bg-purple-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-2 font-medium text-purple-800">
                      {day.displayDate}
                    </td>
                    <td className="px-4 py-2 text-center">{day.mealsCount}</td>
                    <td className="px-4 py-2 text-center font-semibold">
                      {Math.round(day.calories)}
                    </td>
                    <td className="px-4 py-2 text-center">{day.goal}</td>
                    <td className="px-4 py-2 text-center text-sm">
                      {Math.round(day.protein)}g / {Math.round(day.fat)}g /{" "}
                      {Math.round(day.carbs)}g
                    </td>
                    <td
                      className={`px-4 py-2 text-center font-semibold ${statusColor}`}
                    >
                      {difference > 100
                        ? `+${Math.round(difference)}`
                        : difference < -100
                        ? Math.round(difference)
                        : "✓"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
