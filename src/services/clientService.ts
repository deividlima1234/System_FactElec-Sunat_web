import api from './api';
import { type Client, type CreateClientDTO } from '../types/client';

export const clientService = {
    getAll: async () => {
        const response = await api.get<Client[]>('/api/clients');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Client>(`/api/clients/${id}`);
        return response.data;
    },

    create: async (data: CreateClientDTO) => {
        const response = await api.post<Client>('/api/clients', data);
        return response.data;
    },

    update: async (id: number, data: CreateClientDTO) => {
        const response = await api.put<Client>(`/api/clients/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/api/clients/${id}`);
    }
};
