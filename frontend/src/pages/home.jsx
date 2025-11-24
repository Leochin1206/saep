import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();
    const [nomeUsuario, setNomeUsuario] = useState('');

    useEffect(() => {
        const usuarioString = localStorage.getItem('usuario_saep');
        if (usuarioString) {
            const usuario = JSON.parse(usuarioString);
            setNomeUsuario(usuario.nome); 
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('usuario_saep');
        localStorage.removeItem('token_saep');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-green-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="shrink-0">
                            <h1 className="text-white text-xl font-bold">SAEP - Almoxarifado</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-white font-medium">
                                Olá, {nomeUsuario}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div 
                        onClick={() => navigate('/produtos')}
                        className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-l-4 border-green-500 group"
                    >
                        <div className="px-4 py-5 sm:p-6 h-48 flex flex-col justify-center items-center text-center">
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 mb-2">
                                Cadastro de Produtos
                            </h3>
                            <p className="text-gray-500">
                                Adicionar, editar, visualizar ou excluir produtos do sistema.
                            </p>
                        </div>
                    </div>

                    <div 
                        onClick={() => navigate('/estoque')}
                        className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-l-4 border-blue-500 group"
                    >
                        <div className="px-4 py-5 sm:p-6 h-48 flex flex-col justify-center items-center text-center">
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 mb-2">
                                Gestão de Estoque
                            </h3>
                            <p className="text-gray-500">
                                Registrar entradas e saídas e visualizar histórico de movimentações.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}