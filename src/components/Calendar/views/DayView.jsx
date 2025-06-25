import { FAIcon } from "../FAIcons";

export default function renderDayView({
  currentDate,
  handleTimeSlotClick,
  handleEditEvent,
  handleDeleteEvent,
  getEventsForDate,
  timeToMinutes,
  calculateDuration,
  formatTime
}) {
  const dayEvents = getEventsForDate(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="max-h-160 overflow-y-auto relative">
      <div className="flex">
        {/* Time Column */}
        <div className="w-24 bg-gray-50 border-r border-gray-200">
          {hours.map(hour => (
            <div key={hour} className="h-[10rem] border-b border-gray-200 p-4 text-right">
              <span className="text-xs text-gray-600 font-medium">
                {hour === 0 ? '12 AM' : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Event Grid */}
        <div className="flex-1 relative overflow-hidden">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-[10rem] border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors relative group"
              onClick={() => handleTimeSlotClick(currentDate, hour)}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FAIcon icon="plus" className="text-blue-500" size="24" />
              </div>
            </div>
          ))}

          {/* Events */}
          {dayEvents.map(event => {
            const startMinutes = timeToMinutes(event.startTime);
            const duration = calculateDuration(event.startTime, event.endTime);
            const topPosition = (startMinutes * 160) / 60;
            const height = Math.max((duration * 160) / 60, 60);

            return (
              <div
                key={event.id}
                className="absolute inset-x-4  rounded p-4 cursor-pointer shadow-sm border-l-4 overflow-hidden bg-opacity-10"
                style={{
                  top: `${topPosition}px`,
                  height: `${height}px`,
                  backgroundColor: `${event.color}15`,
                  borderLeftColor: event.color,
                  zIndex: 10
                }}
                onClick={() => handleEditEvent(event)}
              >
                <div className="font-bold text-sm text-gray-900 mb-1 truncate">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </div>
                <div className="font-medium text-base text-gray-800 break-words">
                  {event.title}
                </div>
                <div className="flex gap-3 mt-3 flex-wrap">
                  <FAIcon
                    icon="edit"
                    className="cursor-pointer hover:opacity-70 transition-opacity text-gray-600"
                    size="16"
                  />
                  <FAIcon
                    icon="trash"
                    className="cursor-pointer hover:opacity-70 transition-opacity text-red-500"
                    size="16"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

  );
};