import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiImage,
  FiMapPin,
  FiMessageCircle,
  FiMonitor,
  FiTarget,
  FiUsers
} from 'react-icons/fi';
import Hero from '../components/Hero';
import BenefitsSection from '../components/BenefitsSection';
import EventCard from '../components/EventCard';
import TeamMemberCard from '../components/TeamMemberCard';
import { fallbackAchievements, mergeFallbackEvents } from '../data/fallbackEvents';
import { mergeFallbackTeamMembers } from '../data/fallbackTeam';
import { ieeeHighlights, testimonials } from '../data/siteContent';

const fallbackGallery = [
  { _id: 'g1', category: 'workshop', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g2', category: 'seminar', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g3', category: 'community', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g4', category: 'competition', image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80' }
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [team, setTeam] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState('');
  const navigate = useNavigate();
  const coreTeamRoleOrder = ['faculty', 'chairman', 'student-chairperson', 'core-team'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, teamRes, galleryRes, achievementsRes] = await Promise.all([
          axios.get('/api/events'),
          axios.get('/api/team'),
          axios.get('/api/gallery'),
          axios.get('/api/achievements')
        ]);

        setEvents(mergeFallbackEvents(eventsRes.data || []));
        setTeam(mergeFallbackTeamMembers(teamRes.data || []));
        setGallery(galleryRes.data || []);
        setAchievements(achievementsRes.data || []);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setEvents(mergeFallbackEvents());
        setTeam(mergeFallbackTeamMembers());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((event) => event.status !== 'completed')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3),
    [events]
  );

  const featuredTeam = useMemo(() => {
    const rankedTeam = [...team].sort(
      (first, second) => coreTeamRoleOrder.indexOf(first.role) - coreTeamRoleOrder.indexOf(second.role)
    );

    return rankedTeam
      .filter((member) => coreTeamRoleOrder.includes(member.role))
      .slice(0, 4);
  }, [team]);

  const galleryPreview = useMemo(() => {
    if (gallery.length === 0) return fallbackGallery;

    return gallery
      .flatMap((album) =>
        (album.images || []).slice(0, 2).map((image, index) => ({
          _id: `${album._id}-${index}`,
          category: album.category || album.albumName || 'chapter',
          image: image.url,
          caption: image.caption || album.albumName
        }))
      )
      .slice(0, 6);
  }, [gallery]);

  const achievementPreview = useMemo(
    () => (achievements.length > 0 ? achievements.slice(0, 4) : fallbackAchievements),
    [achievements]
  );

  const statHighlights = [
    { icon: FiBookOpen, value: '12+', label: 'Learning Tracks' },
    { icon: FiCalendar, value: '24/7', label: 'Chapter Momentum' },
    { icon: FiUsers, value: '4', label: 'Leadership Roles' },
    { icon: FiAward, value: '100%', label: 'Student-Focused' }
  ];

  return (
    <div>
      <Hero />

      <section id="about-ieee" className="section-shell py-24">
        <div className="section-frame grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            className="premium-card p-8 sm:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
              <span className="eyebrow">About IEEE Education Society</span>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Advancing education, technology, and global professional excellence.</h2>
            <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">
              IEEE Education Society drives innovation in engineering and technology education through research, collaboration, publications, and practice. It supports educators, students, and professionals who want education to remain relevant, impactful, and future-oriented.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ieeeHighlights.map((item) => (
                <div key={item} className="glassmorphism-sm rounded-3xl p-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="mt-1 text-cyan-500" />
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            viewport={{ once: true }}
          >
            <div className="premium-card p-8">
              <span className="eyebrow">About The SBC</span>
              <h3 className="mt-4 text-3xl font-bold">A student branch chapter built for technical growth, visibility, and leadership.</h3>
              <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
                Our Student Branch Chapter connects students with workshops, seminars, project opportunities, networking, faculty mentorship, and practical learning experiences that elevate both competence and confidence.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="premium-card p-7">
                <FiTarget className="text-sky-600 dark:text-sky-300" size={26} />
                <h4 className="mt-4 text-2xl font-bold">Vision</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  To cultivate a future-facing student community that leads with knowledge, ethics, and innovation.
                </p>
              </div>
              <div className="premium-card p-7">
                <FiMonitor className="text-cyan-600 dark:text-cyan-300" size={26} />
                <h4 className="mt-4 text-2xl font-bold">Mission</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  To deliver chapter experiences that combine education, technology, professional development, and community service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <BenefitsSection />

      <section className="section-shell py-24">
        <div className="section-frame">
          <motion.div
            className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl">
              <span className="eyebrow">Upcoming Events</span>
              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Workshops, seminars, and flagship experiences that keep the chapter moving.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Explore the next wave of professional sessions, speaker events, and student-led technical programs.
              </p>
            </div>
            <button onClick={() => navigate('/events')} className="btn btn-secondary">
              Explore Events
              <FiArrowRight size={16} />
            </button>
          </motion.div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {(upcomingEvents.length > 0 ? upcomingEvents : events.slice(0, 3)).map((event) => (
                <EventCard key={event._id} event={event} onClick={() => navigate(`/events/${event._id}`)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-shell py-24">
        <div className="section-frame">
          <motion.div
            className="premium-card overflow-hidden p-8 sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <span className="eyebrow">Admin Experience</span>
                <h2 className="mt-4 text-4xl font-bold">A powerful role-based system for chapter operations.</h2>
                <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
                  Chairman, faculty, core team, and student chairperson each get a structured workflow for approvals, publishing, reports, gallery management, and homepage updates.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Events Management', description: 'Upcoming and past events, registration links, speakers, timelines, and auto-archival control.' },
                  { title: 'Gallery System', description: 'Album creation, event-wise categorization, image uploads, search, and lightbox-ready previews.' },
                  { title: 'Team Management', description: 'Core team and faculty profile updates with role metadata and social presence.' },
                  { title: 'Announcements & Analytics', description: 'Featured homepage content, approvals, notices, and chapter performance visibility.' }
                ].map((item) => (
                  <div key={item.title} className="glassmorphism-sm rounded-[24px] p-5">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell py-24">
        <div className="section-frame">
          <motion.div
            className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl">
              <span className="eyebrow">Core Team Preview</span>
              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Faculty-backed student leadership with strong professional identity.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Meet the people shaping chapter direction, technical execution, and member experience.
              </p>
            </div>
            <button onClick={() => navigate('/team')} className="btn btn-secondary">
              View Core Team
              <FiArrowRight size={16} />
            </button>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {featuredTeam.map((member) => (
              <TeamMemberCard key={member._id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-24">
        <div className="section-frame">
          <motion.div
            className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl">
              <span className="eyebrow">Gallery Preview</span>
              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">A chapter story told through workshops, events, and student energy.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Curated event-wise visuals with hover interactions, lightbox preview, and strong chapter branding.
              </p>
            </div>
            <button onClick={() => navigate('/gallery')} className="btn btn-secondary">
              View Full Gallery
              <FiImage size={16} />
            </button>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {galleryPreview.map((item, index) => (
              <motion.button
                key={item._id}
                className={`group relative overflow-hidden rounded-[28px] ${index % 3 === 0 ? 'md:col-span-2' : ''}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                viewport={{ once: true }}
                onClick={() => setLightboxImage(item.image)}
              >
                <img src={item.image} alt={item.caption || item.category} className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  {item.category}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-24">
        <div className="section-frame grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            className="premium-card p-8 sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow">Achievements</span>
              <h2 className="mt-4 text-4xl font-bold">Celebrating recognitions, technical wins, and community milestones.</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {achievementPreview.map((achievement) => (
                  <div key={achievement.title} className="glassmorphism-sm rounded-[24px] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                      {achievement.category || 'highlight'}
                  </div>
                  <h3 className="mt-3 text-lg font-bold">{achievement.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            viewport={{ once: true }}
          >
            <div className="premium-card grid gap-4 p-8 sm:grid-cols-2">
              {statHighlights.map((item) => (
                <div key={item.label} className="rounded-[24px] bg-white/70 p-5 dark:bg-white/5">
                  <item.icon className="text-sky-500" size={22} />
                  <div className="mt-3 text-3xl font-bold gradient-text">{item.value}</div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="premium-card overflow-hidden p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-600 dark:text-cyan-300">
                  <FiMessageCircle size={22} />
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Testimonials</div>
                  <div className="text-2xl font-bold">What members say</div>
                </div>
              </div>

              <div className="overflow-hidden">
                <div className="marquee-track flex w-[200%] gap-5">
                  {[...testimonials, ...testimonials].map((testimonial, index) => (
                    <div key={`${testimonial.name}-${index}`} className="w-full max-w-sm flex-shrink-0 rounded-[24px] bg-white/75 p-5 dark:bg-white/5">
                      <div className="text-base leading-8 text-slate-700 dark:text-slate-200">“{testimonial.quote}”</div>
                      <div className="mt-5">
                        <div className="font-bold">{testimonial.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell pb-8 pt-24">
        <div className="section-frame">
          <motion.div
            className="premium-card overflow-hidden p-8 sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
              <div>
                <span className="eyebrow">Contact</span>
                <h2 className="mt-4 text-4xl font-bold">Let’s build a stronger IEEE student community together.</h2>
                <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
                  Reach out for collaborations, faculty coordination, memberships, workshops, and chapter activity partnerships.
                </p>

                <div className="mt-8 grid gap-4">
                  <div className="glassmorphism-sm rounded-[24px] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">Email</div>
                    <div className="mt-2 text-base font-semibold">ieee-eds-sbc@college.edu</div>
                  </div>
                  <div className="glassmorphism-sm rounded-[24px] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Location</div>
                    <div className="mt-2 flex items-center gap-2 text-base font-semibold">
                      <FiMapPin />
                      Kalasalingam University, Krishnankoil
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className="input-field" placeholder="Your name" />
                  <input className="input-field" placeholder="Email address" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className="input-field" placeholder="Phone number" />
                  <input className="input-field" placeholder="Subject" />
                </div>
                <textarea className="input-field min-h-[180px] resize-none" placeholder="Tell us how you’d like to connect with the chapter" />
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <button className="btn btn-primary w-full sm:w-auto">Send Message</button>
                  <div className="glassmorphism-sm rounded-[24px] p-2">
                    <iframe
                      title="Chapter Location"
                      src="https://www.google.com/maps?q=Kalasalingam%20Academy%20of%20Research%20and%20Education&output=embed"
                      className="h-36 w-full rounded-[18px] border-0 sm:w-72"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {lightboxImage && (
        <button
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4"
          onClick={() => setLightboxImage('')}
        >
          <img src={lightboxImage} alt="Gallery preview" className="max-h-[88vh] max-w-[92vw] rounded-[28px] object-cover shadow-2xl" />
        </button>
      )}
    </div>
  );
}
