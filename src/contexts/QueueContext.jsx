import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { businessService } from '../services/businessService';
import { mockBusinesses } from '../utils/mockData';

const QueueContext = createContext();

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

export const QueueProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize mock data if no businesses exist
  const initializeMockData = async () => {
    try {
      for (const business of mockBusinesses) {
        await businessService.createBusiness(business);
      }
    } catch (error) {
      console.error('Error initializing mock data:', error);
    }
  };

  useEffect(() => {
    // Listen to all appointments for real-time updates
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentsList = [];
      snapshot.forEach((doc) => {
        appointmentsList.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(appointmentsList);
    });

    // Listen to businesses
    const unsubscribeBusinesses = businessService.subscribeToBusinesses((businessesList) => {
      setBusinesses(businessesList);
      setLoading(false);
      
      // If no businesses exist, initialize with mock data
      if (businessesList.length === 0) {
        initializeMockData();
      }
    });

    return () => {
      unsubscribeAppointments();
      unsubscribeBusinesses();
    };
  }, []);

  const userAppointments = appointments.filter(
    (appointment) => appointment.userId === currentUser?.uid
  );

  const getCurrentQueuePosition = (appointmentId) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return 0;

    const businessAppointments = appointments.filter(
      app => app.businessId === appointment.businessId &&
             app.status === 'confirmed' &&
             app.appointmentDate.toDate() <= appointment.appointmentDate.toDate()
    );

    return businessAppointments.length;
  };

  const getEstimatedWaitTime = (appointmentId) => {
    const position = getCurrentQueuePosition(appointmentId);
    const appointment = appointments.find(app => app.id === appointmentId);
    const business = businesses.find(b => b.id === appointment?.businessId);
    
    if (!business) return 0;
    
    return position * business.averageServiceTime;
  };

  const value = {
    appointments,
    businesses,
    loading,
    userAppointments,
    getCurrentQueuePosition,
    getEstimatedWaitTime,
    initializeMockData
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};