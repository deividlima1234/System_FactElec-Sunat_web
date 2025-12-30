import api from './api';
import { type Invoice, type CreateInvoiceDTO } from '../types/invoice';

export const invoiceService = {
    getAll: async () => {
        const response = await api.get<Invoice[]>('/api/invoices');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Invoice>(`/api/invoices/${id}`);
        return response.data;
    },

    create: async (data: CreateInvoiceDTO) => {
        const response = await api.post<Invoice>('/api/invoices', data);
        return response.data;
    },

    generateXml: async (id: number) => {
        const response = await api.post(`/api/invoices/${id}/xml`);
        return response.data;
    },

    sign: async (id: number) => {
        const response = await api.post(`/api/invoices/${id}/sign`);
        return response.data;
    },

    sendToSunat: async (id: number) => {
        const response = await api.post(`/api/invoices/${id}/send`);
        return response.data;
    }
};
