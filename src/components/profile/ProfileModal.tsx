import React from 'react';
import { X, Shield, Mail, Calendar, User as UserIcon } from 'lucide-react';
import type { User } from '../../types/user';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    const getRoleBadge = (role: string) => {
        if (role === 'ADMIN') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-background-paper rounded-xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
                <div className="relative h-24 bg-gradient-to-r from-primary to-red-800">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 pb-6 text-center -mt-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-background-paper p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        {user.username}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>

                    <div className="mt-4 flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${getRoleBadge(user.role)}`}>
                            <Shield className="w-3 h-3" />
                            {user.role.replace('ROLE_', '')}
                        </span>
                    </div>

                    <div className="mt-8 space-y-4 text-left">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-500">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Username</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                            </div>
                        </div>

                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-500">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Email</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                            </div>
                        </div>

                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Miembro Desde</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
