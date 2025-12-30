import React, { useState, useEffect } from 'react';
import { Plus, Send, CheckCircle, FileCode, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../services/invoiceService';
import { type Invoice } from '../types/invoice';

const InvoicesPage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const data = await invoiceService.getAll();
            setInvoices(data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: number, action: 'xml' | 'sign' | 'send') => {
        try {
            if (action === 'xml') await invoiceService.generateXml(id);
            if (action === 'sign') await invoiceService.sign(id);
            if (action === 'send') await invoiceService.sendToSunat(id);
            fetchInvoices(); // Refresh status
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
            alert(`Error al procesar la acción: ${action}`);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            'CREATED': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            'XML_GENERATED': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            'SIGNED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            'SENT': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            'ACCEPTED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            'REJECTED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            'ANULADA': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || styles['CREATED']}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Facturación Electrónica</h1>
                <button
                    onClick={() => navigate('/invoices/new')}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Emisión
                </button>
            </div>

            <div className="bg-white dark:bg-background-paper rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Comprobante</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Cliente</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Fecha</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800 text-right">Total</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800 text-center">Estado</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <span className="ml-3">Cargando facturas...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No hay comprobantes emitidos.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {inv.series}-{inv.number}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                            {inv.clientName || inv.client?.name || 'Cliente General'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                                            {new Date(inv.issueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-white">
                                            S/. {inv.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(inv.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => navigate(`/invoices/${inv.id}`)}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded tooltip"
                                                    title="Ver Detalle"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {inv.status === 'CREATED' && (
                                                    <button
                                                        onClick={() => handleAction(inv.id, 'xml')}
                                                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded tooltip"
                                                        title="Generar XML"
                                                    >
                                                        <FileCode className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {inv.status === 'XML_GENERATED' && (
                                                    <button
                                                        onClick={() => handleAction(inv.id, 'sign')}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Firmar Digitalmente"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {inv.status === 'SIGNED' && (
                                                    <button
                                                        onClick={() => handleAction(inv.id, 'send')}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                        title="Enviar a SUNAT"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoicesPage;
