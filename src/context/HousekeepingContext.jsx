import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initialRooms,
  defaultChecklist,
  estimatedTimes,
  defaultAmenities,
  defaultMinibarItems,
  housekeepingStaff,
} from '../data/housekeepingData';

const HousekeepingContext = createContext(null);
const STORAGE_KEY = 'glimmora_housekeeping';

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadHousekeeping() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to load housekeeping data from localStorage', err);
  }
  return null;
}

function saveHousekeeping(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save housekeeping data to localStorage', err);
  }
}

export function HousekeepingProvider({ children }) {
  const [rooms, setRooms] = useState(() => {
    const loaded = loadHousekeeping();
    return loaded?.rooms || initialRooms;
  });

  const [staffStats, setStaffStats] = useState(() => {
    const loaded = loadHousekeeping();
    return loaded?.staffStats || housekeepingStaff.reduce((acc, staff) => {
      acc[staff.id] = {
        roomsCleaned: 0,
        totalEfficiency: 0,
        vipHandled: 0,
        onTimeCompletions: 0,
        totalCompletions: 0,
      };
      return acc;
    }, {});
  });

  useEffect(() => {
    saveHousekeeping({ rooms, staffStats });
  }, [rooms, staffStats]);

  const assignRoom = useCallback((roomId, staffId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { ...room, assignedTo: staffId };
      }
      return room;
    }));
  }, []);

  const startCleaning = useCallback((roomId) => {
    const now = new Date().toISOString();
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          status: 'inprogress',
          startedAt: now,
          pausedAt: null,
          totalPausedMs: 0, // Reset paused time on start
        };
      }
      return room;
    }));
    return { type: 'started', roomId, timestamp: now };
  }, []);

  const pauseCleaning = useCallback((roomId) => {
    const now = new Date().toISOString();
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          pausedAt: now,
        };
      }
      return room;
    }));
    return { type: 'paused', roomId, timestamp: now };
  }, []);

  // FIX HK-C02: Accumulate paused time when resuming
  const resumeCleaning = useCallback((roomId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId && room.pausedAt) {
        const pausedDuration = Date.now() - new Date(room.pausedAt).getTime();
        return {
          ...room,
          pausedAt: null,
          totalPausedMs: (room.totalPausedMs || 0) + pausedDuration,
        };
      }
      return room;
    }));
  }, []);

  // FIX HK-C03: Fix race condition by calculating stats in single update
  const finishCleaning = useCallback((roomId) => {
    const now = new Date();
    let statsToUpdate = null;

    setRooms(prev => {
      return prev.map(room => {
        if (room.id === roomId) {
          const startTime = new Date(room.startedAt);
          // Subtract paused time from actual time calculation
          const totalPausedMs = room.totalPausedMs || 0;
          const actualMinutes = Math.round((now - startTime - totalPausedMs) / 60000);

          // Prepare stats update data
          if (room.assignedTo) {
            const isOnTime = actualMinutes <= room.estimatedTimeMinutes;
            statsToUpdate = {
              staffId: room.assignedTo,
              isOnTime,
              isVip: room.vip
            };
          }

          return {
            ...room,
            status: 'clean',
            completedAt: now.toISOString(),
            actualTimeMinutes: actualMinutes,
            pausedAt: null,
            totalPausedMs: 0,
          };
        }
        return room;
      });
    });

    // Update staff stats after room update is complete
    if (statsToUpdate) {
      setStaffStats(prevStats => ({
        ...prevStats,
        [statsToUpdate.staffId]: {
          ...prevStats[statsToUpdate.staffId],
          roomsCleaned: (prevStats[statsToUpdate.staffId]?.roomsCleaned || 0) + 1,
          totalCompletions: (prevStats[statsToUpdate.staffId]?.totalCompletions || 0) + 1,
          onTimeCompletions: (prevStats[statsToUpdate.staffId]?.onTimeCompletions || 0) + (statsToUpdate.isOnTime ? 1 : 0),
          vipHandled: (prevStats[statsToUpdate.staffId]?.vipHandled || 0) + (statsToUpdate.isVip ? 1 : 0),
        },
      }));
    }

    return { type: 'finished', roomId, timestamp: now.toISOString() };
  }, []);

  const markAsInspected = useCallback((roomId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { ...room, status: 'inspected' };
      }
      return room;
    }));
    return { type: 'inspected', roomId, timestamp: new Date().toISOString() };
  }, []);

  const markAsDirty = useCallback((roomId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          status: 'dirty',
          startedAt: null,
          completedAt: null,
          actualTimeMinutes: null,
          pausedAt: null,
          checklist: room.checklist.map(item => ({ ...item, completed: false })),
          amenities: { ...defaultAmenities },
        };
      }
      return room;
    }));
  }, []);

  const markOutOfService = useCallback((roomId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { ...room, status: 'out_of_service' };
      }
      return room;
    }));
  }, []);

  const updateAmenities = useCallback((roomId, field, value) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          amenities: { ...room.amenities, [field]: value },
        };
      }
      return room;
    }));
  }, []);

  const updateMinibarItem = useCallback((roomId, itemName, consumed) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          minibarItems: room.minibarItems.map(item =>
            item.name === itemName ? { ...item, consumed } : item
          ),
        };
      }
      return room;
    }));
  }, []);

  // FIX HK-M01: Auto-complete room when all checklist items done
  const completeChecklistItem = useCallback((roomId, itemId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        const updatedChecklist = room.checklist.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        // Check if all items are now completed and room is in progress
        const allCompleted = updatedChecklist.every(item => item.completed);
        const shouldAutoComplete = allCompleted && room.status === 'inprogress';

        return {
          ...room,
          checklist: updatedChecklist,
          // Auto-mark as clean if all checklist items completed
          ...(shouldAutoComplete && {
            status: 'clean',
            completedAt: new Date().toISOString(),
            actualTimeMinutes: room.startedAt
              ? Math.round((Date.now() - new Date(room.startedAt).getTime() - (room.totalPausedMs || 0)) / 60000)
              : null,
          }),
        };
      }
      return room;
    }));
  }, []);

  const addNote = useCallback((roomId, text) => {
    const newNote = {
      id: generateId('note'),
      text,
      timestamp: new Date().toISOString(),
    };
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          notes: [...room.notes, newNote],
        };
      }
      return room;
    }));
    return newNote;
  }, []);

  const removeNote = useCallback((roomId, noteId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          notes: room.notes.filter(n => n.id !== noteId),
        };
      }
      return room;
    }));
  }, []);

  const updateRoomPriority = useCallback((roomId, priority) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { ...room, priority };
      }
      return room;
    }));
  }, []);

  // FIX HK-M03: Save original priority when enabling VIP, restore when disabling
  const toggleVIP = useCallback((roomId) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        if (!room.vip) {
          // Enabling VIP - save original priority and set to urgent
          return {
            ...room,
            vip: true,
            originalPriority: room.priority,
            priority: 'urgent',
          };
        } else {
          // Disabling VIP - restore original priority
          return {
            ...room,
            vip: false,
            priority: room.originalPriority || 'medium',
            originalPriority: null,
          };
        }
      }
      return room;
    }));
  }, []);

  const applyRoomChecklistTemplate = useCallback((roomId, roomType) => {
    const template = defaultChecklist[roomType] || defaultChecklist.Standard;
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          checklist: template.map(item => ({
            ...item,
            id: generateId('cl'),
            completed: false,
          })),
          estimatedTimeMinutes: estimatedTimes[roomType] || 25,
        };
      }
      return room;
    }));
  }, []);

  const calculateRoomEfficiency = useCallback((roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.actualTimeMinutes || !room.estimatedTimeMinutes) return null;

    const timeEfficiency = Math.min(
      (room.estimatedTimeMinutes / room.actualTimeMinutes) * 50,
      50
    );

    const completedChecklist = room.checklist.filter(item => item.completed).length;
    const totalChecklist = room.checklist.length;
    const checklistRate = totalChecklist > 0 ? (completedChecklist / totalChecklist) * 30 : 30;

    const completedAmenities = Object.values(room.amenities).filter(Boolean).length;
    const totalAmenities = Object.keys(room.amenities).length;
    const amenitiesRate = totalAmenities > 0 ? (completedAmenities / totalAmenities) * 20 : 20;

    return Math.round(timeEfficiency + checklistRate + amenitiesRate);
  }, [rooms]);

  const calculateStaffEfficiency = useCallback((staffId) => {
    const stats = staffStats[staffId];
    if (!stats || stats.totalCompletions === 0) return null;

    const staffRooms = rooms.filter(r => r.assignedTo === staffId && r.actualTimeMinutes);
    if (staffRooms.length === 0) return null;

    const avgEfficiency = staffRooms.reduce((sum, room) => {
      const eff = calculateRoomEfficiency(room.id);
      return sum + (eff || 0);
    }, 0) / staffRooms.length;

    const onTimeRate = stats.totalCompletions > 0
      ? (stats.onTimeCompletions / stats.totalCompletions) * 100
      : 0;

    return {
      avgEfficiency: Math.round(avgEfficiency),
      onTimeRate: Math.round(onTimeRate),
      roomsCleaned: stats.roomsCleaned,
      vipHandled: stats.vipHandled,
    };
  }, [rooms, staffStats, calculateRoomEfficiency]);

  // FIX HK-M05: Prevent duplicate deep clean notes
  const generateDeepCleanSchedule = useCallback(() => {
    const today = new Date();
    const overdueRooms = [];

    setRooms(prev => prev.map(room => {
      const dueDate = new Date(room.deepCleanDueDate);
      if (today > dueDate && room.status !== 'out_of_service') {
        // Check if deep clean note already exists
        const hasDeepCleanNote = room.notes.some(
          note => note.text.includes('DEEP CLEAN REQUIRED')
        );

        overdueRooms.push(room);

        // Only add note if it doesn't already exist
        if (hasDeepCleanNote) {
          return { ...room, priority: 'urgent' };
        }

        return {
          ...room,
          priority: 'urgent',
          notes: [
            ...room.notes,
            {
              id: generateId('note'),
              text: 'DEEP CLEAN REQUIRED - Overdue',
              timestamp: today.toISOString(),
            },
          ],
        };
      }
      return room;
    }));

    return overdueRooms;
  }, []);

  const resetDeepCleanDate = useCallback((roomId) => {
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 7);

    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { ...room, deepCleanDueDate: newDueDate.toISOString() };
      }
      return room;
    }));
  }, []);

  const calculateMinibarRevenue = useCallback((roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 0;

    return room.minibarItems
      .filter(item => item.consumed)
      .reduce((sum, item) => sum + item.price, 0);
  }, [rooms]);

  const getTotalMinibarRevenue = useCallback(() => {
    return rooms.reduce((total, room) => {
      return total + room.minibarItems
        .filter(item => item.consumed)
        .reduce((sum, item) => sum + item.price, 0);
    }, 0);
  }, [rooms]);

  const autoAssignRooms = useCallback(() => {
    const unassignedRooms = rooms
      .filter(room => !room.assignedTo && room.status === 'dirty')
      .sort((a, b) => {
        if (a.vip !== b.vip) return b.vip ? 1 : -1;
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return a.estimatedTimeMinutes - b.estimatedTimeMinutes;
      });

    const staffWorkload = housekeepingStaff
      .map(staff => ({
        ...staff,
        currentRooms: rooms.filter(r => r.assignedTo === staff.id && r.status !== 'inspected').length,
        efficiencyData: calculateStaffEfficiency(staff.id),
      }))
      .sort((a, b) => {
        const effA = a.efficiencyData?.avgEfficiency || a.efficiency;
        const effB = b.efficiencyData?.avgEfficiency || b.efficiency;
        if (effA !== effB) return effB - effA;
        return a.currentRooms - b.currentRooms;
      });

    const assignments = [];
    const maxRoomsPerStaff = 10;

    for (const room of unassignedRooms) {
      const availableStaff = staffWorkload.find(s => s.currentRooms < maxRoomsPerStaff);
      if (availableStaff) {
        assignments.push({ roomId: room.id, staffId: availableStaff.id, roomNumber: room.roomNumber });
        availableStaff.currentRooms += 1;
      }
    }

    setRooms(prev => prev.map(room => {
      const assignment = assignments.find(a => a.roomId === room.id);
      if (assignment) {
        return { ...room, assignedTo: assignment.staffId };
      }
      return room;
    }));

    return assignments;
  }, [rooms, calculateStaffEfficiency]);

  const getHousekeepingKPIs = useCallback(() => {
    const today = new Date();

    return {
      dirty: rooms.filter(r => r.status === 'dirty').length,
      inProgress: rooms.filter(r => r.status === 'inprogress').length,
      clean: rooms.filter(r => r.status === 'clean').length,
      inspected: rooms.filter(r => r.status === 'inspected').length,
      outOfService: rooms.filter(r => r.status === 'out_of_service').length,
      vipRooms: rooms.filter(r => r.vip && r.status !== 'inspected').length,
      deepCleanDue: rooms.filter(r => {
        const dueDate = new Date(r.deepCleanDueDate);
        return today > dueDate && r.status !== 'out_of_service';
      }).length,
      avgCleaningTime: Math.round(
        rooms
          .filter(r => r.actualTimeMinutes)
          .reduce((sum, r) => sum + r.actualTimeMinutes, 0) /
        (rooms.filter(r => r.actualTimeMinutes).length || 1)
      ),
      totalRooms: rooms.length,
      minibarRevenue: getTotalMinibarRevenue(),
    };
  }, [rooms, getTotalMinibarRevenue]);

  const getRoomsByFloor = useCallback((floor) => {
    return rooms.filter(r => r.floor === floor);
  }, [rooms]);

  const getRoomsByStatus = useCallback((status) => {
    if (!status || status === 'all') return rooms;
    return rooms.filter(r => r.status === status);
  }, [rooms]);

  const getRoomById = useCallback((roomId) => {
    return rooms.find(r => r.id === roomId);
  }, [rooms]);

  const getActiveCleanings = useCallback(() => {
    return rooms
      .filter(r => r.status === 'inprogress')
      .map(room => {
        const staff = housekeepingStaff.find(s => s.id === room.assignedTo);
        const elapsedMinutes = room.startedAt
          ? Math.round((Date.now() - new Date(room.startedAt).getTime()) / 60000)
          : 0;
        return {
          ...room,
          staffName: staff?.name || 'Unassigned',
          elapsedMinutes,
        };
      })
      .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  }, [rooms]);

  // FIX HK-M02: Show alerts for rooms due within 7 days (not 3)
  const getDeepCleanAlerts = useCallback(() => {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    return rooms
      .filter(r => {
        const dueDate = new Date(r.deepCleanDueDate);
        return dueDate <= sevenDaysFromNow && r.status !== 'out_of_service';
      })
      .map(room => ({
        ...room,
        isOverdue: new Date(room.deepCleanDueDate) < today,
        daysUntilDue: Math.ceil(
          (new Date(room.deepCleanDueDate) - today) / (1000 * 60 * 60 * 24)
        ),
      }))
      .sort((a, b) => new Date(a.deepCleanDueDate) - new Date(b.deepCleanDueDate));
  }, [rooms]);

  const getFloors = useCallback(() => {
    const floors = [...new Set(rooms.map(r => r.floor))];
    return floors.sort((a, b) => a - b);
  }, [rooms]);

  const value = {
    rooms,
    housekeepingStaff,
    assignRoom,
    startCleaning,
    pauseCleaning,
    resumeCleaning,
    finishCleaning,
    markAsInspected,
    markAsDirty,
    markOutOfService,
    updateAmenities,
    updateMinibarItem,
    completeChecklistItem,
    addNote,
    removeNote,
    updateRoomPriority,
    toggleVIP,
    applyRoomChecklistTemplate,
    calculateRoomEfficiency,
    calculateStaffEfficiency,
    generateDeepCleanSchedule,
    resetDeepCleanDate,
    calculateMinibarRevenue,
    getTotalMinibarRevenue,
    autoAssignRooms,
    getHousekeepingKPIs,
    getRoomsByFloor,
    getRoomsByStatus,
    getRoomById,
    getActiveCleanings,
    getDeepCleanAlerts,
    getFloors,
    staffStats,
  };

  return (
    <HousekeepingContext.Provider value={value}>
      {children}
    </HousekeepingContext.Provider>
  );
}

export function useHousekeeping() {
  const context = useContext(HousekeepingContext);
  if (!context) {
    throw new Error('useHousekeeping must be used within a HousekeepingProvider');
  }
  return context;
}
