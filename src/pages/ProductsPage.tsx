import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../services/productService';
import { type Product, type CreateProductDTO } from '../types/product';
import ProductForm from '../components/ProductForm';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedProduct(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await productService.delete(id);
                setProducts(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
                alert('Error al eliminar producto');
            }
        }
    };

    const handleSubmitForm = async (data: CreateProductDTO) => {
        setIsSaving(true);
        try {
            if (selectedProduct) {
                await productService.update(selectedProduct.id, data);
            } else {
                await productService.create(data);
            }
            await fetchProducts(); // Reload list
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error saving product:", error);
            alert('Error al guardar producto');
        } finally {
            setIsSaving(false);
        }
    };

    if (isFormOpen) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6 flex items-center">
                    <button
                        onClick={() => setIsFormOpen(false)}
                        className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h1>
                </div>
                <ProductForm
                    initialData={selectedProduct}
                    onSubmit={handleSubmitForm}
                    onCancel={() => setIsFormOpen(false)}
                    isLoading={isSaving}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
                <button
                    onClick={handleCreate}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-white dark:bg-background-paper rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por descripción o código..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Código</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Descripción</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Precio Unit.</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Unidad</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <span className="ml-3">Cargando productos...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {product.code}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                            {product.description}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-mono">
                                            S/. {product.unitPrice.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {product.unitCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors dark:hover:bg-blue-900/20"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors dark:hover:bg-red-900/20"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simple) */}
                {!isLoading && filteredProducts.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Mostrando {filteredProducts.length} productos</span>
                        <div className="flex space-x-2">
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50" disabled>
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50" disabled>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
