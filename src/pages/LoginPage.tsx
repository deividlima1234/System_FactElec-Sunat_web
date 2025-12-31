import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import logo from '../assets/images/logo_Empresarial.png';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ username, password });
            navigate('/');
        } catch (err: any) {
            setError('Credenciales inválidas. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md z-10 p-4">
                <div className="bg-slate-900 border-t-4 border-primary rounded-lg shadow-xl p-8">
                    <div className="text-center mb-8">
                        <img src={logo} alt="EddamCore Logo" className="mx-auto h-[100px] mb-4" />
                        <p className="text-gray-400">Cybersecurity & Software Development</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 flex items-center text-sm">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Usuario
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="User"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="input-field pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex justify-center py-2.5"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} EddamCore. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
