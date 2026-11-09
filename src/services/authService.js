const STORAGE_USERS_KEY = 'placement_tracker_members';
const STORAGE_CURRENT_USER_KEY = 'placement_tracker_session_user';
const STORAGE_TOKEN_KEY = 'placement_tracker_auth_token';

const COMMON_PASSWORDS = [
  'password',
  'password1',
  '12345678',
  '123456789',
  'qwerty123',
  'admin123',
  'welcome1',
  'placement',
  'letmein1',
  'secret123',
];

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_placement_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function initMembers() {
  const existing = localStorage.getItem(STORAGE_USERS_KEY);
  if (!existing) {
    const demoPasswordHash = await hashPassword('CellAdmin2026!');
    const initialMembers = [
      {
        id: 1,
        name: 'Sarah Connor',
        email: 'sarah.connor@placement.cell',
        password_hash: demoPasswordHash,
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initialMembers));
  }
}

initMembers();

function getStoredMembers() {
  try {
    const data = localStorage.getItem(STORAGE_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long.',
    };
  }
  if (/^\d+$/.test(password)) {
    return { valid: false, message: 'Password cannot be all-numeric.' };
  }
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    return {
      valid: false,
      message: 'This password is too common and easily guessed.',
    };
  }
  return { valid: true };
}

/**
 * Member Registration (A1, A2, A4)
 */
export async function registerMember({ name, email, password }) {
  // 1. Validate required fields
  if (!name?.trim()) {
    throw new Error('Please enter your full name.');
  }
  if (!email?.trim()) {
    throw new Error('Please enter your email address.');
  }
  const cleanEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    throw new Error(passwordCheck.message);
  }

  // 4. Validate Email Uniqueness (A2)
  const members = getStoredMembers();
  const emailExists = members.some(m => m.email.toLowerCase() === cleanEmail);
  if (emailExists) {
    throw new Error(
      'An account with this email address already exists. Please log in.'
    );
  }

  // 5. Store password hashed (A4)
  const password_hash = await hashPassword(password);
  const newMember = {
    id: Date.now(),
    name: name.trim(),
    email: cleanEmail,
    password_hash,
    created_at: new Date().toISOString(),
  };

  members.push(newMember);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(members));

  // Safe user object (passwords are never returned - A4)
  const safeUser = {
    id: newMember.id,
    name: newMember.name,
    email: newMember.email,
    created_at: newMember.created_at,
  };

  // Generate session token
  const fakeToken = 'token_' + btoa(`${safeUser.id}:${Date.now()}`);
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(safeUser));
  localStorage.setItem(STORAGE_TOKEN_KEY, fakeToken);

  return { user: safeUser, token: fakeToken };
}

export async function loginMember({ email, password }) {
  if (!email?.trim() || !password) {
    throw new Error('Please provide both email and password.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const members = getStoredMembers();

  // Find member
  const member = members.find(m => m.email.toLowerCase() === cleanEmail);
  if (!member) {
    throw new Error('Invalid email or password.');
  }

  const inputHash = await hashPassword(password);
  if (member.password_hash !== inputHash) {
    throw new Error('Invalid email or password.');
  }

  const safeUser = {
    id: member.id,
    name: member.name,
    email: member.email,
    created_at: member.created_at,
  };

  const fakeToken = 'token_' + btoa(`${safeUser.id}:${Date.now()}`);
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(safeUser));
  localStorage.setItem(STORAGE_TOKEN_KEY, fakeToken);

  return { user: safeUser, token: fakeToken };
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function logoutMember() {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}
