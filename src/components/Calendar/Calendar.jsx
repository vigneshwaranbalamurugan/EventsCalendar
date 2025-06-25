import React, { useState } from 'react';
import { getIndianDate, initialEvents } from './EventsData';
import renderMonthView from './views/MonthView';
import renderWeekView from './views/WeekView';
import renderDayView from './views/DayView';
import CalendarSidebar from './Sidebar';
import CalendarHeader from './Header';
import EventModal from './EventModal';
import { formatDate, isToday, formatTime } from './utils/dateUtils';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('Month');
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showAllTodayEvents, setShowAllTodayEvents] = useState(false);
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
    const { date, startTime, endTime } = eventForm;
    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    // Filter out the event being edited (if editing)
    const otherEvents = editingEvent
      ? events.filter(e => e.id !== editingEvent.id && e.date === date)
      : events.filter(e => e.date === date);

    const hasOverlap = otherEvents.some(e => {
      const existingStart = timeToMinutes(e.startTime);
      const existingEnd = timeToMinutes(e.endTime);

      // Check if new event overlaps with existing event
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (hasOverlap) {
      alert("Oops! This time slot is already booked with another event. Please choose a different time.");
      return;
    }

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


  const getWeekStart = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  };

  const colorOptions = [
    '#3b82f6', '#10b981', '#ef4444', '#8b5cf6',
    '#06b6d4', '#f59e0b', '#ec4899', '#84cc16'
  ];


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
        <CalendarSidebar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          handleNavigation={handleNavigation}
          handleAddEvent={handleAddEvent}
          showAllTodayEvents={showAllTodayEvents}
          setShowAllTodayEvents={setShowAllTodayEvents}
          today={today}
          getDaysInMonth={getDaysInMonth}
          isToday={isToday}
          formatTime={formatTime}
          getEventsForDate={getEventsForDate}
        />

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Header */}
          <CalendarHeader
            currentDate={currentDate}
            setView={setView}
            handleAddEvent={handleAddEvent}
            view={view}
          />

          {/* Content Area */}
          <div className="mt-6">
            {view === 'Month' && renderMonthView({ currentDate, selectedDate, setSelectedDate, expandedDates, setExpandedDates, handleEditEvent, getDaysInMonth, formatDate, formatTime, isToday, getEventsForDate })}
            {view === 'Week' && renderWeekView({ currentDate, handleTimeSlotClick, handleEditEvent, getWeekStart, isToday, formatTime, getEventsForWeek, timeToMinutes, calculateDuration })}
            {view === 'Day' && renderDayView({ currentDate, handleTimeSlotClick, handleEditEvent, handleDeleteEvent, getEventsForDate, timeToMinutes, calculateDuration, formatTime })}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          setShowEventModal={setShowEventModal}
          eventForm={eventForm}
          setEventForm={setEventForm}
          handleSaveEvent={handleSaveEvent}
          editingEvent={editingEvent}
          colorOptions={colorOptions}
        />
      )}
    </div>
  );
};

export default Calendar;