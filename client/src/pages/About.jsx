import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function About() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get('/api/content/about');
      setContent(res.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

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
            About Us
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Learn about our mission, values, and the journey that makes us unique.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* IEEE Education Society Section */}
          <motion.div
            className="glassmorphism p-12 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 gradient-text">IEEE Education Society</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                IEEE Education Society (EDS) is one of the largest technical societies within IEEE, dedicated to advancing education and technology. With a rich history spanning several decades, EDS has become the premier organization for educators, students, and professionals in the field of technology and engineering education.
              </p>
              <p>
                Our global network includes over 400,000 members across 160 countries, united by a passion for innovation, knowledge sharing, and professional development.
              </p>
              <p>
                IEEE EDS focuses on various domains including:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Engineering Education</li>
                <li>Educational Technology</li>
                <li>Professional Development</li>
                <li>Student Mentorship</li>
                <li>Research and Innovation</li>
              </ul>
            </div>
          </motion.div>

          {/* Student Branch Chapter Section */}
          <motion.div
            className="glassmorphism p-12 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 gradient-text">Our Student Branch Chapter</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                Our Student Branch Chapter serves as a vibrant hub for students passionate about technology and education. We are committed to bridging the gap between academic learning and industry practices.
              </p>
              <p>
                Through our chapter, students get exposure to:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Technical workshops and hands-on training</li>
                <li>Networking with industry professionals</li>
                <li>Mentorship from experienced faculty and engineers</li>
                <li>Participation in hackathons and competitions</li>
                <li>Leadership and team development opportunities</li>
                <li>Career guidance and placement assistance</li>
              </ul>
            </div>
          </motion.div>

          {/* Vision & Mission Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="glassmorphism p-8 rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Vision</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To inspire and empower a global community of learners to innovate, lead, and create positive change through technology and education.
              </p>
            </motion.div>

            <motion.div
              className="glassmorphism p-8 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-cyan-600">Mission</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To provide world-class technical education, foster innovation, develop future leaders, and create sustainable impact through technology and knowledge sharing.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <motion.div
            className="glassmorphism p-12 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-8 gradient-text">Our Core Values</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Excellence', desc: 'We strive for the highest standards in everything we do.' },
                { title: 'Innovation', desc: 'We embrace new ideas and creative solutions.' },
                { title: 'Collaboration', desc: 'We believe in the power of teamwork and knowledge sharing.' },
                { title: 'Integrity', desc: 'We uphold ethical principles in all our actions.' },
                { title: 'Inclusivity', desc: 'We welcome diverse perspectives and create inclusive communities.' },
                { title: 'Impact', desc: 'We focus on creating meaningful and lasting positive change.' }
              ].map((value, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-bold text-lg mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
