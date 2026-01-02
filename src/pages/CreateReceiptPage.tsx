import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Search, Trash2 } from 'lucide-react';
import { clientService } from '../services/clientService';
import { productService } from '../services/productService';
import { invoiceService } from '../services/invoiceService';
import { type Client } from '../types/client';
import { type Product } from '../types/product';
import { type CreateInvoiceDTO } from '../types/invoice';

const CreateReceiptPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Data Sources
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // Form State
    const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
    const [currency, setCurrency] = useState('PEN');
    const [items, setItems] = useState<{ productId: number; product: Product; quantity: number; unitPrice: number; total: number }[]>([]);

    // Item Adding State
    const [itemSearch, setItemSearch] = useState('');
    const [selectedProductToAdd, setSelectedProductToAdd] = useState<Product | null>(null);
    const [quantityToAdd, setQuantityToAdd] = useState(1);
    const [priceToAdd, setPriceToAdd] = useState(0);

    useEffect(() => {
        loadMasterData();
    }, []);

    const loadMasterData = async () => {
        try {
            const [clientsData, productsData] = await Promise.all([
                clientService.getAll(),
                productService.getAll()
            ]);
            setClients(clientsData);
            setProducts(productsData);
        } catch (error) {
            console.error("Error loading master data:", error);
        }
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProductToAdd(product);
        setPriceToAdd(product.unitPrice);
        setQuantityToAdd(1);
        setItemSearch(''); // Clear search to hide dropdown
    };

    const addItem = () => {
        if (!selectedProductToAdd) return;

        const newItem = {
            productId: selectedProductToAdd.id,
            product: selectedProductToAdd,
            quantity: quantityToAdd,
            unitPrice: priceToAdd,
            total: quantityToAdd * priceToAdd
        };

        setItems([...items, newItem]);
        // Reset item form
        setSelectedProductToAdd(null);
        setQuantityToAdd(1);
        setPriceToAdd(0);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    // --- RHE Logic ---
    // No IGV. Retention 8% if total > 1500.
    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const retention = subtotal > 1500 ? subtotal * 0.08 : 0;
        const totalNeto = subtotal - retention;

        return {
            totalHonorario: subtotal,
            retention,
            totalNeto
        };
    };

    const handleSubmit = async () => {
        if (!selectedClientId) {
            alert('Seleccione un cliente');
            return;
        }
        if (items.length === 0) {
            alert('Agregue al menos un ítem');
            return;
        }

        setIsLoading(true);

        const payload: CreateInvoiceDTO = {
            clientId: Number(selectedClientId),
            series: 'E001', // Serie RHE
            type: 'RECIBO_HONORARIOS',
            currency: currency,
            items: items.map(item => ({
                productId: item.product.id,
                productCode: item.product.code,
                description: item.product.description, // User might want to edit this, but for now take from product or consider it's a "service"
                unitCode: 'ZZ', // Unidad de servicio typically
                quantity: item.quantity,
                unitValue: item.unitPrice
            }))
        };

        try {
            await invoiceService.create(payload);
            navigate('/invoices'); // Or /receipts if we have a separate list
        } catch (error) {
            console.error("Error creating receipt:", error);
            alert('Error al crear el Recibo por Honorarios');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProductsToSelect = products.filter(p =>
        p.description.toLowerCase().includes(itemSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(itemSearch.toLowerCase())
    );

    const { totalHonorario, retention, totalNeto } = calculateTotals();

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/invoices')}
                    className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Recibo por Honorarios</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Header Info */}
                    <div className="bg-white dark:bg-background-paper p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Datos del Recibo</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente / Usuario</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(Number(e.target.value))}
                                >
                                    <option value="">Seleccione Cliente...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.documentNumber} - {c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Moneda</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <option value="PEN">Soles (PEN)</option>
                                    <option value="USD">Dólares (USD)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="bg-white dark:bg-background-paper p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Detalle del Servicio</h2>

                        {/* Add Item Form */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-8 relative">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Descripción del Servicio</label>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            placeholder="Buscar concepto..."
                                            value={selectedProductToAdd ? selectedProductToAdd.description : itemSearch}
                                            onChange={(e) => {
                                                setItemSearch(e.target.value);
                                                setSelectedProductToAdd(null);
                                            }}
                                        />
                                        {/* Dropdown Results */}
                                        {itemSearch && !selectedProductToAdd && (
                                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                {filteredProductsToSelect.map(p => (
                                                    <div
                                                        key={p.id}
                                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                                                        onClick={() => handleProductSelect(p)}
                                                    >
                                                        <div className="font-medium text-gray-900 dark:text-white">{p.description}</div>
                                                        <div className="text-xs text-gray-500">Valor Ref: {p.unitPrice}</div>
                                                    </div>
                                                ))}
                                                {filteredProductsToSelect.length === 0 && (
                                                    <div className="px-4 py-2 text-sm text-gray-500">No encontrado</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Monto Honorario</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            value={priceToAdd}
                                            onChange={(e) => setPriceToAdd(parseFloat(e.target.value) || 0)}
                                        />
                                        <button
                                            onClick={addItem}
                                            disabled={!selectedProductToAdd && !priceToAdd} // Allow adding custom if implementation allows, but here kept tied to product for now as per logic
                                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        {items.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left bg-white dark:bg-transparent">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 uppercase">
                                            <th className="py-2">Servicio / Descripción</th>
                                            <th className="py-2 text-right">Monto</th>
                                            <th className="py-2 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-3 text-sm text-gray-800 dark:text-gray-300">{item.product.description}</td>
                                                <td className="py-3 text-sm text-right font-medium text-gray-900 dark:text-white">{item.total.toFixed(2)}</td>
                                                <td className="py-3 text-right">
                                                    <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                No hay servicios agregados
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Totals & Actions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-background-paper p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 sticky top-6">
                        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Resumen</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Total Honorario</span>
                                <span>{currency === 'PEN' ? 'S/.' : '$'} {totalHonorario.toFixed(2)}</span>
                            </div>

                            {retention > 0 && (
                                <div className="flex justify-between text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded">
                                    <span>Retención (8%)</span>
                                    <span>- {currency === 'PEN' ? 'S/.' : '$'} {retention.toFixed(2)}</span>
                                </div>
                            )}

                            {retention > 0 && (
                                <p className="text-xs text-gray-500 italic mt-1">
                                    * Aplica retención por monto mayor a S/ 1,500
                                </p>
                            )}

                            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-3">
                                <span>Total Neto</span>
                                <span>{currency === 'PEN' ? 'S/.' : '$'} {totalNeto.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || items.length === 0}
                            className="w-full flex justify-center items-center py-3 bg-primary text-white rounded-lg hover:bg-red-700 shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:transform-none"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Emitir Recibo
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateReceiptPage;
