import { AmenityHealth, MaintenanceTicket, SecurityAlert, User } from './types';

export const MAINTENANCE_TICKETS: MaintenanceTicket[] = [
    {
        id: 'm1',
        amenity: 'Cinema',
        category: 'Electrical',
        title: 'Broken Projector',
        description: 'The projector is repeatedly flickering and turning off after 5 minutes of use.',
        status: 'Awaiting Parts',
        dateSubmitted: '2026-10-18T08:30:00Z',
        image: require('../assets/images/cinema_room_1772270813184.png'),
        assignedTo: 'Electrical Team',
        eta: 'Oct 25, 2026',
        timeline: [
            { status: 'Reported', date: '2026-10-18T08:30:00Z', note: 'Resident reported broken projector.' },
            { status: 'Under Review', date: '2026-10-18T10:15:00Z', note: 'Management reviewed issue.' },
            { status: 'In Progress', date: '2026-10-19T09:00:00Z', note: 'Technician inspected wiring and projector.' },
            { status: 'Awaiting Parts', date: '2026-10-19T11:30:00Z', note: 'Replacement bulb ordered.' },
        ],
        adminNotes: [
            'Technician inspected wiring and projector.',
            'Replacement bulb ordered.',
        ],
    },
    {
        id: 'm2',
        amenity: 'Gym',
        category: 'Equipment',
        title: 'Treadmill #3 Out of Order',
        description: 'Treadmill belt is slipping at high speeds. Needs urgent maintenance.',
        status: 'Reported',
        dateSubmitted: '2026-10-21T14:15:00Z',
        image: require('../assets/images/amenities/amenity_gym_1772311901760.png'),
        timeline: [
            { status: 'Reported', date: '2026-10-21T14:15:00Z', note: 'Issue logged.' }
        ],
        adminNotes: [],
    },
    {
        id: 'm3',
        amenity: 'Clubhouse',
        category: 'Structural',
        title: 'Damaged Lounge Chairs',
        description: 'Two chairs near the fireplace have broken legs. Currently stacked in the corner.',
        status: 'In Progress',
        dateSubmitted: '2026-10-15T09:00:00Z',
        image: require('../assets/images/clubhouse_1772270829896.png'),
        assignedTo: 'Furniture Repair',
        eta: 'Oct 23, 2026',
        timeline: [
            { status: 'Reported', date: '2026-10-15T09:00:00Z' },
            { status: 'Under Review', date: '2026-10-15T10:00:00Z' },
            { status: 'In Progress', date: '2026-10-16T14:00:00Z', note: 'Chairs sent out for repair.' },
        ],
        adminNotes: [
            'Chairs picked up by repair service on Oct 16.'
        ],
    },
    {
        id: 'm4',
        amenity: 'Pool',
        category: 'Cleanliness',
        title: 'Leaves & Debris in Pool',
        description: 'Excessive leaves in the shallow end after the storm. Needs skimming.',
        status: 'Resolved',
        dateSubmitted: '2026-10-10T16:20:00Z',
        image: require('../assets/images/swimming_pool_1772270867118.png'),
        assignedTo: 'Pool Maintenance',
        timeline: [
            { status: 'Reported', date: '2026-10-10T16:20:00Z' },
            { status: 'In Progress', date: '2026-10-11T08:00:00Z', note: 'Pool crew dispatched.' },
            { status: 'Resolved', date: '2026-10-11T10:30:00Z', note: 'Pool skimmed and filter checked.' },
        ],
        adminNotes: [
            'Pool crew dispatched at 8AM.',
            'Pool skimmed and filter checked.'
        ]
    }
];

export const AMENITY_HEALTH: AmenityHealth[] = [
    { amenity: 'Cinema', status: 'Minor issues reported', indicator: 'yellow' },
    { amenity: 'Clubhouse', status: 'Minor issues reported', indicator: 'yellow' },
    { amenity: 'Pool', status: 'No issues', indicator: 'green' },
    { amenity: 'Gym', status: 'Multiple active issues', indicator: 'red' },
    { amenity: 'Meeting Room', status: 'Good condition', indicator: 'green' },
    { amenity: 'Braai Area', status: 'Good condition', indicator: 'green' },
];

export const SECURITY_ALERTS: SecurityAlert[] = [
    {
        id: 's1',
        type: 'Noise Disturbance',
        timestamp: '2026-09-27T23:45:00Z',
        status: 'Resolved',
    },
    {
        id: 's2',
        type: 'Uninvited Guest',
        timestamp: '2026-09-20T18:30:00Z',
        status: 'Resolved',
    }
];

export const CURRENT_USER: User = {
    id: 'u1',
    name: 'Keletso Ntseno',
    email: 'keletso@example.com',
    unit: 'Unit 402',
    property: 'The Oakhaven Estate',
    building: 'Block C',
};
