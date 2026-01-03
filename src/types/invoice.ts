import { type Client } from './client';

export interface InvoiceItem {
    productId: number;
    productCode: string; // Snapshot
    description: string; // Snapshot
    unitValue: number;
    quantity: number;
    total: number; // calculated: price * quantity
    igv: number;   // calculated
}

export interface Company {
    name: string;
    ruc: string;
    address: string;
    email?: string;
    phone?: string;
    logoUrl?: string;
}

export interface Invoice {
    id: number;
    series: string;
    number: string;
    issueDate: string;
    totalAmount: number;
    status: 'CREATED' | 'XML_GENERATED' | 'SIGNED' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'ANULADA';
    invoiceType?: string; // e.g. 'RECIBO_HONORARIOS'
    type?: string;        // Fallback or alternative name
    clientName: string; // From backend
    client?: Client;    // Optional
    company?: Company;  // Company/Issuer Info from Backend
    items: InvoiceItem[];
    xmlUrl?: string;
    cdrUrl?: string;
    retentionAmount?: number;
    netAmount?: number;
}

export interface CreateInvoiceDTO {
    clientId: number;
    series: string;
    type?: string; // e.g. 'RECIBO_HONORARIOS'
    items: {
        productId?: number;
        productCode: string;
        description: string;
        unitCode: string;
        quantity: number;
        unitValue: number;
    }[];
    currency?: string;
}
