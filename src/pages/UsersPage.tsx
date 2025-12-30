import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import type { User } from '../types/user';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import UserFormModal from '../components/users/UserFormModal';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = () => {
        setSelectedUser(undefined);
        setIsFormatModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsFormatModalOpen(true);
    };

    const handleDeleteUser = async (user: User) => {
        if (window.confirm(`¿Estás seguro de eliminar el usuario ${user.username}?`)) {
            try {
                await userService.delete(user.id);
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Error al eliminar usuario");
            }
        }
    };

    const handleFormSubmit = async (data: any) => {
        try {
            if (selectedUser) {
                await userService.update(selectedUser.id, data);
            } else {
                await userService.create(data);
            }
            setIsFormatModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Error al guardar usuario");
        }
    };

    const getRoleBadge = (role: string) => {
        const styles = role === 'ADMIN'
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles}`}>
                {role}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
                </div>
                <button
                    onClick={handleCreateUser}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-white dark:bg-background-paper rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">ID</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Usuario</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800">Email</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800 text-center">Rol</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800 text-center">Estado</th>
                                <th className="px-6 py-4 font-semibold border-b dark:border-gray-800 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <span className="ml-3">Cargando usuarios...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 text-sm font-mono">
                                            #{user.id}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
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
            </div>

            <UserFormModal
                isOpen={isFormatModalOpen}
                onClose={() => setIsFormatModalOpen(false)}
                onSubmit={handleFormSubmit}
                userToEdit={selectedUser}
            />
        </div>
    );
};

export default UsersPage;
