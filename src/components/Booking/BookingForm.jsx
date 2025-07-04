import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useQueue } from '../../contexts/QueueContext';
import { appointmentService } from '../../services/appointmentService';
import { Timestamp } from 'firebase/firestore';
import { format, addDays, setHours, setMinutes } from 'date-fns';

const BookingForm = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { businesses } = useQueue();
  
  const business = businesses.find(b => b.id === businessId);
  
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
          <button
            onClick={() => navigate('/businesses')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Businesses
          </button>
        </div>
      </div>
    );
  }

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = addDays(new Date(), i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEEE, MMM dd')
      });
    }
    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !businessId) return;

    setLoading(true);
    try {
      const [hours, minutes] = formData.time.split(':').map(Number);
      const appointmentDate = setMinutes(setHours(new Date(formData.date), hours), minutes);

      await appointmentService.createAppointment({
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email || 'User',
        userEmail: currentUser.email || '',
        businessId,
        businessName: business.name,
        service: formData.service,
        appointmentDate: Timestamp.fromDate(appointmentDate),
        status: 'confirmed',
        queuePosition: business.currentQueue + 1,
        estimatedWaitTime: (business.currentQueue + 1) * business.averageServiceTime,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate('/businesses')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Businesses</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Info */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200/20">
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-6 overflow-hidden">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-bold text-white">{business.name}</h2>
                <p className="text-white/80 capitalize">{business.type}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Current Queue</h3>
                <p className="text-gray-600">{business.currentQueue} people waiting</p>
                <p className="text-sm text-gray-500">
                  Estimated wait: ~{business.currentQueue * business.averageServiceTime} minutes
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Book Your Appointment</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a service</option>
                  {business.services.map((service, idx) => (
                    <option key={idx} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <select
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a date</option>
                  {generateDateOptions().map((date) => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a time</option>
                  {generateTimeSlots().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Any special requests or notes..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingForm;