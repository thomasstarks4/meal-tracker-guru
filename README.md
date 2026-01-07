# Meal Tracking Guru 🍽️

A comprehensive meal tracking application built with React + Vite that helps you monitor your daily nutrition, calories, and macros with advanced features for long-term tracking and analysis.

## 📋 Features by Phase

### Phase 1: Basic Meal Tracker ✅

- Single-day meal tracking
- Manual macro input (protein, fat, carbs)
- Automatic calorie calculation (P×4 + F×9 + C×4)
- Visual progress bar with goal tracking
- Color-coded status indicators

### Phase 2: Data Persistence & History ✅

- **LocalStorage Integration**: All data persists across sessions
- **Date Navigation**: Navigate between past and future dates
- **History View**: See all tracked days in a table with quick navigation
- **Weekly Summary**: View 7-day statistics with daily averages and totals
- **Data Management**: Export and import your data as JSON backup files

### Phase 3: Advanced Features & Intelligence ✅

- **Food Database**: 10+ pre-loaded foods with search functionality
- **Custom Foods**: Add your own foods to the database
- **Favorites System**: Save frequently-eaten meals for quick reuse
- **Macro Targets**: Set and track protein, fat, and carb goals separately
- **Analytics Dashboard**: Visual charts showing calorie trends and macro distribution
- **Dark Mode**: Full dark theme support with toggle button
- **Quick Search**: Search for foods directly from meal entry

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 📱 How to Use

### Adding Meals

1. Click "Add a meal!" to create a new meal entry
2. Enter the meal name manually OR click "🔍 Search" to find foods in the database
3. Input protein, fat, and carbs (or use values from food search)
4. Click ⭐ to save the meal as a favorite for quick reuse later

### Navigation & History

- Use the **Previous Day** and **Next Day** buttons to view different dates
- Click **"Go to Today"** to return to the current date
- Open **📅 View History** to see all tracked days and click any date to jump to it

### Analytics & Tracking

- **📊 Weekly Summary**: View your last 7 days with averages and totals
- **🎯 Macro Targets**: Set specific goals for protein, fat, and carbs
- **📈 Analytics**: See visual charts of your calorie trends and macro breakdown
- **⭐ Favorites**: Access your saved meals for quick logging

### Data Management

- **💾 Export Data**: Download all your data as a JSON backup file
- **📥 Import Data**: Upload a previously exported JSON file to restore data
- Transfer data between devices or browsers easily

### Dark Mode

- Click the **🌙/☀️** button in the top-right corner to toggle dark mode
- Your preference is saved automatically

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Analytics.jsx          # Charts and trend analysis
│   ├── DataManager.jsx         # Import/Export functionality
│   ├── DateNavigator.jsx       # Date selection controls
│   ├── FavoritesManager.jsx    # Saved meals management
│   ├── FoodSearch.jsx          # Food database search
│   ├── HistoryView.jsx         # Historical data table
│   ├── MacroTargets.jsx        # Macro goal tracking
│   └── WeeklySummary.jsx       # 7-day statistics
├── context/
│   └── DarkModeContext.jsx     # Dark mode state management
├── utils/
│   └── storage.js              # LocalStorage utilities
├── App.jsx                      # Main application component
└── main.jsx                     # Application entry point
```

## 🎨 Features in Detail

### Food Database

Pre-loaded with common foods:

- Chicken Breast, Salmon, Eggs
- Brown Rice, Oatmeal, Sweet Potato
- Broccoli, Greek Yogurt, Banana, Almonds

Add custom foods that persist in your database!

### Macro Calculations

- **Protein**: 4 calories per gram
- **Fat**: 9 calories per gram
- **Carbs**: 4 calories per gram

### Status Indicators

- 🟢 **Green**: Within goal (±100 calories)
- 🟡 **Yellow**: Under goal (>100 calories under)
- 🔴 **Red**: Over goal (>100 calories over)

## 💾 Data Storage

All data is stored locally in your browser using LocalStorage:

- Meals organized by date
- Calorie goals per day
- Favorite meals
- Custom foods in database
- Dark mode preference

**Note**: Clearing browser data will erase all tracking data. Use the Export feature regularly to back up your data!

## 🛠️ Technologies

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with dark mode support
- **LocalStorage API** - Client-side data persistence

## 📝 License

This project is open source and available for personal use.

---

Built with ❤️ for health-conscious individuals tracking their nutrition goals!
