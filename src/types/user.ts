export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPPORT';

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    active: boolean;
    createdAt: string; // ISO Date string
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UpdateUserRequest {
    email?: string;
    role?: UserRole;
    active?: boolean;
    password?: string;
}
