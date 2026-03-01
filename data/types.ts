export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    unit: string;
    property: string;
    building: string;
}

export type AmenityStatus = 'Clean & Ready' | 'Under Maintenance' | 'Booked next in 30 mins' | 'Available';

export interface Amenity {
    id: string;
    name: string;
    image: any;
    tags: string[];
    status: AmenityStatus;
    capacity: number;
    quietHours: string;
    maxDuration: string;
    rules: string[];
    rating: number;
}

export type BookingStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

export interface Booking {
    id: string;
    amenityId: string;
    date: string;
    timeSlot: string;
    guestCount: number;
    noiseLevel: 'Low' | 'Medium' | 'High';
    musicInvolved: boolean;
    status: BookingStatus;
    guestNames?: string[];
    reviewed?: boolean;
    rating?: number;
    feedback?: string;
    issues?: string[];
}

export interface EstateEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    type: 'Social' | 'Fitness' | 'Community' | 'Meeting';
}

export type MaintenanceStatus = 'Reported' | 'Under Review' | 'In Progress' | 'Awaiting Parts' | 'Resolved';

export interface MaintenanceTimeline {
    status: MaintenanceStatus;
    date: string;
    note?: string;
}

export interface MaintenanceTicket {
    id: string;
    amenity: string;
    category: string;
    title: string;
    description: string;
    status: MaintenanceStatus;
    dateSubmitted: string;
    image?: any;
    assignedTo?: string;
    eta?: string;
    timeline: MaintenanceTimeline[];
    adminNotes: string[];
}

export interface AmenityHealth {
    amenity: string;
    status: 'Good condition' | 'Minor issues reported' | 'Multiple active issues' | 'No issues';
    indicator: 'green' | 'yellow' | 'red';
}

export type AlertType = 'Fight' | 'Uninvited Guest' | 'Noise Disturbance' | 'Medical' | 'Suspicious Activity';

export interface SecurityAlert {
    id: string;
    type: AlertType;
    timestamp: string;
    status: 'Active' | 'Resolved';
}
