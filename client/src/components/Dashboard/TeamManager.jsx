import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiEdit2 } from 'react-icons/fi';
import { isObsoleteStandaloneMember } from '../../data/fallbackTeam';

export default function TeamManager() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get('/api/team');
      setTeam((res.data || []).filter((member) => !isObsoleteStandaloneMember(member)));
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setFormData({
      ...member,
      socialMedia: member.socialMedia || {}
    });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photo: typeof reader.result === 'string' ? reader.result : prev.photo
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/team/${editingId}`, formData);
      setTeam(team.map(m => m._id === editingId ? res.data : m));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Team Manager</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage team member information</p>
      </div>

      {/* Team List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : team.length > 0 ? (
          team.map((member, idx) => (
            <motion.div
              key={member._id}
              className="glassmorphism p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {editingId === member._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={formData.photo || ''}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="Photo URL"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-500"
                  />
                  {formData.photo && (
                    <img
                      src={formData.photo}
                      alt={formData.name || 'Team member preview'}
                      className="h-24 w-24 rounded-2xl object-cover border border-white/10"
                    />
                  )}
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="Phone"
                  />
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={formData.socialMedia?.linkedin || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="LinkedIn URL"
                  />
                  <input
                    type="text"
                    value={formData.socialMedia?.instagram || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="Instagram URL"
                  />
                  <input
                    type="text"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="Bio"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleSave}
                      className="btn btn-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  {member.photo && (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-20 w-20 rounded-3xl object-cover shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-blue-600 font-semibold capitalize mb-2">{member.role}</p>
                    {member.phone && <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {member.phone}</p>}
                    {member.email && <p className="text-sm text-gray-600 dark:text-gray-400">Email: {member.email}</p>}
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                    >
                      <FiEdit2 className="text-blue-600" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No team members found
          </div>
        )}
      </div>
    </div>
  );
}
