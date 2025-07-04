import { Timestamp } from 'firebase/firestore';

export const mockBusinesses = [
  {
    id: '1',
    name: 'Luxe Hair Studio',
    type: 'salon' as const,
    services: ['Haircut', 'Hair Color', 'Styling', 'Highlights'],
    address: '123 Main St, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'info@luxehairstudio.com',
    latitude: 28.6139, // Delhi coordinates
    longitude: 77.2090,
    openingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '08:00', close: '17:00' },
      sunday: { closed: true, open: '', close: '' }
    },
    averageServiceTime: 45,
    currentQueue: 3,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    name: 'Serenity Spa',
    type: 'spa' as const,
    services: ['Massage', 'Facial', 'Body Treatment', 'Manicure', 'Pedicure'],
    address: '456 Wellness Ave, Spa District',
    phone: '+1 (555) 234-5678',
    email: 'hello@serenityspa.com',
    latitude: 28.6129,
    longitude: 77.2295,
    openingHours: {
      monday: { open: '10:00', close: '19:00' },
      tuesday: { open: '10:00', close: '19:00' },
      wednesday: { open: '10:00', close: '19:00' },
      thursday: { open: '10:00', close: '19:00' },
      friday: { open: '10:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '17:00' }
    },
    averageServiceTime: 60,
    currentQueue: 2,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    name: 'Ink Masters Tattoo',
    type: 'tattoo' as const,
    services: ['Custom Tattoo', 'Touch-up', 'Piercing', 'Consultation'],
    address: '789 Art Street, Creative Quarter',
    phone: '+1 (555) 345-6789',
    email: 'bookings@inkmaststattoo.com',
    latitude: 28.6169,
    longitude: 77.2090,
    openingHours: {
      monday: { closed: true, open: '', close: '' },
      tuesday: { open: '12:00', close: '20:00' },
      wednesday: { open: '12:00', close: '20:00' },
      thursday: { open: '12:00', close: '20:00' },
      friday: { open: '12:00', close: '22:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '12:00', close: '18:00' }
    },
    averageServiceTime: 120,
    currentQueue: 1,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    name: 'Classic Barber Co.',
    type: 'barber' as const,
    services: ['Haircut', 'Beard Trim', 'Shave', 'Styling'],
    address: '321 Vintage Lane, Old Town',
    phone: '+1 (555) 456-7890',
    email: 'appointments@classicbarberco.com',
    latitude: 28.6109,
    longitude: 77.2295,
    openingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '19:00' },
      friday: { open: '08:00', close: '19:00' },
      saturday: { open: '07:00', close: '17:00' },
      sunday: { closed: true, open: '', close: '' }
    },
    averageServiceTime: 30,
    currentQueue: 5,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '5',
    name: 'Glow Beauty Lounge',
    type: 'salon' as const,
    services: ['Facials', 'Waxing', 'Eyebrow Threading', 'Makeup'],
    address: '654 Beauty Blvd, Fashion District',
    phone: '+1 (555) 567-8901',
    email: 'info@glowbeautylounge.com',
    latitude: 28.6149,
    longitude: 77.2090,
    openingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '08:00', close: '19:00' },
      sunday: { open: '10:00', close: '17:00' }
    },
    averageServiceTime: 40,
    currentQueue: 4,
    rating: 4.5,
    image: 'https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '6',
    name: 'Zen Wellness Center',
    type: 'spa' as const,
    services: ['Acupuncture', 'Yoga', 'Meditation', 'Wellness Coaching'],
    address: '987 Harmony Road, Wellness Village',
    phone: '+1 (555) 678-9012',
    email: 'contact@zenwellnesscenter.com',
    latitude: 28.6179,
    longitude: 77.2295,
    openingHours: {
      monday: { open: '06:00', close: '21:00' },
      tuesday: { open: '06:00', close: '21:00' },
      wednesday: { open: '06:00', close: '21:00' },
      thursday: { open: '06:00', close: '21:00' },
      friday: { open: '06:00', close: '21:00' },
      saturday: { open: '07:00', close: '20:00' },
      sunday: { open: '08:00', close: '19:00' }
    },
    averageServiceTime: 75,
    currentQueue: 2,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];