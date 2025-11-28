import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const RunnerContext = createContext(null);

// Initial runner tasks seed data
const initialRunnerTasks = [
  {
    id: 'rt-001',
    type: 'delivery',
    title: 'Room Service - Breakfast',
    description: 'Continental breakfast for 2 with extra orange juice',
    room: '305',
    pickupLocation: 'Kitchen',
    deliveryLocation: 'Room 305',
    priority: 'high',
    status: 'inprogress',
    assignedTo: 'run001',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    acceptedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    startedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    completedAt: null,
    signature: null,
    qrVerified: false,
    photos: [],
    notes: [
      { id: 'n1', text: 'Guest requested knock only, no doorbell', timestamp: new Date(Date.now() - 22 * 60000).toISOString(), author: 'System' }
    ],
    estimatedMinutes: 15,
    guestName: 'Mr. Anderson',
    specialInstructions: 'Allergic to nuts - ensure no cross-contamination'
  },
  {
    id: 'rt-002',
    type: 'pickup',
    title: 'Laundry Pickup',
    description: 'Express laundry service - 3 suits for dry cleaning',
    room: '412',
    pickupLocation: 'Room 412',
    deliveryLocation: 'Laundry Room',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'run001',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    acceptedAt: null,
    startedAt: null,
    completedAt: null,
    signature: null,
    qrVerified: false,
    photos: [],
    notes: [],
    estimatedMinutes: 10,
    guestName: 'Ms. Chen',
    specialInstructions: 'Handle with care - designer items'
  },
  {
    id: 'rt-003',
    type: 'delivery',
    title: 'Extra Towels & Amenities',
    description: '4 bath towels, 2 hand towels, shampoo, conditioner',
    room: '208',
    pickupLocation: 'Housekeeping Storage',
    deliveryLocation: 'Room 208',
    priority: 'low',
    status: 'pending',
    assignedTo: 'run001',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    acceptedAt: null,
    startedAt: null,
    completedAt: null,
    signature: null,
    qrVerified: false,
    photos: [],
    notes: [],
    estimatedMinutes: 8,
    guestName: 'Garcia Family',
    specialInstructions: ''
  },
  {
    id: 'rt-004',
    type: 'delivery',
    title: 'VIP Welcome Package',
    description: 'Champagne, fruit basket, welcome card',
    room: '501',
    pickupLocation: 'Concierge Desk',
    deliveryLocation: 'Room 501 (Presidential Suite)',
    priority: 'urgent',
    status: 'accepted',
    assignedTo: 'run001',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    acceptedAt: new Date(Date.now() - 6 * 60000).toISOString(),
    startedAt: null,
    completedAt: null,
    signature: null,
    qrVerified: false,
    photos: [],
    notes: [
      { id: 'n2', text: 'VIP guest arriving at 3 PM - must be ready before', timestamp: new Date(Date.now() - 7 * 60000).toISOString(), author: 'Front Desk' }
    ],
    estimatedMinutes: 12,
    guestName: 'Senator Williams',
    specialInstructions: 'Do not disturb if guest is present. Leave with butler.'
  },
  {
    id: 'rt-005',
    type: 'pickup',
    title: 'Luggage Assistance',
    description: 'Guest checking out - 4 bags to lobby',
    room: '318',
    pickupLocation: 'Room 318',
    deliveryLocation: 'Lobby Bell Desk',
    priority: 'high',
    status: 'completed',
    assignedTo: 'run001',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    acceptedAt: new Date(Date.now() - 118 * 60000).toISOString(),
    startedAt: new Date(Date.now() - 115 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 100 * 60000).toISOString(),
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    qrVerified: true,
    photos: ['luggage_318_1.jpg'],
    notes: [
      { id: 'n3', text: 'All bags secured with guest', timestamp: new Date(Date.now() - 100 * 60000).toISOString(), author: 'Runner' }
    ],
    estimatedMinutes: 15,
    guestName: 'Dr. Patel',
    specialInstructions: ''
  },
  {
    id: 'rt-006',
    type: 'delivery',
    title: 'Spa Amenities',
    description: 'Robe, slippers, spa menu for in-room treatment',
    room: '422',
    pickupLocation: 'Spa Reception',
    deliveryLocation: 'Room 422',
    priority: 'medium',
    status: 'completed',
    assignedTo: 'run001',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    acceptedAt: new Date(Date.now() - 175 * 60000).toISOString(),
    startedAt: new Date(Date.now() - 170 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 160 * 60000).toISOString(),
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    qrVerified: true,
    photos: [],
    notes: [],
    estimatedMinutes: 10,
    guestName: 'Mrs. Thompson',
    specialInstructions: ''
  },
  {
    id: 'rt-007',
    type: 'pickup',
    title: 'Guest Documents',
    description: 'Signed contract documents for business center',
    room: '612',
    pickupLocation: 'Room 612',
    deliveryLocation: 'Business Center',
    priority: 'urgent',
    status: 'pending',
    assignedTo: null,
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    acceptedAt: null,
    startedAt: null,
    completedAt: null,
    signature: null,
    qrVerified: false,
    photos: [],
    notes: [
      { id: 'n4', text: 'Time-sensitive legal documents', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), author: 'Concierge' }
    ],
    estimatedMinutes: 8,
    guestName: 'Mr. Blackwood',
    specialInstructions: 'Handle confidentially'
  }
];

const STORAGE_KEY = 'glimmora_runner_tasks';

