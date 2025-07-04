import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

export class AppointmentService {
  constructor() {
    this.appointmentsCollection = collection(db, 'appointments');
  }

  async createAppointment(appointmentData) {
    try {
      const docRef = await addDoc(this.appointmentsCollection, {
        ...appointmentData,
        createdAt: serverTimestamp(),
      });
      
      toast.success('Appointment booked successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to book appointment');
      throw error;
    }
  }

  async updateAppointment(appointmentId, updates) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, updates);
      
      toast.success('Appointment updated successfully!');
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
      throw error;
    }
  }

  async cancelAppointment(appointmentId) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
      
      toast.success('Appointment cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
      throw error;
    }
  }

  async deleteAppointment(appointmentId) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await deleteDoc(appointmentRef);
      
      toast.success('Appointment deleted successfully!');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
      throw error;
    }
  }

  subscribeToUserAppointments(userId, callback) {
    const q = query(
      this.appointmentsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const appointments = [];
      snapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      callback(appointments);
    });
  }

  subscribeToBusinessAppointments(businessId, callback) {
    const q = query(
      this.appointmentsCollection,
      where('businessId', '==', businessId),
      orderBy('appointmentDate', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const appointments = [];
      snapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      callback(appointments);
    });
  }
}

export const appointmentService = new AppointmentService();