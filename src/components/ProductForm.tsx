import React, { useState, useEffect } from 'react';
import { type CreateProductDTO, type Product } from '../types/product';
import { X, Save } from 'lucide-react';

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: CreateProductDTO) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState<CreateProductDTO>({
        code: '',
        description: '',
        unitPrice: 0,
        unitCode: 'NIU'
    });

    const [errors, setErrors] = useState<Partial<{ [K in keyof CreateProductDTO]: string }>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code,
                description: initialData.description,
                unitPrice: initialData.unitPrice,
                unitCode: initialData.unitCode
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'unitPrice' ? parseFloat(value) || 0 : value
        }));
        if (errors[name as keyof CreateProductDTO]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<{ [K in keyof CreateProductDTO]: string }> = {};

        if (!formData.code) newErrors.code = 'El código es requerido';
        if (!formData.description) newErrors.description = 'La descripción es requerida';
        if (formData.unitPrice <= 0) newErrors.unitPrice = 'El precio debe ser mayor a 0';

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
                    {initialData ? 'Editar Producto' : 'Nuevo Producto'}
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
                            Código
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white
                                ${errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            placeholder="P001"
                        />
                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Unidad de Medida
                        </label>
                        <select
                            name="unitCode"
                            value={formData.unitCode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="NIU">Unidad (NIU)</option>
                            <option value="KGM">Kilogramo (KGM)</option>
                            <option value="LTR">Litro (LTR)</option>
                            <option value="ZZ">Servicio (ZZ)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción / Nombre del Producto
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white
                            ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        placeholder="Ej. Laptop HP"
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Precio Unitario (S/.)
                    </label>
                    <input
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white
                            ${errors.unitPrice ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        placeholder="0.00"
                    />
                    {errors.unitPrice && <p className="text-red-500 text-xs mt-1">{errors.unitPrice}</p>}
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

export default ProductForm;
