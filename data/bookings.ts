import { Booking } from './types';

export const BOOKINGS: Booking[] = [
    {
        id: 'b1',
        amenityId: 'a1', // Private Cinema
        date: '2026-10-15',
        timeSlot: '18:00 - 22:00',
        guestCount: 4,
        noiseLevel: 'Medium',
        musicInvolved: true,
        status: 'Confirmed',
        guestNames: ['John Doe', 'Jane Smith'],
    },
    {
        id: 'b2',
        amenityId: 'a3', // Braai Pavilion
        date: '2026-10-12',
        timeSlot: '14:00 - 18:00',
        guestCount: 8,
        noiseLevel: 'Low',
        musicInvolved: false,
        status: 'Completed',
        reviewed: true,
        rating: 5,
        feedback: 'Amazing facilities!',
    },
    {
        id: 'b2_new',
        amenityId: 'a1', // Private Cinema
        date: '2026-10-14',
        timeSlot: '18:00 - 22:00',
        guestCount: 4,
        noiseLevel: 'Medium',
        musicInvolved: true,
        status: 'Completed',
        reviewed: false,
    },
    {
        id: 'b3',
        amenityId: 'a2', // Clubhouse
        date: '2026-10-20',
        timeSlot: '20:00 - 00:00',
        guestCount: 20,
        noiseLevel: 'High',
        musicInvolved: true,
        status: 'Pending',
    },
    {
        id: 'b4',
        amenityId: 'a4', // Infinity Pool
        date: '2026-10-22',
        timeSlot: '10:00 - 12:00',
        guestCount: 2,
        noiseLevel: 'Low',
        musicInvolved: false,
        status: 'Cancelled',
    },
    {
        id: 'b5',
        amenityId: 'a5', // Exec Meeting Room
        date: '2026-10-25',
        timeSlot: '09:00 - 12:00',
        guestCount: 5,
        noiseLevel: 'Low',
        musicInvolved: false,
        status: 'Confirmed',
    }
];
