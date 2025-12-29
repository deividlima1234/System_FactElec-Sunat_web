export interface User {
    username: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    username: string;
    role: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
