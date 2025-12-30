import api from './api';
import { type Product, type CreateProductDTO } from '../types/product';

export const productService = {
    getAll: async () => {
        const response = await api.get<Product[]>('/api/products');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Product>(`/api/products/${id}`);
        return response.data;
    },

    create: async (data: CreateProductDTO) => {
        const response = await api.post<Product>('/api/products', data);
        return response.data;
    },

    update: async (id: number, data: CreateProductDTO) => {
        const response = await api.put<Product>(`/api/products/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/api/products/${id}`);
    }
};
