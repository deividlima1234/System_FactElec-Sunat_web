
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { invoiceService } from '../services/invoiceService';
import { type Invoice } from '../types/invoice';

const InvoiceDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchInvoice(Number(id));
        }
    }, [id]);

    const fetchInvoice = async (invoiceId: number) => {
        try {
            const data = await invoiceService.getById(invoiceId);
            setInvoice(data);
        } catch (error) {
            console.error("Error fetching invoice:", error);
            alert("Error al cargar la factura");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!invoice) {
        return <div className="text-center py-10">Factura no encontrada</div>;
    }

    console.log("Invoice Data:", invoice);

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <button
                onClick={() => navigate('/invoices')}
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al listado
            </button>

            <div className="bg-white dark:bg-background-paper rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8 border-b dark:border-gray-700 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {(invoice.invoiceType === 'RECIBO_HONORARIOS' || invoice.type === 'RECIBO_HONORARIOS') ? 'RECIBO POR HONORARIOS' : 'FACTURA'}
                        </h1>
                        <p className="text-gray-500 mt-1 uppercase text-sm font-semibold tracking-wider">ELECTRÓNICA</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-mono font-bold text-primary">{invoice.series}-{invoice.number}</div>
                        <div className="text-gray-500 mt-1 text-sm">Fecha: {new Date(invoice.issueDate).toLocaleDateString()}</div>
                        <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border ${invoice.status === 'ACCEPTED' ? 'bg-green-100 text-green-800 border-green-200' :
                            invoice.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                            {invoice.status}
                        </div>
                    </div>
                </div>

                {/* Client & Issuer Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Emisor</h3>
                        <div className="text-gray-900 dark:text-gray-200 font-medium">
                            <p className="text-lg">{invoice.company?.name || 'Datos de Empresa no disponibles'}</p>
                            <p className="text-gray-500 text-sm">RUC: {invoice.company?.ruc || '-'}</p>
                            <p className="text-gray-500 text-sm">{invoice.company?.address || '-'}</p>
                            <p className="text-gray-500 text-sm">{invoice.company?.email || '-'}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Cliente</h3>
                        <div className="text-gray-900 dark:text-gray-200 font-medium">
                            <p className="text-lg">{invoice.clientName}</p>
                            {invoice.client ? (
                                <>
                                    <p className="text-gray-500 text-sm">
                                        {invoice.client.documentType === '6' ? 'RUC' : 'DNI'}: {invoice.client.documentNumber}
                                    </p>
                                    <p className="text-gray-500 text-sm">{invoice.client.address || 'Dirección no registrada'}</p>
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm italic">Detalles del cliente no disponibles</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-100 dark:border-gray-700">
                                <th className="py-3 text-sm uppercase tracking-wider text-gray-500">Descripción</th>
                                <th className="py-3 text-sm uppercase tracking-wider text-gray-500 text-right">Cant.</th>
                                <th className="py-3 text-sm uppercase tracking-wider text-gray-500 text-right">P. Unit</th>
                                <th className="py-3 text-sm uppercase tracking-wider text-gray-500 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {(invoice.items || []).map((item, index) => (
                                <tr key={index}>
                                    <td className="py-4 text-gray-900 dark:text-gray-200">
                                        <div className="font-medium">{item.description}</div>
                                        <div className="text-xs text-gray-500">{item.productCode}</div>
                                    </td>
                                    <td className="py-4 text-right text-gray-900 dark:text-gray-200 font-mono">
                                        {item.quantity}
                                    </td>
                                    <td className="py-4 text-right text-gray-900 dark:text-gray-200 font-mono">
                                        {item.unitValue.toFixed(2)}
                                    </td>
                                    <td className="py-4 text-right text-gray-900 dark:text-gray-200 font-mono font-bold">
                                        {item.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="w-64 space-y-3">
                        {(invoice.invoiceType === 'RECIBO_HONORARIOS' || invoice.type === 'RECIBO_HONORARIOS') ? (
                            <>
                                <div className="flex justify-between text-gray-500">
                                    <span>Total Honorario</span>
                                    <span className="font-mono">{invoice.totalAmount.toFixed(2)}</span>
                                </div>
                                {invoice.retentionAmount && invoice.retentionAmount > 0 ? (
                                    <div className="flex justify-between text-red-500">
                                        <span>Retención (8%)</span>
                                        <span className="font-mono">- {invoice.retentionAmount.toFixed(2)}</span>
                                    </div>
                                ) : null}
                                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-dashed border-gray-300 pt-3">
                                    <span>Total Neto</span>
                                    <span>S/. {invoice.netAmount ? invoice.netAmount.toFixed(2) : (invoice.totalAmount - (invoice.retentionAmount || 0)).toFixed(2)}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-mono">{(invoice.totalAmount / 1.18).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>IGV (18%)</span>
                                    <span className="font-mono">{(invoice.totalAmount - (invoice.totalAmount / 1.18)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-dashed border-gray-300 pt-3">
                                    <span>Total</span>
                                    <span>S/. {invoice.totalAmount.toFixed(2)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-xs text-gray-400">
                        Representación impresa de la Factura Electrónica
                        <br />Generado por Eddam Eloy
                    </div>
                    <div className="space-x-4">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center inline-flex transition-colors">
                            <Download className="w-4 h-4 mr-2" /> Descargar PDF
                        </button>
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center inline-flex transition-colors">
                            <Printer className="w-4 h-4 mr-2" /> Imprimir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsPage;
