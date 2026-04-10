export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
}

const USERS_KEY = 'pitchperfect_users'
const SESSION_KEY = 'pitchperfect_session'

function hashPassword(password: string): string {
  // Simple deterministic hash for prototype (not cryptographic)
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i)
    hash |= 0
  }
  return hash.toString(16)
}

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function register(name: string, email: string, password: string): { user: User } | { error: string } {
  const users = getUsers()
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'An account with this email already exists.' }
  }
  const user: User = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: hashPassword(password),
  }
  saveUsers([...users, user])
  localStorage.setItem(SESSION_KEY, user.id)
  return { user }
}

export function login(email: string, password: string): { user: User } | { error: string } {
  const users = getUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim())
  if (!user) return { error: 'No account found with this email.' }
  if (user.passwordHash !== hashPassword(password)) return { error: 'Incorrect password.' }
  localStorage.setItem(SESSION_KEY, user.id)
  return { user }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): User | null {
  const id = localStorage.getItem(SESSION_KEY)
  if (!id) return null
  return getUsers().find((u) => u.id === id) ?? null
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
