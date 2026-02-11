import { v4 as uuidv4 } from 'uuid';

export const db = {
  users: [],
  stations: [
    { id: 'ST1', code: 'KLS', name: 'KL Sentral', city: 'Kuala Lumpur' },
    { id: 'ST2', code: 'IPH', name: 'Ipoh', city: 'Ipoh' },
    { id: 'ST3', code: 'PNG', name: 'Butterworth', city: 'Penang' },
    { id: 'ST4', code: 'JHB', name: 'JB Sentral', city: 'Johor Bahru' }
  ],
  trains: [
    {
      id: 'TR1',
      train_number: '9101',
      train_name: 'RailGo North Express',
      source_station_id: 'ST1',
      destination_station_id: 'ST2',
      departure_time: '07:30',
      arrival_time: '09:50'
    },
    {
      id: 'TR2',
      train_number: '9202',
      train_name: 'RailGo Coastal',
      source_station_id: 'ST1',
      destination_station_id: 'ST3',
      departure_time: '08:40',
      arrival_time: '12:55'
    }
  ],
  schedules: [],
  seats: [],
  bookings: [],
  passengers: [],
  payments: [],
  seatLocks: []
};

export function createId(prefix) {
  return `${prefix}_${uuidv4()}`;
}
