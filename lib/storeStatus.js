export const getStoreStatus = () => {
    // Get current time in Italy
    const now = new Date();
    const italyTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Rome" }));

    // Day of week (0 = Sunday, 1 = Monday, etc.)
    const day = italyTime.getDay();
    const hour = italyTime.getHours();
    const minute = italyTime.getMinutes();
    const currentTime = hour * 100 + minute;

    // Time ranges (HHMM format)
    // Lunch: 12:00 - 15:00
    // Dinner: 18:00 - 23:00
    const lunchStart = 1200;
    const lunchEnd = 1500;
    const dinnerStart = 1800;
    const dinnerEnd = 2300;

    const isOpen = (currentTime >= lunchStart && currentTime < lunchEnd) ||
        (currentTime >= dinnerStart && currentTime < dinnerEnd);

    return {
        isOpen,
        statusText: isOpen ? 'Aperto ora' : 'Negozio Chiuso',
        nextOpen: !isOpen ? getNextOpenText(currentTime, lunchStart, dinnerStart) : null
    };
};

const getNextOpenText = (currentTime, lunchStart, dinnerStart) => {
    if (currentTime < lunchStart) return 'Apre alle 12:00';
    if (currentTime < dinnerStart) return 'Apre alle 18:00';
    return 'Apre domani alle 12:00';
};
