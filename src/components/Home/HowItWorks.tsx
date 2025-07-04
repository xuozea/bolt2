import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, CheckCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: 'Find Your Service',
      description: 'Browse through hundreds of verified businesses in your area',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Calendar,
      title: 'Book Your Slot',
      description: 'Choose your preferred time and service with just a few clicks',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Clock,
      title: 'Track Your Queue',
      description: 'Get real-time updates on your queue position and wait time',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'Enjoy Your Service',
      description: 'Arrive at the perfect time and enjoy your service without waiting',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started is simple. Follow these easy steps to revolutionize your service booking experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-200">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                )}
                
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;