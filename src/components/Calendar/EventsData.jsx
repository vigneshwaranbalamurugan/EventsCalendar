export const getIndianDate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + 330); // IST offset
  return now;
};

const getIndianDateString = () => getIndianDate().toISOString().split('T')[0];

export const initialEvents = [
  {
    id: 1,
    date: getIndianDateString(),
    startTime: "08:15",
    endTime: "09:30",
    color: "#10b981",
    title: "Monthly catch-up"
  },
  {
    id: 2,
    date: getIndianDateString(),
    startTime: "02:00",
    endTime: "5:00",
    color: "#3b82f6",
    title: "1:1 with Heather"
  },
  {
    id: 3,
    date: getIndianDateString(),
    startTime: "11:00",
    endTime: "12:45",
    color: "#ef4444",
    title: "Design Ux Meet-and-Greet"
  },
  {
    id: 4,
    date: "2025-06-24",
    startTime: "15:30",
    endTime: "17:00",
    color: "#06b6d4",
    title: "Happy hour"
  },
  {
    id: 5,
    date: "2025-06-06",
    startTime: "09:00",
    endTime: "10:00",
    color: "#3b82f6",
    title: "English Class"
  },
  {
    id: 6,
    date: "2025-07-06",
    startTime: "12:00",
    endTime: "13:00",
    color: "#8b5cf6",
    title: "EOD Demo Sync"
  },
  {
    id: 7,
    date: "2025-07-05",
    startTime: "00:00",
    endTime: "01:30",
    color: "#f6be23",
    title: "Daily Standup"
  },
  {
    id: 8,
    date: "2025-06-29",
    startTime: "04:30",
    endTime: "07:30",
    color: "#f6501e",
    title: "Weekly catchup"
  },
  {
    id: 9,
    date: "2025-07-29",
    startTime: "14:00",
    endTime: "16:00",
    color: "#ef4444",
    title: "Sprint Planning - Innovation"
  },
  {
    id: 10,
    date: "2025-06-24",
    startTime: "13:00",
    endTime: "14:00",
    color: "#10b981",
    title: "Lunch"
  },
  {
    id: 11,
    date: getIndianDateString(),
    startTime: "14:00",
    endTime: "15:00",
    color: "#8b5cf6",
    title: "Design Huddle"
  },
  {
    id: 12,
    date: "2025-07-05",
    startTime: "14:00",
    endTime: "16:00",
    color: "#ef4444",
    title: "(LesArts) Sprint Planning"
  }
];
