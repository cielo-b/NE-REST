export const ERole = {
    ADMIN: 'ADMIN',
    ATTENDANT: 'ATTENDANT'
} as const;

export type ERole = typeof ERole[keyof typeof ERole];