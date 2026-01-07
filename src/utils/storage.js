// LocalStorage utility functions for meal tracking data

const STORAGE_KEYS = {
  MEALS: "mealTracker_meals",
  CALORIE_GOALS: "mealTracker_calorieGoals",
  FAVORITES: "mealTracker_favorites",
  FOOD_DATABASE: "mealTracker_foodDatabase",
};

// Format date as YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Get meals for a specific date
export const getMealsForDate = (date) => {
  try {
    const dateKey = formatDate(date);
    const allMeals = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MEALS) || "{}"
    );
    return allMeals[dateKey] || [];
  } catch (error) {
    console.error("Error reading meals from localStorage:", error);
    return [];
  }
};

// Save meals for a specific date
export const saveMealsForDate = (date, meals) => {
  try {
    const dateKey = formatDate(date);
    const allMeals = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MEALS) || "{}"
    );
    allMeals[dateKey] = meals;
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(allMeals));
  } catch (error) {
    console.error("Error saving meals to localStorage:", error);
  }
};

// Get calorie goal for a specific date
export const getCalorieGoalForDate = (date) => {
  try {
    const dateKey = formatDate(date);
    const allGoals = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CALORIE_GOALS) || "{}"
    );
    return allGoals[dateKey] || 2000;
  } catch (error) {
    console.error("Error reading calorie goal from localStorage:", error);
    return 2000;
  }
};

// Save calorie goal for a specific date
export const saveCalorieGoalForDate = (date, goal) => {
  try {
    const dateKey = formatDate(date);
    const allGoals = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CALORIE_GOALS) || "{}"
    );
    allGoals[dateKey] = goal;
    localStorage.setItem(STORAGE_KEYS.CALORIE_GOALS, JSON.stringify(allGoals));
  } catch (error) {
    console.error("Error saving calorie goal to localStorage:", error);
  }
};

// Get all dates with data
export const getAllDatesWithData = () => {
  try {
    const allMeals = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MEALS) || "{}"
    );
    return Object.keys(allMeals).sort().reverse();
  } catch (error) {
    console.error("Error reading dates from localStorage:", error);
    return [];
  }
};

// Get weekly summary (last 7 days from given date)
export const getWeeklySummary = (endDate) => {
  try {
    const allMeals = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MEALS) || "{}"
    );
    const allGoals = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CALORIE_GOALS) || "{}"
    );

    const summary = [];
    const end = new Date(endDate);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(end);
      date.setDate(date.getDate() - i);
      const dateKey = formatDate(date);

      const meals = allMeals[dateKey] || [];
      const goal = allGoals[dateKey] || 2000;

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

      summary.push({
        date: dateKey,
        ...totals,
        goal,
        mealsCount: meals.length,
      });
    }

    return summary;
  } catch (error) {
    console.error("Error getting weekly summary:", error);
    return [];
  }
};

// Export all data
export const exportAllData = () => {
  try {
    const data = {
      meals: JSON.parse(localStorage.getItem(STORAGE_KEYS.MEALS) || "{}"),
      calorieGoals: JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CALORIE_GOALS) || "{}"
      ),
      favorites: JSON.parse(
        localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]"
      ),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error exporting data:", error);
    return null;
  }
};

// Import data
export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);

    if (data.meals) {
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(data.meals));
    }
    if (data.calorieGoals) {
      localStorage.setItem(
        STORAGE_KEYS.CALORIE_GOALS,
        JSON.stringify(data.calorieGoals)
      );
    }
    if (data.favorites) {
      localStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(data.favorites)
      );
    }

    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

// Favorites management
export const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]");
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
};

export const addFavorite = (meal) => {
  try {
    const favorites = getFavorites();
    const newFavorite = {
      id: Date.now(),
      ...meal,
      addedAt: new Date().toISOString(),
    };
    favorites.push(newFavorite);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return newFavorite;
  } catch (error) {
    console.error("Error adding favorite:", error);
    return null;
  }
};

export const removeFavorite = (id) => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
};

// Food database management
export const getFoodDatabase = () => {
  try {
    const defaultFoods = [
      { id: 1, name: "Chicken Breast (100g)", protein: 31, fat: 3.6, carbs: 0 },
      { id: 2, name: "Brown Rice (100g)", protein: 2.6, fat: 0.9, carbs: 23 },
      { id: 3, name: "Broccoli (100g)", protein: 2.8, fat: 0.4, carbs: 7 },
      { id: 4, name: "Salmon (100g)", protein: 25, fat: 13, carbs: 0 },
      { id: 5, name: "Sweet Potato (100g)", protein: 1.6, fat: 0.1, carbs: 20 },
      { id: 6, name: "Greek Yogurt (100g)", protein: 10, fat: 0.4, carbs: 3.6 },
      { id: 7, name: "Eggs (1 large)", protein: 6, fat: 5, carbs: 0.6 },
      { id: 8, name: "Banana (1 medium)", protein: 1.3, fat: 0.4, carbs: 27 },
      { id: 9, name: "Almonds (28g)", protein: 6, fat: 14, carbs: 6 },
      { id: 10, name: "Oatmeal (100g)", protein: 13.2, fat: 6.9, carbs: 67 },
    ];

    const stored = localStorage.getItem(STORAGE_KEYS.FOOD_DATABASE);
    if (!stored) {
      localStorage.setItem(
        STORAGE_KEYS.FOOD_DATABASE,
        JSON.stringify(defaultFoods)
      );
      return defaultFoods;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading food database:", error);
    return [];
  }
};

export const searchFoodDatabase = (query) => {
  const foods = getFoodDatabase();
  const lowerQuery = query.toLowerCase();
  return foods.filter((food) => food.name.toLowerCase().includes(lowerQuery));
};

export const addCustomFood = (food) => {
  try {
    const foods = getFoodDatabase();
    const newFood = {
      id: Date.now(),
      ...food,
    };
    foods.push(newFood);
    localStorage.setItem(STORAGE_KEYS.FOOD_DATABASE, JSON.stringify(foods));
    return newFood;
  } catch (error) {
    console.error("Error adding custom food:", error);
    return null;
  }
};
