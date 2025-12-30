import React, { useState, useEffect } from 'react';
import { auditService } from '../services/auditService';
import type { AuditLog } from '../types/audit';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const AuditPage: React.FC = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        fetchAuditLogs(currentPage);
    }, [currentPage]);

    const fetchAuditLogs = async (page: number) => {
        setIsLoading(true);
        try {
            const data = await auditService.getAuditLogs(page, pageSize);
            setAuditLogs(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error fetching audit logs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getActionBadge = (action: string) => {
        // Simple hashing for consistent colors if not mapped
        const colors = [
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
        ];

        let className = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

        if (action.includes('SIGN')) className = colors[1]; // Green
        else if (action.includes('GENERATE')) className = colors[2]; // Purple
        else if (action.includes('CREATE')) className = colors[0]; // Blue
        else if (action.includes('DELETE')) className = colors[4]; // Red
        else if (action.includes('UPDATE')) className = colors[3]; // Yellow
        else if (action.includes('LOGIN')) className = colors[5]; // Indigo

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
                {action}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Auditoría del Sistema</h1>
                </div>
            </div>

            <div className="bg-white dark:bg-background-paper rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Fecha</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Usuario</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800 text-center">Acción</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Recurso</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Resultado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                            <span className="text-sm">Cargando registros de auditoría...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : auditLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No hay registros de auditoría disponibles.
                                    </td>
                                </tr>
                            ) : (
                                auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {log.username}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-mono text-xs">
                                            {log.targetId}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-sm">
                                            {log.result}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!isLoading && totalPages > 1 && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Mostrando página <span className="font-medium">{currentPage + 1}</span> de <span className="font-medium">{totalPages}</span> ({totalElements} registros)
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditPage;
