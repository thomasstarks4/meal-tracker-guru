import { useState, useEffect } from "react";
import { getWeeklySummary } from "../utils/storage";

const Analytics = ({ currentDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const data = getWeeklySummary(currentDate);
      setSummary(data);
    }
  }, [isOpen, currentDate]);

  const weeklyAverages =
    summary.length > 0
      ? {
          calories: Math.round(
            summary.reduce((acc, day) => acc + day.calories, 0) / summary.length
          ),
          protein: Math.round(
            summary.reduce((acc, day) => acc + day.protein, 0) / summary.length
          ),
          fat: Math.round(
            summary.reduce((acc, day) => acc + day.fat, 0) / summary.length
          ),
          carbs: Math.round(
            summary.reduce((acc, day) => acc + day.carbs, 0) / summary.length
          ),
        }
      : { calories: 0, protein: 0, fat: 0, carbs: 0 };

  const maxCalories = Math.max(...summary.map((d) => d.calories), 1);

  const SimpleBarChart = ({ data }) => {
    return (
      <div className="space-y-2">
        {data.map((day, index) => {
          const percentage = (day.calories / maxCalories) * 100;
          const isUnderGoal = day.calories < day.goal;
          const isOverGoal = day.calories > day.goal + 100;

          return (
            <div key={index} className="flex items-center gap-2">
              <div className="w-16 text-xs text-gray-600">
                {new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverGoal
                      ? "bg-red-500"
                      : isUnderGoal
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                  {Math.round(day.calories)} cal
                </div>
              </div>
              <div className="w-16 text-xs text-right text-gray-600">
                Goal: {day.goal}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const MacroDistributionChart = () => {
    const totalMacros =
      weeklyAverages.protein + weeklyAverages.fat + weeklyAverages.carbs;
    const proteinPercent =
      Math.round((weeklyAverages.protein / totalMacros) * 100) || 0;
    const fatPercent =
      Math.round((weeklyAverages.fat / totalMacros) * 100) || 0;
    const carbsPercent =
      Math.round((weeklyAverages.carbs / totalMacros) * 100) || 0;

    return (
      <div>
        <div className="flex rounded-full overflow-hidden h-8 mb-4">
          <div
            className="bg-red-400 flex items-center justify-center text-xs font-semibold text-white"
            style={{ width: `${proteinPercent}%` }}
          >
            {proteinPercent > 10 && `${proteinPercent}%`}
          </div>
          <div
            className="bg-yellow-400 flex items-center justify-center text-xs font-semibold text-white"
            style={{ width: `${fatPercent}%` }}
          >
            {fatPercent > 10 && `${fatPercent}%`}
          </div>
          <div
            className="bg-blue-400 flex items-center justify-center text-xs font-semibold text-white"
            style={{ width: `${carbsPercent}%` }}
          >
            {carbsPercent > 10 && `${carbsPercent}%`}
          </div>
        </div>
        <div className="flex justify-around text-sm">
          <div className="text-center">
            <div className="w-4 h-4 bg-red-400 rounded mx-auto mb-1"></div>
            <div className="font-semibold">Protein</div>
            <div className="text-gray-600">{weeklyAverages.protein}g</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-yellow-400 rounded mx-auto mb-1"></div>
            <div className="font-semibold">Fat</div>
            <div className="text-gray-600">{weeklyAverages.fat}g</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-blue-400 rounded mx-auto mb-1"></div>
            <div className="font-semibold">Carbs</div>
            <div className="text-gray-600">{weeklyAverages.carbs}g</div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="mb-4 text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-cyan-500 text-white px-3 sm:px-6 py-2 text-sm sm:text-base rounded hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 transition-all duration-300 border-2 border-cyan-800"
        >
          📈 Analytics
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-lg border-2 border-cyan-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-800">Analytics & Charts</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
        >
          Close
        </button>
      </div>

      {summary.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No data available for analytics
        </p>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-cyan-50 rounded border-2 border-cyan-200">
            <h3 className="text-lg font-semibold text-cyan-800 mb-4">
              7-Day Calorie Trends
            </h3>
            <SimpleBarChart data={summary} />
          </div>

          <div className="p-4 bg-cyan-50 rounded border-2 border-cyan-200">
            <h3 className="text-lg font-semibold text-cyan-800 mb-4">
              Average Macro Distribution
            </h3>
            <MacroDistributionChart />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded border-2 border-cyan-200">
              <h3 className="font-semibold text-cyan-800 mb-2">Best Day</h3>
              {summary.length > 0 &&
                (() => {
                  const bestDay = summary.reduce((best, day) => {
                    const diff = Math.abs(day.calories - day.goal);
                    const bestDiff = Math.abs(best.calories - best.goal);
                    return diff < bestDiff ? day : best;
                  });
                  return (
                    <div>
                      <p className="text-sm">
                        {new Date(bestDay.date).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold text-cyan-900">
                        {Math.round(bestDay.calories)} cal
                      </p>
                      <p className="text-xs text-gray-600">
                        {Math.abs(bestDay.calories - bestDay.goal) <= 100
                          ? "Perfect!"
                          : `${Math.abs(
                              Math.round(bestDay.calories - bestDay.goal)
                            )} cal ${
                              bestDay.calories > bestDay.goal ? "over" : "under"
                            }`}
                      </p>
                    </div>
                  );
                })()}
            </div>

            <div className="p-4 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded border-2 border-cyan-200">
              <h3 className="font-semibold text-cyan-800 mb-2">Consistency</h3>
              <p className="text-lg font-bold text-cyan-900">
                {summary.filter((d) => d.mealsCount > 0).length} / 7 days
              </p>
              <p className="text-xs text-gray-600">
                {Math.round(
                  (summary.filter((d) => d.mealsCount > 0).length / 7) * 100
                )}
                % tracked
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
