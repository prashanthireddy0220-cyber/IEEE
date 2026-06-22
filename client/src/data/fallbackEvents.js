export const fallbackEvents = [
  {
    _id: 'fallback-event-hyperlaunch',
    title: 'HyperLaunch',
    description:
      '36-hour non-stop hackathon experience Internship opportunities for top performers 2 IEEE credits for all participants .Industry mentors and expert guidance Exciting prizes and certificates. Students from various departments competed to develop cutting-edge solutions for modern educational challenges, showcasing their technical prowess, creativity, and teamwork.',
    date: '24,25 & 26 January 2026',
    time: '36 hours',
    venue: '9th Block Seminar Hall',
    location: 'Kalasalingam University',
    category: 'hackathon',
    status: 'completed',
    registrations: 50,
    winners: [
      { position: '1st Place', symbol: '🥇', teamName: '"404 Error"', prizeMoney: '13000 Rs' },
      { position: '2nd Place', symbol: '🥈', teamName: 'Atlas', prizeMoney: '7000 Rs' },
      { position: '3rd Place', symbol: '🥉', teamName: 'OG', prizeMoney: '5000 Rs' }
    ]
  },
  {
    _id: 'fallback-event-eduthon',
    title: 'Eduthon',
    description:
      'A completed hackathon focused on innovation and problem solving. Dates, schedule, and detailed highlights can be added later.',
    date: '13 & 14 March 2026',
    time: '24 hours',
    venue: '9th Block Seminar Hall',
    location: 'Kalasalingam University',
    category: 'hackathon',
    status: 'completed',
    registrations: 30,
    winners: [
      { position: '1st Place', symbol: '🥇', teamName: 'Syntax Squad', prizeMoney: '4000 Rs' },
      { position: '2nd Place', symbol: '🥈', teamName: 'Dev Vengers', prizeMoney: '3000 Rs' },
      { position: '3rd Place', symbol: '🥉', teamName: 'Triple Sparks', prizeMoney: '1000 Rs' }
    ]
  }
];

export function mergeFallbackEvents(events = []) {
  const mergedEvents = [...events];

  fallbackEvents.forEach((fallbackEvent) => {
    const exists = mergedEvents.some((event) => {
      const eventTitle = event?.title?.trim().toLowerCase();
      const fallbackTitle = fallbackEvent.title.trim().toLowerCase();

      return event?._id === fallbackEvent._id || eventTitle === fallbackTitle;
    });

    if (!exists) {
      mergedEvents.push(fallbackEvent);
    }
  });

  return mergedEvents.sort((first, second) => {
    const firstDate = first?.date ? new Date(first.date).getTime() : 0;
    const secondDate = second?.date ? new Date(second.date).getTime() : 0;

    return secondDate - firstDate;
  });
}

export function getFallbackEventById(id) {
  return fallbackEvents.find((event) => event._id === id) || null;
}

export const fallbackAchievements = fallbackEvents.map((event) => ({
  title: `${event.title} Winners`,
  category: 'hackathon',
  description: (event.winners || [])
    .map((winner) => `${winner.position}: ${winner.teamName}`)
    .join(' | ')
}));
