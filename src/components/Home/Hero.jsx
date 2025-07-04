import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Calendar, Star, Sparkles } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Skip the wait and book your slot in advance'
    },
    {
      icon: Users,
      title: 'Real-time Updates',
      description: 'Get live queue updates and estimated wait times'
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book appointments with just a few clicks'
    },
    {
      icon: Star,
      title: 'Quality Service',
      description: 'Connect with top-rated businesses in your area'
    }
  ];

  return (
    <div className="relative overflow-hidden py-20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center mb-6"
          >
            <Sparkles className="w-8 h-8 mr-3" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
              Welcome to the Future of Queuing
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Skip the{' '}
            <span className="gradient-text">
              Queue
            </span>
            <br />
            Not the Service
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Experience seamless appointment booking at your favorite salons, spas, and services. 
            Get real-time queue updates and never wait in line again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="apple-button flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/businesses"
                className="apple-button-secondary text-lg px-8 py-4"
              >
                Browse Businesses
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                className="apple-glass-card p-6 text-center"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Hero;