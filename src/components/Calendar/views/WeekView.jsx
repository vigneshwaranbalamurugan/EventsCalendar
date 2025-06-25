import { FAIcon } from "../FAIcons";

export default function renderWeekView({
    currentDate,
    handleTimeSlotClick,
    handleEditEvent,
    getWeekStart,
    isToday,
    formatTime,
    getEventsForWeek,
    timeToMinutes,
    calculateDuration
}) {
    const weekStart = getWeekStart(currentDate);
    const weekDays = getEventsForWeek(weekStart);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="bg-[#ffffff] rounded-lg shadow-md border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-8 divide-x divide-gray-200">
                    <div className="px-4 py-4"></div>
                    {weekDays.map((day, index) => (
                        <div key={index} className="px-4 py-4 text-center">
                            <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                {dayNames[index]}
                            </div>
                            <div className={`text-2xl font-bold ${isToday(day.date)
                                ? 'bg-[#1E3A8A] text-[#ffffff] rounded-full w-10 h-10 flex items-center justify-center mx-auto'
                                : 'text-gray-900'
                                }`}>
                                {day.date.getDate()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-h-135 overflow-y-auto">
                <div className="grid grid-cols-8 divide-x divide-gray-200">
                    <div className="bg-gray-50">
                        {hours.map(hour => (
                            <div key={hour} className="h-16 border-b border-gray-200 p-3 text-right">
                                <span className="text-xs text-gray-600 font-medium">
                                    {hour === 0 ? '12 AM' : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
                                </span>
                            </div>
                        ))}
                    </div>

                    {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="relative">
                            {hours.map(hour => (
                                <div
                                    key={hour}
                                    className="h-16 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors relative group"
                                    onClick={() => handleTimeSlotClick(day.date, hour)}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FAIcon icon="plus" className="text-blue-500" size="20" />
                                    </div>
                                </div>
                            ))}

                            {day.events.map(event => {
                                const startMinutes = timeToMinutes(event.startTime);
                                const duration = calculateDuration(event.startTime, event.endTime);
                                const topPosition = (startMinutes * 64) / 60;
                                const height = Math.max((duration * 64) / 60, 40);

                                return (
                                    <div
                                        key={event.id}
                                        className="absolute left-1 right-1 rounded p-2 text-xs cursor-pointer shadow-sm border-l-4"
                                        style={{
                                            top: `${topPosition}px`,
                                            height: `${height}px`,
                                            backgroundColor: `${event.color}15`,
                                            borderLeftColor: event.color,
                                            zIndex: 10
                                        }}
                                        onClick={() => handleEditEvent(event)}
                                    >
                                        <div className="font-bold text-gray-900">{formatTime(event.startTime)}</div>
                                        <div className="text-gray-800 font-medium">{event.title}</div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};