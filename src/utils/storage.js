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
      // Proteins - Poultry
      { id: 1, name: "Chicken Breast (100g)", protein: 31, fat: 3.6, carbs: 0 },
      { id: 2, name: "Chicken Thigh (100g)", protein: 26, fat: 15, carbs: 0 },
      { id: 3, name: "Turkey Breast (100g)", protein: 29, fat: 1, carbs: 0 },
      { id: 4, name: "Ground Turkey (100g)", protein: 27, fat: 8, carbs: 0 },
      
      // Proteins - Beef & Pork
      { id: 5, name: "Lean Ground Beef (100g)", protein: 26, fat: 15, carbs: 0 },
      { id: 6, name: "Sirloin Steak (100g)", protein: 27, fat: 11, carbs: 0 },
      { id: 7, name: "Pork Chop (100g)", protein: 26, fat: 7, carbs: 0 },
      { id: 8, name: "Bacon (2 slices)", protein: 6, fat: 6, carbs: 0.5 },
      
      // Proteins - Fish & Seafood
      { id: 9, name: "Salmon (100g)", protein: 25, fat: 13, carbs: 0 },
      { id: 10, name: "Tuna (100g)", protein: 30, fat: 1, carbs: 0 },
      { id: 11, name: "Cod (100g)", protein: 23, fat: 1, carbs: 0 },
      { id: 12, name: "Shrimp (100g)", protein: 24, fat: 0.3, carbs: 0 },
      { id: 13, name: "Tilapia (100g)", protein: 26, fat: 2.7, carbs: 0 },
      
      // Proteins - Eggs & Dairy
      { id: 14, name: "Eggs (1 large)", protein: 6, fat: 5, carbs: 0.6 },
      { id: 15, name: "Egg Whites (100g)", protein: 11, fat: 0.2, carbs: 0.7 },
      { id: 16, name: "Greek Yogurt (100g)", protein: 10, fat: 0.4, carbs: 3.6 },
      { id: 17, name: "Cottage Cheese (100g)", protein: 11, fat: 4.3, carbs: 3.4 },
      { id: 18, name: "Milk (1 cup)", protein: 8, fat: 8, carbs: 12 },
      { id: 19, name: "Skim Milk (1 cup)", protein: 8, fat: 0.2, carbs: 12 },
      { id: 20, name: "Cheddar Cheese (28g)", protein: 7, fat: 9, carbs: 0.4 },
      { id: 21, name: "Mozzarella (28g)", protein: 6, fat: 6, carbs: 1 },
      
      // Proteins - Plant-based
      { id: 22, name: "Tofu (100g)", protein: 8, fat: 4.8, carbs: 1.9 },
      { id: 23, name: "Tempeh (100g)", protein: 19, fat: 11, carbs: 9 },
      { id: 24, name: "Edamame (100g)", protein: 11, fat: 5, carbs: 10 },
      { id: 25, name: "Black Beans (100g)", protein: 8.9, fat: 0.5, carbs: 24 },
      { id: 26, name: "Chickpeas (100g)", protein: 9, fat: 2.6, carbs: 27 },
      { id: 27, name: "Lentils (100g)", protein: 9, fat: 0.4, carbs: 20 },
      { id: 28, name: "Kidney Beans (100g)", protein: 8.7, fat: 0.5, carbs: 23 },
      
      // Carbs - Grains
      { id: 29, name: "Brown Rice (100g)", protein: 2.6, fat: 0.9, carbs: 23 },
      { id: 30, name: "White Rice (100g)", protein: 2.7, fat: 0.3, carbs: 28 },
      { id: 31, name: "Quinoa (100g)", protein: 4.4, fat: 1.9, carbs: 21 },
      { id: 32, name: "Oatmeal (100g)", protein: 13.2, fat: 6.9, carbs: 67 },
      { id: 33, name: "Whole Wheat Bread (1 slice)", protein: 4, fat: 1, carbs: 12 },
      { id: 34, name: "White Bread (1 slice)", protein: 2, fat: 1, carbs: 13 },
      { id: 35, name: "Pasta (100g dry)", protein: 13, fat: 1.5, carbs: 75 },
      { id: 36, name: "Whole Wheat Pasta (100g dry)", protein: 13, fat: 2.5, carbs: 75 },
      
      // Carbs - Potatoes & Tubers
      { id: 37, name: "Sweet Potato (100g)", protein: 1.6, fat: 0.1, carbs: 20 },
      { id: 38, name: "Baked Potato (100g)", protein: 2, fat: 0.1, carbs: 21 },
      { id: 39, name: "Red Potatoes (100g)", protein: 2, fat: 0.1, carbs: 16 },
      
      // Vegetables
      { id: 40, name: "Broccoli (100g)", protein: 2.8, fat: 0.4, carbs: 7 },
      { id: 41, name: "Spinach (100g)", protein: 2.9, fat: 0.4, carbs: 3.6 },
      { id: 42, name: "Kale (100g)", protein: 4.3, fat: 0.9, carbs: 9 },
      { id: 43, name: "Carrots (100g)", protein: 0.9, fat: 0.2, carbs: 10 },
      { id: 44, name: "Bell Pepper (100g)", protein: 1, fat: 0.3, carbs: 6 },
      { id: 45, name: "Tomato (100g)", protein: 0.9, fat: 0.2, carbs: 3.9 },
      { id: 46, name: "Cucumber (100g)", protein: 0.7, fat: 0.1, carbs: 3.6 },
      { id: 47, name: "Lettuce (100g)", protein: 1.4, fat: 0.2, carbs: 2.9 },
      { id: 48, name: "Asparagus (100g)", protein: 2.2, fat: 0.1, carbs: 3.9 },
      { id: 49, name: "Green Beans (100g)", protein: 1.8, fat: 0.2, carbs: 7 },
      { id: 50, name: "Cauliflower (100g)", protein: 1.9, fat: 0.3, carbs: 5 },
      
      // Fruits
      { id: 51, name: "Apple (1 medium)", protein: 0.5, fat: 0.3, carbs: 25 },
      { id: 52, name: "Banana (1 medium)", protein: 1.3, fat: 0.4, carbs: 27 },
      { id: 53, name: "Orange (1 medium)", protein: 1.2, fat: 0.2, carbs: 15 },
      { id: 54, name: "Strawberries (100g)", protein: 0.7, fat: 0.3, carbs: 7.7 },
      { id: 55, name: "Blueberries (100g)", protein: 0.7, fat: 0.3, carbs: 14 },
      { id: 56, name: "Grapes (100g)", protein: 0.7, fat: 0.2, carbs: 18 },
      { id: 57, name: "Watermelon (100g)", protein: 0.6, fat: 0.2, carbs: 8 },
      { id: 58, name: "Mango (100g)", protein: 0.8, fat: 0.4, carbs: 15 },
      { id: 59, name: "Pineapple (100g)", protein: 0.5, fat: 0.1, carbs: 13 },
      { id: 60, name: "Avocado (100g)", protein: 2, fat: 15, carbs: 9 },
      
      // Nuts & Seeds
      { id: 61, name: "Almonds (28g)", protein: 6, fat: 14, carbs: 6 },
      { id: 62, name: "Walnuts (28g)", protein: 4.3, fat: 18, carbs: 4 },
      { id: 63, name: "Cashews (28g)", protein: 5, fat: 12, carbs: 9 },
      { id: 64, name: "Peanuts (28g)", protein: 7, fat: 14, carbs: 5 },
      { id: 65, name: "Peanut Butter (2 tbsp)", protein: 8, fat: 16, carbs: 7 },
      { id: 66, name: "Almond Butter (2 tbsp)", protein: 7, fat: 18, carbs: 6 },
      { id: 67, name: "Chia Seeds (28g)", protein: 4.7, fat: 8.7, carbs: 12 },
      { id: 68, name: "Flax Seeds (28g)", protein: 5.1, fat: 12, carbs: 8 },
      { id: 69, name: "Sunflower Seeds (28g)", protein: 5.8, fat: 14, carbs: 6 },
      
      // Common Foods & Meals
      { id: 70, name: "Protein Shake (1 scoop)", protein: 25, fat: 2, carbs: 3 },
      { id: 71, name: "Protein Bar", protein: 20, fat: 8, carbs: 24 },
      { id: 72, name: "Pizza Slice (1/8 large)", protein: 12, fat: 10, carbs: 34 },
      { id: 73, name: "Burger Patty (100g)", protein: 26, fat: 20, carbs: 0 },
      { id: 74, name: "Hamburger Bun", protein: 4, fat: 2, carbs: 26 },
      { id: 75, name: "Tortilla (1 medium)", protein: 3, fat: 2, carbs: 18 },
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
