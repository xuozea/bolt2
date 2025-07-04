import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Calendar, Star } from 'lucide-react';

const Hero: React.FC = () => {
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
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Skip the{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Queue
            </span>
            , Not the Service
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Book appointments at your favorite salons, spas, and services. 
            Get real-time queue updates and never wait in line again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/businesses"
              className="bg-white/80 backdrop-blur-lg text-gray-700 px-8 py-4 rounded-xl font-medium border border-gray-200/20 hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              Browse Businesses
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200/20 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg w-fit mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Hero;