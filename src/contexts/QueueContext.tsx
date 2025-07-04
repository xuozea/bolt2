import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, query, onSnapshot, orderBy, where, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { businessService } from '../services/businessService';
import { mockBusinesses } from '../utils/mockData';

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  businessId: string;
  businessName: string;
  service: string;
  appointmentDate: Timestamp;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  queuePosition: number;
  estimatedWaitTime: number;
  createdAt: Timestamp;
  notes?: string;
}

export interface Business {
  id: string;
  name: string;
  type: 'salon' | 'spa' | 'tattoo' | 'barber' | 'other';
  services: string[];
  address: string;
  phone: string;
  email: string;
  latitude?: number;
  longitude?: number;
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  averageServiceTime: number;
  currentQueue: number;
  rating: number;
  image: string;
}

interface QueueContextType {
  appointments: Appointment[];
  businesses: Business[];
  loading: boolean;
  userAppointments: Appointment[];
  getCurrentQueuePosition: (appointmentId: string) => number;
  getEstimatedWaitTime: (appointmentId: string) => number;
  initializeMockData: () => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

interface QueueProviderProps {
  children: ReactNode;
}

export const QueueProvider: React.FC<QueueProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
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
      const appointmentsList: Appointment[] = [];
      snapshot.forEach((doc) => {
        appointmentsList.push({ id: doc.id, ...doc.data() } as Appointment);
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

  const getCurrentQueuePosition = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return 0;

    const businessAppointments = appointments.filter(
      app => app.businessId === appointment.businessId &&
             app.status === 'confirmed' &&
             app.appointmentDate.toDate() <= appointment.appointmentDate.toDate()
    );

    return businessAppointments.length;
  };

  const getEstimatedWaitTime = (appointmentId: string) => {
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