import { createContext, useContext, useState } from 'react';
import { roomsAssigned } from '../data/roomsAssigned';

const StaffRoomsContext = createContext(null);

export function StaffRoomsProvider({ children }) {
  const [rooms, setRooms] = useState(roomsAssigned);

  return <StaffRoomsContext.Provider value={{ rooms, setRooms }}>{children}</StaffRoomsContext.Provider>;
}

export function useStaffRooms() {
  const context = useContext(StaffRoomsContext);
  if (!context) {
    throw new Error('useStaffRooms must be used within a StaffRoomsProvider');
  }
  return context;
}

