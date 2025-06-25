import React, { useState } from 'react';
import { getIndianDate, initialEvents } from './EventsData';
import { FAIcon } from './FAIcons';


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('Month');
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [expandedDates, setExpandedDates] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    color: '#3b82f6'
  });
  const today = getIndianDate();

  const isSameDate = (d1, d2) => (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );

  const isToday = (date) => isSameDate(date, today);

  const timeToMinutes = (timeStr) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    return hour * 60 + minute;
  };

  const calculateDuration = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes - startMinutes;
  };
  const formatDate = (date) => {
    const istDate = new Date(date.getTime() + 330 * 60 * 1000);
    return istDate.toISOString().split('T')[0];
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };
  const getEventsForWeek = (startDate) => {
    const weekEvents = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      weekEvents.push({
        date,
        events: getEventsForDate(date)
      });
    }
    return weekEvents;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      if (days.length > 42) break;
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const handleTimeSlotClick = (date, hour) => {
    const selectedDateTime = new Date(date);
    setSelectedDate(selectedDateTime);
    setSelectedTimeSlot(hour);
    setEditingEvent(null);
    setEventForm({
      title: '',
      date: formatDate(selectedDateTime),
      startTime: `${String(hour).padStart(2, '0')}:00`,
      endTime: `${String(hour + 1).padStart(2, '0')}:00`,
      color: '#3b82f6'
    });
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      date: selectedDate ? formatDate(selectedDate) : formatDate(currentDate),
      startTime: '09:00',
      endTime: '10:00',
      color: '#3b82f6'
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      color: event.color
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      setEvents(events.map(e =>
        e.id === editingEvent.id
          ? { ...eventForm, id: editingEvent.id }
          : e
      ));
    } else {
      const newEvent = {
        ...eventForm,
        id: Math.max(...events.map(e => e.id), 0) + 1
      };
      setEvents([...events, newEvent]);
    }
    setShowEventModal(false);
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getWeekStart = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  };

  const colorOptions = [
    '#3b82f6', '#10b981', '#ef4444', '#8b5cf6',
    '#06b6d4', '#f59e0b', '#ec4899', '#84cc16'
  ];

  const renderMonthView = () => {
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
                      className="text-xs text-blue-600 hover:underline"
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


  const renderWeekView = () => {
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

  const renderDayView = () => {
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
              const topPosition = (startMinutes * 160) / 60; // 5rem = 80px
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

  const handleNavigation = (direction) => {
    if (view === 'Month') {
      navigateMonth(direction);
    } else if (view === 'Week') {
      navigateWeek(direction);
    } else {
      navigateDay(direction);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
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
                {getEventsForDate(today).slice(0, 3).map(event => (
                  <div key={event.id} className="p-3 rounded-lg border-l-4 bg-gray-50"
                    style={{ borderLeftColor: event.color }}>
                    <div className="font-semibold text-sm text-gray-900">{event.title}</div>
                    <div className="text-xs text-gray-600">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </div>
                  </div>
                ))}
                {getEventsForDate(today).length === 0 && (
                  <div className="text-gray-500 text-sm italic">No events today</div>
                )}
              </div>
            </div>



          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-[#ffffff] rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-[#1E40AF] mb-2 flex items-center gap-3">

                    Calendar View
                  </h2>
                  <p className="text-black text-lg font-bold">
                    {currentDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 rounded-lg border border-[#1E40AF]">
                    {['Month', 'Week', 'Day'].map(viewType => (
                      <button
                        key={viewType}
                        onClick={() => setView(viewType)}
                        className={`px-6 py-3  rounded-md transition-colors font-medium hover:cursor-pointer ${view === viewType
                          ? 'bg-[#1E40AF] text-[#ffffff] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                          }`}
                      >
                        {viewType}
                      </button>
                    ))}

                  </div>
                </div>
                <div className="flex items-center gap-4">

                  <button
                    onClick={handleAddEvent}
                    className="w-full p-3 bg-[#1E40AF]  text-[#ffffff] rounded-lg font-medium hover:cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    <FAIcon icon="plus" className="mr-2" size="16" />
                    Add Event
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-6">
            {view === 'Month' && renderMonthView()}
            {view === 'Week' && renderWeekView()}
            {view === 'Day' && renderDayView()}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-md backdrop-saturate-150 flex items-center justify-center z-50">          <div className="bg-[#ffffff] rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="bg-[#1E3A8A] text-[#ffffff] p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 hover:bg-blue-700 rounded-lg hover:cursor-pointer transition-colors"
              >
                <FAIcon icon="times" size="20" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300  hover:cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={eventForm.startTime}
                    onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={eventForm.endTime}
                    onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300  hover:cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setEventForm({ ...eventForm, color })}
                      className={`w-8 h-8 rounded-full border-2 hover:cursor-pointer ${eventForm.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEvent}
                className="flex-1 bg-[#1E3A8A] text-[#ffffff]  hover:cursor-pointer py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button
                onClick={() => setShowEventModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 hover:cursor-pointer py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;