export function RunnerProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialRunnerTasks;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Generate unique ID
  const generateId = () => `rt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // Create new runner task
  const createRunnerTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      type: taskData.type || 'delivery',
      title: taskData.title,
      description: taskData.description || '',
      room: taskData.room,
      pickupLocation: taskData.pickupLocation,
      deliveryLocation: taskData.deliveryLocation,
      priority: taskData.priority || 'medium',
      status: 'pending',
      assignedTo: taskData.assignedTo || null,
      createdAt: new Date().toISOString(),
      acceptedAt: null,
      startedAt: null,
      completedAt: null,
      signature: null,
      qrVerified: false,
      photos: [],
      notes: [],
      estimatedMinutes: taskData.estimatedMinutes || 10,
      guestName: taskData.guestName || '',
      specialInstructions: taskData.specialInstructions || ''
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  // Accept a task
  const acceptRunnerTask = useCallback((taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: 'accepted', acceptedAt: new Date().toISOString() }
        : task
    ));
  }, []);

  // Start working on a task
  const startRunnerTask = useCallback((taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: 'inprogress', startedAt: new Date().toISOString() }
        : task
    ));
  }, []);

  // Complete a task with proof of delivery
  const completeRunnerTask = useCallback((taskId, proofData = {}) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? {
            ...task,
            status: 'completed',
            completedAt: new Date().toISOString(),
            signature: proofData.signature || task.signature,
            qrVerified: proofData.qrVerified ?? task.qrVerified,
            photos: proofData.photos ? [...task.photos, ...proofData.photos] : task.photos
          }
        : task
    ));
  }, []);

  // Mark task as urgent
  const markUrgent = useCallback((taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, priority: 'urgent' }
        : task
    ));
  }, []);

  // Add note to task
  const addNote = useCallback((taskId, noteText, author = 'Runner') => {
    const newNote = {
      id: `note-${Date.now()}`,
      text: noteText,
      timestamp: new Date().toISOString(),
      author
    };
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, notes: [...task.notes, newNote] }
        : task
    ));
    return newNote;
  }, []);

  // Upload photo
  const uploadPhoto = useCallback((taskId, photoUrl) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, photos: [...task.photos, photoUrl] }
        : task
    ));
  }, []);

  // Verify QR code
  const verifyQR = useCallback((taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, qrVerified: true }
        : task
    ));
  }, []);

  // Delete task
  const deleteRunnerTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  // Update task
  const updateRunnerTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  // Assign task to runner
  const assignTask = useCallback((taskId, runnerId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, assignedTo: runnerId } : task
    ));
  }, []);

  // Get tasks by status
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  // Get tasks for specific runner
  const getTasksForRunner = useCallback((runnerId) => {
    return tasks.filter(task => task.assignedTo === runnerId);
  }, [tasks]);

  // Get active tasks (not completed)
  const getActiveTasks = useCallback(() => {
    return tasks.filter(task => task.status !== 'completed');
  }, [tasks]);

  // Get completed tasks for today
  const getTodayCompleted = useCallback(() => {
    const today = new Date().toDateString();
    return tasks.filter(task =>
      task.status === 'completed' &&
      new Date(task.completedAt).toDateString() === today
    );
  }, [tasks]);

  // Calculate KPIs
  const getRunnerKPIs = useCallback(() => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(t =>
      new Date(t.createdAt).toDateString() === today ||
      (t.completedAt && new Date(t.completedAt).toDateString() === today)
    );

    const completed = todayTasks.filter(t => t.status === 'completed');
    const pending = tasks.filter(t => t.status === 'pending');
    const inProgress = tasks.filter(t => t.status === 'inprogress');
    const accepted = tasks.filter(t => t.status === 'accepted');

    // Calculate average completion time
    const completedWithTime = completed.filter(t => t.startedAt && t.completedAt);
    const avgCompletionTime = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, t) => {
          const start = new Date(t.startedAt);
          const end = new Date(t.completedAt);
          return sum + (end - start) / 60000; // minutes
        }, 0) / completedWithTime.length
      : 0;

    // Calculate on-time rate
    const onTimeDeliveries = completedWithTime.filter(t => {
      const start = new Date(t.startedAt);
      const end = new Date(t.completedAt);
      const actualMinutes = (end - start) / 60000;
      return actualMinutes <= t.estimatedMinutes;
    });
    const onTimeRate = completedWithTime.length > 0
      ? Math.round((onTimeDeliveries.length / completedWithTime.length) * 100)
      : 100;

    // Urgent tasks
    const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed');

    return {
      totalToday: todayTasks.length,
      completedToday: completed.length,
      pending: pending.length,
      inProgress: inProgress.length,
      accepted: accepted.length,
      avgCompletionTime: Math.round(avgCompletionTime),
      onTimeRate,
      urgentCount: urgentTasks.length,
      deliveries: tasks.filter(t => t.type === 'delivery' && t.status !== 'completed').length,
      pickups: tasks.filter(t => t.type === 'pickup' && t.status !== 'completed').length
    };
  }, [tasks]);

  // Get task by ID
  const getTaskById = useCallback((taskId) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const value = {
    tasks,
    createRunnerTask,
    acceptRunnerTask,
    startRunnerTask,
    completeRunnerTask,
    markUrgent,
    addNote,
    uploadPhoto,
    verifyQR,
    deleteRunnerTask,
    updateRunnerTask,
    assignTask,
    getTasksByStatus,
    getTasksForRunner,
    getActiveTasks,
    getTodayCompleted,
    getRunnerKPIs,
    getTaskById
  };

  return (
    <RunnerContext.Provider value={value}>
      {children}
    </RunnerContext.Provider>
  );
}

export function useRunner() {
  const context = useContext(RunnerContext);
  if (!context) {
    throw new Error('useRunner must be used within a RunnerProvider');
  }
  return context;
}
