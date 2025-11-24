import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function CadastroProduto() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [erro, setErro] = useState('');
    const [produtoAtual, setProdutoAtual] = useState(null); 
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        quantidade: '',
        quantidade_minima: ''
    });

    const [nomeUsuario, setNomeUsuario] = useState('');

    useEffect(() => {
        const usuarioString = localStorage.getItem('usuario_saep');
        if (usuarioString) {
            const usuario = JSON.parse(usuarioString);
            setNomeUsuario(usuario.nome);
        }
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const token = localStorage.getItem('token_saep');
            const response = await axios.get('http://127.0.0.1:8000/api/produtos/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProdutos(response.data);
            setProdutosFiltrados(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao carregar produtos", error);
            setLoading(false);
        }
    };

    const handleBusca = () => {
        if (!busca) {
            setProdutosFiltrados(produtos);
        } else {
            const termo = busca.toLowerCase();
            const filtrados = produtos.filter(p => 
                p.nome.toLowerCase().includes(termo) || 
                (p.descricao && p.descricao.toLowerCase().includes(termo))
            );
            setProdutosFiltrados(filtrados);
        }
    };

    const abrirModalNovo = () => {
        setProdutoAtual(null);
        setFormData({ nome: '', descricao: '', preco: '', quantidade: 0, quantidade_minima: 5 });
        setErro('');
        setModalAberto(true);
    };

    const abrirModalEdicao = (produto) => {
        setProdutoAtual(produto);
        setFormData({
            nome: produto.nome,
            descricao: produto.descricao || '',
            preco: produto.preco,
            quantidade: produto.quantidade,
            quantidade_minima: produto.quantidade_minima
        });
        setErro('');
        setModalAberto(true);
    };

    const salvarProduto = async (e) => {
        e.preventDefault();
        
        if (!formData.nome || !formData.preco || formData.quantidade === '') {
            setErro("Preencha os campos obrigatórios (Nome, Preço, Quantidade).");
            return;
        }

        try {
            const token = localStorage.getItem('token_saep');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (produtoAtual) {
                await axios.put(`http://127.0.0.1:8000/api/produtos/${produtoAtual.id}/`, formData, config);
            } else {
                await axios.post('http://127.0.0.1:8000/api/produtos/', formData, config);
            }

            setModalAberto(false);
            carregarProdutos(); 
        } catch (error) {
            console.error(error);
            setErro("Erro ao salvar produto. Verifique os dados.");
        }
    };

    const deletarProduto = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            try {
                const token = localStorage.getItem('token_saep');
                await axios.delete(`http://127.0.0.1:8000/api/produtos/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                carregarProdutos();
            } catch (error) {
                alert("Erro ao excluir produto.");
            }
        }
    };

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
                            <span className="text-white font-medium">Olá, {nomeUsuario}</span>
                            <button onClick={handleLogout} className="bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                    <button 
                        onClick={() => navigate('/home')} 
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow transition-colors self-start md:self-auto"
                    >
                        ← Voltar
                    </button>

                    <div className="flex w-full md:w-1/2 space-x-2">
                        <input 
                            type="text" 
                            placeholder="Buscar produto..." 
                            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleBusca()} 
                        />
                        <button 
                            onClick={handleBusca} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors"
                        >
                            Buscar
                        </button>
                    </div>

                    <button 
                        onClick={abrirModalNovo} 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-colors self-end md:self-auto"
                    >
                        + Novo Produto
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd Atual</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd Mín</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="6" className="px-6 py-4 text-center">Carregando...</td></tr>
                                ) : produtosFiltrados.length === 0 ? (
                                    <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Nenhum produto encontrado.</td></tr>
                                ) : (
                                    produtosFiltrados.map((produto) => (
                                        <tr key={produto.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{produto.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produto.nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {parseFloat(produto.preco).toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${produto.quantidade < produto.quantidade_minima ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {produto.quantidade}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.quantidade_minima}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => abrirModalEdicao(produto)} 
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => deletarProduto(produto.id)} 
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {modalAberto && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/30 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {produtoAtual ? 'Editar Produto' : 'Novo Produto'}
                        </h2>
                        
                        {erro && <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">{erro}</div>}

                        <form onSubmit={salvarProduto} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                    value={formData.descricao}
                                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                        value={formData.preco}
                                        onChange={(e) => setFormData({...formData, preco: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Qtd Mínima</label>
                                    <input 
                                        type="number" 
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                        value={formData.quantidade_minima}
                                        onChange={(e) => setFormData({...formData, quantidade_minima: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            
                            {/* Campo Quantidade só aparece na criação. Na edição, a qtd é gerenciada pela tela de Estoque */}
                            {!produtoAtual && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantidade Inicial</label>
                                    <input 
                                        type="number" 
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                        value={formData.quantidade}
                                        onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                                        required
                                    />
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setModalAberto(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}