export interface User {
  id: string;
  name: string;
  colorClass: string;
  avatarColor: string;
}

export const USERS: User[] = [
  {
    id: 'aaron',
    name: 'Aaron',
    colorClass: 'border-l-blue-500',
    avatarColor: 'bg-blue-500',
  },
  {
    id: 'emily',
    name: 'Emily',
    colorClass: 'border-l-pink-500',
    avatarColor: 'bg-pink-500',
  },
  {
    id: 'abigail',
    name: 'Abigail',
    colorClass: 'border-l-purple-500',
    avatarColor: 'bg-purple-500',
  },
  {
    id: 'family',
    name: 'Family',
    colorClass: 'border-l-green-500',
    avatarColor: 'bg-green-500',
  },
];

export const ALL_USERS_OPTION = {
  id: 'all',
  name: 'All',
} as const;

// Create a lookup object for easy access by user id
export const USER_COLORS: Record<string, string> = USERS.reduce(
  (acc, user) => {
    acc[user.id] = user.colorClass;
    return acc;
  },
  {} as Record<string, string>
);

export const USER_AVATAR_COLORS: Record<string, string> = USERS.reduce(
  (acc, user) => {
    acc[user.id] = user.avatarColor;
    return acc;
  },
  {} as Record<string, string>
);

// Default user for new tasks
export const DEFAULT_USER = 'aaron'; 