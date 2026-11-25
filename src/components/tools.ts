// "Bratislava, kosice,, Bratislava " -> ['Bratislava', 'kosice']
export const parseCities = (query: string): string[] => {
  const seen = new Set<string>();
  return query
    .split(',')
    .map((city) => city.trim())
    .filter((city) => {
      const key = city.toLowerCase();
      if (!city || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
};

export const toDate = (currentDate: Date = new Date()) => {
  // let date = new Date();
  // const today = date.toDateString();
  // return today;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]
    }`;
  return date;
};
