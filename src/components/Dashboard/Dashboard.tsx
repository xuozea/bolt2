import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, TrendingUp, Star, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useQueue } from '../../contexts/QueueContext';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { userAppointments, businesses, getCurrentQueuePosition, getEstimatedWaitTime } = useQueue();

  const upcomingAppointments = userAppointments.filter(
    app => app.status === 'confirmed' && app.appointmentDate.toDate() > new Date()
  );

  const stats = [
    {
      label: 'Total Appointments',
      value: userAppointments.length,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Upcoming',
      value: upcomingAppointments.length,
      icon: Clock,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Businesses Visited',
      value: new Set(userAppointments.map(app => app.businessId)).size,
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Queue Position',
      value: upcomingAppointments.length > 0 ? getCurrentQueuePosition(upcomingAppointments[0].id) : 0,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.displayName || 'User'}!
        </h1>
        <p className="text-gray-600">Here's your appointment overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200/20"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 3).map((appointment) => {
                const business = businesses.find(b => b.id === appointment.businessId);
                const queuePosition = getCurrentQueuePosition(appointment.id);
                const waitTime = getEstimatedWaitTime(appointment.id);
                
                return (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{business?.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{appointment.service}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(appointment.appointmentDate.toDate(), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {format(appointment.appointmentDate.toDate(), 'HH:mm')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Position #{queuePosition}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          ~{waitTime} min wait
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Favorite Businesses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200/20"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Businesses</h2>
          <div className="space-y-4">
            {businesses.slice(0, 3).map((business) => (
              <div
                key={business.id}
                className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{business.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 capitalize">{business.type}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {business.address}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {business.rating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {business.currentQueue} in queue
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;