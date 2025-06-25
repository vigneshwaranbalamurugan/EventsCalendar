export const getIndianDate = () => {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000;
    return new Date(now.getTime() + offset);
};

export const formatDate = (date) =>
    new Date(date.getTime() + 330 * 60000).toISOString().split('T')[0];

export const isSameDate = (d1, d2) => (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
);

export const isToday = (date) => isSameDate(date, getIndianDate());

export const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
};
