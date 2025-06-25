export default function renderMonthView({
  currentDate,
  selectedDate,
  setSelectedDate,
  expandedDates,
  setExpandedDates,
  handleEditEvent,
  getDaysInMonth,
  formatDate,
  formatTime,
  isToday,
  getEventsForDate
}) {
  const days = getDaysInMonth(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="bg-[#1E3A8A] border-b border-gray-200">
        <div className="grid grid-cols-7 divide-x divide-gray-200">
          {dayNames.map(day => (
            <div key={day} className="px-4 py-4 text-center">
              <div className="text-sm font-semibold text-white uppercase tracking-wide">{day}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 divide-x divide-gray-200">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isSelected = selectedDate && formatDate(day) === formatDate(selectedDate);
          const dateKey = formatDate(day); // e.g., '2025-06-25'
          const isExpanded = expandedDates[dateKey];

          const visibleEvents = isExpanded ? dayEvents : dayEvents.slice(0, 2);
          const minHeight = Math.max(120, 80 + (visibleEvents.length * 35));

          return (
            <div
              key={index}
              className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${isSelected ? 'bg-blue-50 ring-2 ring-[#1E3A8A] ring-inset' : ''
                }`}
              style={{ minHeight: `${minHeight}px` }}
              onClick={() => setSelectedDate(new Date(day))}
            >
              <div className={`mb-3 ${isToday(day)
                ? 'bg-[#1E3A8A] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold'
                : !isCurrentMonth
                  ? 'text-gray-400 text-sm'
                  : 'text-gray-900 text-sm font-medium'
                }`}>
                {day.getDate()}
              </div>

              <div className="space-y-1">
                {visibleEvents.map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-2 rounded border-l-4 cursor-pointer hover:shadow-sm transition-shadow bg-gray-50"
                    style={{
                      borderLeftColor: event.color,
                      backgroundColor: `${event.color}10`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event);
                    }}
                  >
                    <div className="font-medium text-gray-900 mb-1">{event.title}</div>
                    <div className="text-gray-600">{formatTime(event.startTime)}</div>
                  </div>
                ))}

                {dayEvents.length > 2 && (
                  <button
                    className="text-xs text-blue-600 hover:cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDates(prev => ({
                        ...prev,
                        [dateKey]: !prev[dateKey]
                      }));
                    }}
                  >
                    {isExpanded ? 'Show less' : `Show ${dayEvents.length - 2} more`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
