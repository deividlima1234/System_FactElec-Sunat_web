import api from './api';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

export const userService = {
    getAll: async () => {
        const response = await api.get<User[]>('/api/v1/users');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<User>(`/api/v1/users/${id}`);
        return response.data;
    },

    create: async (data: CreateUserRequest) => {
        const response = await api.post<User>('/api/v1/users', data);
        return response.data;
    },

    update: async (id: number, data: UpdateUserRequest) => {
        const response = await api.put<User>(`/api/v1/users/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/api/v1/users/${id}`);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get<User>('/api/v1/users/me');
        return response.data;
    }
};
