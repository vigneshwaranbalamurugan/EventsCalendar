import { FAIcon } from "./FAIcons";

export default function CalendarSidebar({
    currentDate,
    setCurrentDate,
    handleNavigation,
    handleAddEvent,
    showAllTodayEvents,
    setShowAllTodayEvents,
    today,
    getDaysInMonth,
    isToday,
    formatTime,
    getEventsForDate,

}) {
    return (
        <div className="w-80 bg-[#ffffff] shadow-lg rounded-lg m-4 h-fit">
            <div className="bg-[#1E3A8A] text-[#ffffff] font-bold p-6 rounded-t-lg">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                            <FAIcon icon="calendar" size="24" />
                            {currentDate.toLocaleDateString('en-US', { month: 'long' })}
                        </h1>
                        <p className="text-blue-100 text-sm font-medium">{currentDate.getFullYear()}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleNavigation(-1)}
                            className="p-2 hover:bg-[#1E3A8A] rounded-lg transition-colors hover:cursor-pointer"
                        >
                            <FAIcon icon="chevron-left" size="20" />
                        </button>
                        <button
                            onClick={() => handleNavigation(1)}
                            className="p-2 hover:bg-blue-700 rounded-lg transition-colors hover:cursor-pointer"
                        >
                            <FAIcon icon="chevron-right" size="20" />
                        </button>
                    </div>
                </div>

                {/* Mini Calendar */}
                <div className="mb-6">
                    <div className="grid grid-cols-7 gap-1 text-xs mb-3">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                            <div key={day} className="text-center text-blue-200 font-semibold">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentDate).map((day, index) => {
                            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                            return (
                                <div
                                    key={index}
                                    className={`text-xs p-2 text-center cursor-pointer rounded transition-colors ${isToday(day)
                                        ? 'bg-yellow-400 text-blue-900 font-bold'
                                        : !isCurrentMonth
                                            ? 'text-blue-300 hover:bg-blue-700'
                                            : 'text-[#ffffff] hover:bg-blue-700'
                                        }`}
                                    onClick={() => setCurrentDate(new Date(day))}
                                >
                                    {day.getDate()}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="p-6">



                {/* Quick Actions */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="px-1 bg-green-600 rounded-lg">
                            <FAIcon icon="star" className="text-[#ffffff]" size="16" />
                        </div>
                        <h3 className="font-bold text-gray-900">Quick Actions</h3>
                    </div>
                    <button
                        onClick={handleAddEvent}
                        className="w-full p-3 bg-[#1E3A8A] text-[#ffffff] rounded-lg font-medium hover:cursor-pointer hover:bg-[#3B82F6] transition-colors"
                    >
                        <FAIcon icon="plus" className="mr-2" size="16" />
                        Add Event
                    </button>
                </div>

                {/* Today's Events */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="px-1 bg-[#1E3A8A] rounded-sm">
                            <FAIcon icon="clock" className="text-[#ffffff]" size="16" />
                        </div>
                        <h3 className="font-bold text-gray-900">Today's Events</h3>
                    </div>

                    <div className="space-y-3">
                        {getEventsForDate(today).length > 0 ? (
                            <>
                                {(showAllTodayEvents
                                    ? getEventsForDate(today)
                                    : getEventsForDate(today).slice(0, 3)
                                ).map(event => (
                                    <div
                                        key={event.id}
                                        className="p-3 rounded-lg border-l-4 bg-gray-50"
                                        style={{ borderLeftColor: event.color }}
                                    >
                                        <div className="font-semibold text-sm text-gray-900">{event.title}</div>
                                        <div className="text-xs text-gray-600">
                                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                        </div>
                                    </div>
                                ))}

                                {getEventsForDate(today).length > 3 && (
                                    <button
                                        onClick={() => setShowAllTodayEvents(prev => !prev)}
                                        className="text-xs text-blue-600 hover:cursor-pointer hover:underline"
                                    >
                                        {showAllTodayEvents
                                            ? 'Show less'
                                            : `Show ${getEventsForDate(today).length - 3} more`}
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="text-gray-500 text-sm italic">No events today</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}