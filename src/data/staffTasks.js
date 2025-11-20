export const staffTasks = [
  {
    id: "TASK001",
    title: "Deep Clean Suite 305",
    description: "Perform deep cleaning of luxury suite including carpet shampooing and window cleaning",
    roomNumber: "305",
    priority: "high",
    status: "todo",
    dueDate: "2025-11-20",
    dueTime: "11:00 AM",
    assignedBy: "Maria Chen",
    checklist: [
      { id: "c1", text: "Shampoo carpets", completed: false },
      { id: "c2", text: "Clean all windows", completed: false },
      { id: "c3", text: "Deep clean bathroom", completed: false },
      { id: "c4", text: "Polish all fixtures", completed: false },
      { id: "c5", text: "Vacuum under furniture", completed: false }
    ],
    notes: "Guest checking in at 2 PM - must be completed by 1:30 PM"
  },
  {
    id: "TASK002",
    title: "Restock Minibar - Room 208",
    description: "Restock minibar with premium beverages and snacks",
    roomNumber: "208",
    priority: "medium",
    status: "in_progress",
    dueDate: "2025-11-20",
    dueTime: "10:00 AM",
    assignedBy: "John Williams",
    checklist: [
      { id: "c1", text: "Check inventory list", completed: true },
      { id: "c2", text: "Restock beverages", completed: true },
      { id: "c3", text: "Add snacks", completed: false },
      { id: "c4", text: "Update billing system", completed: false }
    ],
    notes: "VIP guest - use premium selection"
  },
  {
    id: "TASK003",
    title: "Replace Linens - Room 412",
    description: "Change all bed linens and towels",
    roomNumber: "412",
    priority: "low",
    status: "todo",
    dueDate: "2025-11-20",
    dueTime: "2:00 PM",
    assignedBy: "Maria Chen",
    checklist: [
      { id: "c1", text: "Remove used linens", completed: false },
      { id: "c2", text: "Replace bed sheets", completed: false },
      { id: "c3", text: "Replace pillowcases", completed: false },
      { id: "c4", text: "Replace towels", completed: false },
      { id: "c5", text: "Add extra blanket", completed: false }
    ],
    notes: "Guest requested hypoallergenic bedding"
  },
  {
    id: "TASK004",
    title: "Turndown Service - Suite 501",
    description: "Evening turndown service for executive suite",
    roomNumber: "501",
    priority: "high",
    status: "todo",
    dueDate: "2025-11-20",
    dueTime: "6:00 PM",
    assignedBy: "Maria Chen",
    checklist: [
      { id: "c1", text: "Draw curtains", completed: false },
      { id: "c2", text: "Turn down bed", completed: false },
      { id: "c3", text: "Place chocolates on pillow", completed: false },
      { id: "c4", text: "Replenish water bottles", completed: false },
      { id: "c5", text: "Adjust lighting", completed: false }
    ],
    notes: "Long-stay guest - extra attention to detail"
  },
  {
    id: "TASK005",
    title: "Emergency Spill Cleanup - Hallway 3rd Floor",
    description: "Clean up beverage spill near elevator area",
    roomNumber: "N/A",
    priority: "high",
    status: "completed",
    dueDate: "2025-11-20",
    dueTime: "9:00 AM",
    assignedBy: "Front Desk",
    checklist: [
      { id: "c1", text: "Place wet floor signs", completed: true },
      { id: "c2", text: "Clean spill area", completed: true },
      { id: "c3", text: "Sanitize floor", completed: true },
      { id: "c4", text: "Remove signs", completed: true }
    ],
    notes: "Completed ahead of schedule"
  },
  {
    id: "TASK006",
    title: "Inspect Room 315 - Maintenance Issue",
    description: "Check and report bathroom faucet leak",
    roomNumber: "315",
    priority: "medium",
    status: "todo",
    dueDate: "2025-11-20",
    dueTime: "1:00 PM",
    assignedBy: "Maintenance Department",
    checklist: [
      { id: "c1", text: "Inspect faucet", completed: false },
      { id: "c2", text: "Document issue", completed: false },
      { id: "c3", text: "Submit maintenance request", completed: false },
      { id: "c4", text: "Place out of order sign if needed", completed: false }
    ],
    notes: "Guest reported slow leak"
  }
];
