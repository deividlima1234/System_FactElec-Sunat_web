export interface Client {
    id: number;
    documentType: string; // Changed from 'DNI' | 'RUC' to string logic (6=RUC, 1=DNI)
    documentNumber: string;
    name: string; // Changed from businessName
    email: string;
    address?: string;
    phone?: string;
}

export interface CreateClientDTO {
    documentType: string;
    documentNumber: string;
    name: string; // Changed from businessName
    email: string;
    address?: string;
    phone?: string;
}
