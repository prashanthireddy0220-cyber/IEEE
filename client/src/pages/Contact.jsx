import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiInstagram } from 'react-icons/fi';
import axios from 'axios';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, you'd send this to a backend service
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: FiLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/ieee-education-society-kare-97b490381/', hoverClass: 'hover:bg-blue-500/20', iconClass: 'text-blue-600' },
    { icon: FiInstagram, label: 'Instagram', href: 'https://www.instagram.com/kare_ieee_eds_official/', hoverClass: 'hover:bg-purple-500/20', iconClass: 'text-purple-600' },
    { icon: FiMail, label: 'Email', href: 'mailto:ieee-eds-sbc@college.edu', hoverClass: 'hover:bg-red-500/20', iconClass: 'text-red-600' }
  ];

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
            Get In Touch
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <motion.div
              className="glassmorphism p-8 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-bold mb-2">Email</h3>
              <a href="mailto:contact@ieee-sbc.edu" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                contact@ieee-sbc.edu
              </a>
            </motion.div>

            <motion.div
              className="glassmorphism p-8 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiPhone className="text-cyan-600 text-xl" />
              </div>
              <h3 className="font-bold mb-2">Phone</h3>
              <a href="tel:+1234567890" className="text-gray-600 dark:text-gray-400 hover:text-cyan-600">
                +1 (234) 567-890
              </a>
            </motion.div>

            <motion.div
              className="glassmorphism p-8 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-purple-600 text-xl" />
              </div>
              <h3 className="font-bold mb-2">Location</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Kalasalingam University<br />Krishnankoil, Tamil Nadu
              </p>
            </motion.div>
          </div>

          {/* Contact Form and Social */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              className="glassmorphism p-8 rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              {submitted && (
                <motion.div
                  className="p-4 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Thank you for your message! We'll get back to you soon.
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none transition-all"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none transition-all"
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none transition-all resize-none"
                    placeholder="Your message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="glassmorphism p-8 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Follow us on social media to stay updated with our latest events, achievements, and announcements.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`flex items-center gap-3 rounded-lg bg-white/5 p-4 transition-all duration-300 ${item.hoverClass}`}
                    >
                      <item.icon className={`text-2xl ${item.iconClass}`} />
                      <span className="font-semibold">{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
