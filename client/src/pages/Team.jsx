import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import TeamMemberCard from '../components/TeamMemberCard';
import { mergeFallbackTeamMembers } from '../data/fallbackTeam';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [role, setRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const teamRoleLabels = {
    faculty: 'Faculty',
    chairman: 'Chairperson',
    'student-chairperson': 'Vice Chairperson',
    president: 'President',
    'core-team': 'Core Team'
  };
  const groupedRoles = ['faculty', 'chairman', 'student-chairperson', 'president', 'core-team'];

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    filterTeam();
  }, [team, role]);

  const fetchTeam = async () => {
    try {
      const res = await axios.get('/api/team');
      setTeam(mergeFallbackTeamMembers(res.data || []));
    } catch (error) {
      console.error('Error fetching team:', error);
      setTeam(mergeFallbackTeamMembers());
    } finally {
      setLoading(false);
    }
  };

  const filterTeam = () => {
    if (role === 'all') {
      setFilteredTeam(team);
    } else {
      setFilteredTeam(team.filter(member => member.role === role));
    }
  };

  const roles = ['faculty', 'chairman', 'student-chairperson', 'president', 'core-team'];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-50 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Meet Our Team
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Dedicated professionals driving innovation, education, and community impact.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-4 py-2 rounded-lg capitalize font-medium transition-all duration-300 ${
                  role === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {teamRoleLabels[r]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : role === 'all' ? (
            groupedRoles.map((roleKey) => {
              const members = team.filter((member) => member.role === roleKey);
              if (members.length === 0) return null;

              return (
                <div key={roleKey}>
                  <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl bg-slate-950/70 p-6 shadow-xl">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-sky-300">{teamRoleLabels[roleKey]}</p>
                      <h2 className="mt-3 text-3xl font-bold text-white">{teamRoleLabels[roleKey]} Members</h2>
                    </div>
                    <p className="text-sm text-slate-400">Showing {members.length} {members.length === 1 ? 'member' : 'members'}</p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {members.map((member) => (
                      <TeamMemberCard key={member._id} member={member} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : filteredTeam.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredTeam.map((member) => (
                <TeamMemberCard key={member._id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">No team members found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
