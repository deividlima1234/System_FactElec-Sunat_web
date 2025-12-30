export interface Product {
    id: number;
    code: string;
    description: string;
    unitPrice: number;
    unitCode: string; // e.g., 'NIU' (Unidad), 'KGM' (Kilogramo)
    status: boolean; // Activo/Inactivo
}

export interface CreateProductDTO {
    code: string;
    description: string;
    unitPrice: number;
    unitCode: string;
}
