const DateNavigator = ({ currentDate, onDateChange }) => {
  const formatDisplayDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <button
        onClick={() => changeDate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all duration-300 border-2 border-blue-800"
      >
        ← Previous Day
      </button>

      <div className="flex flex-col items-center">
        <p className="font-bold text-xl text-blue-800">
          {formatDisplayDate(currentDate)}
        </p>
        {!isToday(currentDate) && (
          <button
            onClick={goToToday}
            className="text-sm text-blue-600 hover:text-blue-800 underline mt-1"
          >
            Go to Today
          </button>
        )}
      </div>

      <button
        onClick={() => changeDate(1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all duration-300 border-2 border-blue-800"
        disabled={isToday(currentDate)}
      >
        Next Day →
      </button>
    </div>
  );
};

export default DateNavigator;
