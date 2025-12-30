import api from './api';
import type { AuditResponse } from '../types/audit';

export const auditService = {
    getAuditLogs: async (page: number = 0, size: number = 20): Promise<AuditResponse> => {
        const response = await api.get<AuditResponse>(`/api/v1/audit?page=${page}&size=${size}`);
        return response.data;
    },
};
