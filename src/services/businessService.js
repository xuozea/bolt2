import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  onSnapshot,
  serverTimestamp,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

export class BusinessService {
  constructor() {
    this.businessesCollection = collection(db, 'businesses');
  }

  async createBusiness(businessData) {
    try {
      const docRef = await addDoc(this.businessesCollection, {
        ...businessData,
        createdAt: serverTimestamp(),
      });
      
      toast.success('Business created successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('Failed to create business');
      throw error;
    }
  }

  async updateBusiness(businessId, updates) {
    try {
      const businessRef = doc(db, 'businesses', businessId);
      await updateDoc(businessRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      toast.success('Business updated successfully!');
    } catch (error) {
      console.error('Error updating business:', error);
      toast.error('Failed to update business');
      throw error;
    }
  }

  subscribeToBusinesses(callback) {
    const q = query(this.businessesCollection, orderBy('name', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const businesses = [];
      snapshot.forEach((doc) => {
        businesses.push({ id: doc.id, ...doc.data() });
      });
      callback(businesses);
    });
  }

  subscribeToBusinessesByType(type, callback) {
    const q = query(
      this.businessesCollection,
      where('type', '==', type),
      orderBy('rating', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const businesses = [];
      snapshot.forEach((doc) => {
        businesses.push({ id: doc.id, ...doc.data() });
      });
      callback(businesses);
    });
  }

  async updateQueueCount(businessId, count) {
    try {
      const businessRef = doc(db, 'businesses', businessId);
      await updateDoc(businessRef, {
        currentQueue: count,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating queue count:', error);
      throw error;
    }
  }
}

export const businessService = new BusinessService();