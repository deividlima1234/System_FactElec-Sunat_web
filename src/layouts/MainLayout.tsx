
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
import logo from '../assets/images/logo_Empresarial.png';
const ProfileModal = React.lazy(() => import('../components/profile/ProfileModal'));

const MainLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [fullUser, setFullUser] = useState<any>(null); // keeping as any or importing User type

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleProfileClick = async () => {
        try {
            // Dynamically import userService to avoid circular deps if any, or just standard import
            const { userService } = await import('../services/userService');
            const userData = await userService.getMe();
            setFullUser(userData);
            setIsProfileModalOpen(true);
        } catch (error) {
            console.error("Error fetching user profile", error);
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Facturación', path: '/invoices', icon: FileText },
        { name: 'Clientes', path: '/clients', icon: Users },
        { name: 'Productos', path: '/products', icon: Package },
        { name: 'Auditoría', path: '/audit', icon: ShieldCheck },
    ];

    if (user?.role === 'ADMIN') {
        navItems.splice(4, 0, { name: 'Usuarios', path: '/users', icon: Users });
    }

    // Close sidebar on mobile when navigating
    const handleNavigation = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-background overflow-hidden relative">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-30 bg-background-paper border-r border-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col",
                    isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-20 lg:translate-x-0"
                )}
            >
                <div className="min-h-[140px] flex items-center justify-center border-b border-gray-800 shrink-0 p-4">
                    <div className={clsx("flex items-center font-bold text-xl transition-all duration-300", isSidebarOpen ? "px-2" : "justify-center px-0")}>
                        {isSidebarOpen ? (
                            <div className="flex flex-col items-center">
                                <img src={logo} alt="EddamCore" className="h-[100px] mb-1" />
                            </div>
                        ) : (
                            <img src={logo} alt="EC" className="h-10 w-auto" />
                        )}
                        {!isSidebarOpen && <span className="lg:hidden block text-primary">EddamCore</span>}
                    </div>
                </div>

                <nav className="flex-1 py-6 space-y-1 px-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={handleNavigation}
                            className={({ isActive }) => clsx(
                                "flex items-center px-4 py-3 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 min-w-[20px]" />
                            <span className={clsx("ml-3 transition-opacity duration-200 whitespace-nowrap", isSidebarOpen ? "opacity-100 block" : "hidden")}>
                                {item.name}
                            </span>
                            {isSidebarOpen && (
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-50" />
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800 shrink-0">
                    <div
                        className="flex items-center cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
                        onClick={handleProfileClick}
                    >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold shadow-md ring-2 ring-primary/20 shrink-0">
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

            <React.Suspense fallback={null}>
                {isProfileModalOpen && (
                    <ProfileModal
                        isOpen={isProfileModalOpen}
                        onClose={() => setIsProfileModalOpen(false)}
                        user={fullUser}
                    />
                )}
            </React.Suspense>
        </div>
    );
};

export default MainLayout;
