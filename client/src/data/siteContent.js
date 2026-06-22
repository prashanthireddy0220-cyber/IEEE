export const roleConfig = {
  chairman: {
    label: 'SBC Chairman',
    badge: 'Governance Lead',
    permissions: [
      'Add, edit, approve, and archive events',
      'Manage photo albums and chapter gallery',
      'Edit homepage, team, and faculty content',
      'Publish announcements and approve updates',
      'View analytics and manage users'
    ]
  },
  faculty: {
    label: 'Faculty Coordinator',
    badge: 'Academic Oversight',
    permissions: [
      'Review chapter activity progress',
      'Approve proposed events and notices',
      'Maintain faculty profiles and reports',
      'Monitor chapter performance analytics'
    ]
  },
  'core-team': {
    label: 'Core Team',
    badge: 'Operations Team',
    permissions: [
      'Create and edit events',
      'Upload event gallery assets',
      'Maintain team details and reports',
      'Submit updates for approval'
    ]
  },
  'student-chairperson': {
    label: 'Student Chairperson',
    badge: 'Student Leadership',
    permissions: [
      'Publish featured events and activities',
      'Manage event photos and gallery curation',
      'Update homepage highlights and announcements',
      'Approve participation activity records'
    ]
  },
  student: {
    label: 'Student Member',
    badge: 'Community Access',
    permissions: [
      'View chapter updates and register for events',
      'Track participation and achievements'
    ]
  }
};

export const testimonials = [
  {
    name: 'Ananya R.',
    role: 'Student Volunteer',
    quote: 'IEEE Education Society gave me mentors, confidence, and a real platform to turn ideas into technical impact.'
  },
  {
    name: 'Rahul S.',
    role: 'Workshop Participant',
    quote: 'The chapter events feel industry-ready. Every session helped me connect classroom learning with practical skills.'
  },
  {
    name: 'Prof. Meera K.',
    role: 'Faculty Mentor',
    quote: 'This community nurtures leadership and professional maturity while keeping student innovation at the center.'
  }
];

export const heroStats = [
  { label: 'Members', value: '320+' },
  { label: 'Events Conducted', value: '48+' },
  { label: 'Workshops', value: '22+' },
  { label: 'Achievements', value: '36+' }
];

export const ieeeHighlights = [
  'Global technical network and scholarly ecosystem',
  'Hands-on learning through chapter-led activities',
  'Leadership, volunteering, and research exposure',
  'Professional growth across academics and industry'
];
