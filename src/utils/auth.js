const STAFF_USERS = [
  {
    id: 'hk001',
    name: 'Maria Chen',
    role: 'housekeeping',
    password: '123456',
    dept: 'Housekeeping',
  },
  {
    id: 'mnt001',
    name: 'John Williams',
    role: 'maintenance',
    password: '123456',
    dept: 'Maintenance',
  },
  {
    id: 'run001',
    name: 'Anita Rao',
    role: 'runner',
    password: '123456',
    dept: 'Runner',
  },
];

export function authenticateStaff(identifier, password) {
  if (!identifier || !password) return null;
  const normalized = identifier.trim().toLowerCase();
  const match = STAFF_USERS.find((user) => user.id.toLowerCase() === normalized);
  if (match && match.password === password) {
    const { password: _pw, ...staff } = match;
    return staff;
  }
  return null;
}

export function getStoredStaff() {
  try {
    const stored = localStorage.getItem('glimmora_staff_auth');
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error('Failed to read auth from storage', err);
    return null;
  }
}

export { STAFF_USERS };

