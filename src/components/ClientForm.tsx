import React, { useState, useEffect } from 'react';
import { type CreateClientDTO, type Client } from '../types/client';
import { X, Save } from 'lucide-react';

interface ClientFormProps {
    initialData?: Client;
    onSubmit: (data: CreateClientDTO) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState<CreateClientDTO>({
        documentType: '6',
        documentNumber: '',
        name: '', // Changed from businessName
        email: '',
        address: '',
        phone: ''
    });

    const [errors, setErrors] = useState<Partial<CreateClientDTO>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                documentType: initialData.documentType,
                documentNumber: initialData.documentNumber,
                name: initialData.name, // Changed from businessName
                email: initialData.email,
                address: initialData.address || '',
                phone: initialData.phone || ''
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof CreateClientDTO]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<CreateClientDTO> = {};

        if (!formData.documentNumber) newErrors.documentNumber = 'El número de documento es requerido';
        if (formData.documentType === '6' && formData.documentNumber.length !== 11) {
            newErrors.documentNumber = 'El RUC debe tener 11 dígitos';
        }
        if (formData.documentType === '1' && formData.documentNumber.length !== 8) {
            newErrors.documentNumber = 'El DNI debe tener 8 dígitos';
        }
        if (!formData.name) newErrors.name = 'La Razón Social / Nombre es requerida';
        if (!formData.email) newErrors.email = 'El correo electrónico es requerido';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo electrónico inválido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {initialData ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipo de Documento
                        </label>
                        <select
                            name="documentType"
                            value={formData.documentType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="6">RUC</option>
                            <option value="1">DNI</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Número de Documento
                        </label>
                        <input
                            type="text"
                            name="documentNumber"
                            value={formData.documentNumber}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, ''); // Solo números
                                // Create a synthetic event matching the expected type
                                const syntheticEvent = {
                                    target: {
                                        name: 'documentNumber',
                                        value: val
                                    }
                                } as React.ChangeEvent<HTMLInputElement>;
                                handleChange(syntheticEvent);
                            }}
                            maxLength={formData.documentType === '6' ? 11 : 8}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white
                                ${errors.documentNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            placeholder={formData.documentType === '6' ? '10123456789' : '12345678'}
                        />
                        {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Razón Social / Nombre Completo
                    </label>
                    <input
                        type="text"
                        name="name" // Changed from businessName
                        value={formData.name} // Changed from businessName
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white
                            ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        placeholder="Ej. Empresa SAC"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white
                            ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        placeholder="contacto@empresa.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Dirección (Opcional)
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Av. Principal 123"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Teléfono (Opcional)
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="999888777"
                    />
                </div>

                <div className="flex justify-end pt-4 space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientForm;
