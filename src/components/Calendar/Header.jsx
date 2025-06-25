import { FAIcon } from "./FAIcons";

export default function CalendarHeader({ currentDate, setView, handleAddEvent, view }) {
    return (
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
    );
}