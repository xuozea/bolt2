import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Star, Calendar } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: '10K+',
      label: 'Happy Customers',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Clock,
      number: '5M+',
      label: 'Minutes Saved',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Star,
      number: '500+',
      label: 'Partner Businesses',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Calendar,
      number: '50K+',
      label: 'Appointments Booked',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join the growing community of users who've revolutionized their service booking experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stats;