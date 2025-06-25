import { FAIcon } from "./FAIcons";

export default function EventModal({
  setShowEventModal,
  eventForm,
  setEventForm,
  colorOptions,
  handleSaveEvent,
  editingEvent
}) {
  return (

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
  );
}