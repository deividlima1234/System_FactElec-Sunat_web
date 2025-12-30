
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    LogOut,
    Menu,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import clsx from 'clsx';

const MainLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Facturación', path: '/invoices', icon: FileText },
        { name: 'Clientes', path: '/clients', icon: Users },
        { name: 'Productos', path: '/products', icon: Package },
        { name: 'Auditoría', path: '/audit', icon: ShieldCheck },
    ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-background overflow-hidden">
            {/* Sidebar */}
            <aside
                className={clsx(
                    "bg-background-paper border-r border-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col z-20",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-800">
                    <div className={clsx("flex items-center font-bold text-xl", isSidebarOpen ? "px-4" : "justify-center")}>
                        <span className="text-primary truncate">{isSidebarOpen ? 'AndesFact' : 'AF'}</span>
                    </div>
                </div>

                <nav className="flex-1 py-6 space-y-1 px-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => clsx(
                                "flex items-center px-4 py-3 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 min-w-[20px]" />
                            <span className={clsx("ml-3 transition-opacity duration-200", isSidebarOpen ? "opacity-100" : "opacity-0 hidden")}>
                                {item.name}
                            </span>
                            {isSidebarOpen && (
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-50" />
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user?.username || 'Usuario'}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.role || 'User Role'}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className={clsx(
                            "mt-4 flex items-center justify-center w-full px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors",
                            !isSidebarOpen && "px-0"
                        )}
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-4 h-4" />
                        {isSidebarOpen && <span className="ml-2">Salir</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Navbar (Mobile/Desktop toggle) */}
                <header className="h-16 bg-white dark:bg-background-paper border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm z-10">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 focus:outline-none"
                    >
                        {isSidebarOpen ? <Menu className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a] p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
