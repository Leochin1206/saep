import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function GestaoEstoque() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [tipoMovimentacao, setTipoMovimentacao] = useState('entrada');
    const [quantidade, setQuantidade] = useState('');
    const [dataMovimentacao, setDataMovimentacao] = useState('');
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' }); 

    useEffect(() => {
        const usuarioString = localStorage.getItem('usuario_saep');
        if (usuarioString) {
            const usuario = JSON.parse(usuarioString);
            setNomeUsuario(usuario.nome);
        }
        carregarProdutos();
    }, []);

    const ordenarProdutos = (lista) => {
        return lista.sort((a, b) => {
            if (a.nome.toLowerCase() < b.nome.toLowerCase()) return -1;
            if (a.nome.toLowerCase() > b.nome.toLowerCase()) return 1;
            return 0;
        });
    };

    const carregarProdutos = async () => {
        try {
            const token = localStorage.getItem('token_saep');
            const response = await axios.get('http://127.0.0.1:8000/api/produtos/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const produtosOrdenados = ordenarProdutos(response.data);
            setProdutos(produtosOrdenados);
        } catch (error) {
            console.error("Erro ao carregar produtos", error);
        }
    };

    const handleMovimentacao = async (e) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });

        if (!produtoSelecionado || !quantidade || !dataMovimentacao) {
            setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos.' });
            return;
        }

        try {
            const token = localStorage.getItem('token_saep');
            const usuario = JSON.parse(localStorage.getItem('usuario_saep'));

            const payload = {
                produto: produtoSelecionado,
                usuario: usuario.id,
                tipo: tipoMovimentacao,
                quantidade: parseInt(quantidade),
                data_movimentacao: dataMovimentacao
            };

            await axios.post('http://127.0.0.1:8000/api/movimentacoes/', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const response = await axios.get('http://127.0.0.1:8000/api/produtos/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const produtosAtualizados = ordenarProdutos(response.data);
            setProdutos(produtosAtualizados);
            setQuantidade('');
            setDataMovimentacao('');
            
            if (tipoMovimentacao === 'saida') {
                const produtoAfetado = produtosAtualizados.find(p => p.id === parseInt(produtoSelecionado));
                
                if (produtoAfetado && produtoAfetado.quantidade < produtoAfetado.quantidade_minima) {
                    setMensagem({ 
                        tipo: 'alerta', 
                        texto: `Sucesso! ATENÇÃO: O estoque do produto "${produtoAfetado.nome}" está abaixo do mínimo (${produtoAfetado.quantidade_minima}). Estoque atual: ${produtoAfetado.quantidade}.` 
                    });
                    return;
                }
            }

            setMensagem({ tipo: 'sucesso', texto: 'Movimentação registrada com sucesso!' });

        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.erro) {
                setMensagem({ tipo: 'erro', texto: error.response.data.erro });
            } else {
                setMensagem({ tipo: 'erro', texto: 'Erro ao registrar movimentação.' });
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

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Nova Movimentação</h2>
                                <button onClick={() => navigate('/home')} className="text-sm text-gray-500 hover:text-gray-700">Voltar</button>
                            </div>

                            {mensagem.texto && (
                                <div className={`mb-4 p-3 rounded text-sm ${
                                    mensagem.tipo === 'erro' ? 'bg-red-100 text-red-800 border border-red-200' : 
                                    mensagem.tipo === 'alerta' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                    'bg-green-100 text-green-800 border border-green-200'
                                }`}>
                                    {mensagem.texto}
                                </div>
                            )}

                            <form onSubmit={handleMovimentacao} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Produto</label>
                                    <select 
                                        value={produtoSelecionado}
                                        onChange={(e) => setProdutoSelecionado(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Selecione um produto...</option>
                                        {produtos.map(p => (
                                            <option key={p.id} value={p.id}>{p.nome} (Qtd: {p.quantidade})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                    <div className="mt-1 flex space-x-4">
                                        <label className="flex items-center">
                                            <input 
                                                type="radio" 
                                                value="entrada" 
                                                checked={tipoMovimentacao === 'entrada'}
                                                onChange={() => setTipoMovimentacao('entrada')}
                                                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                                            />
                                            <span className="ml-2 text-gray-700">Entrada</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input 
                                                type="radio" 
                                                value="saida" 
                                                checked={tipoMovimentacao === 'saida'}
                                                onChange={() => setTipoMovimentacao('saida')}
                                                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                                            />
                                            <span className="ml-2 text-gray-700">Saída</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={quantidade}
                                        onChange={(e) => setQuantidade(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Data</label>
                                    <input 
                                        type="date" 
                                        value={dataMovimentacao}
                                        onChange={(e) => setDataMovimentacao(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
                                    Confirmar Movimentação
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Situação Atual do Estoque</h3>
                                <p className="text-sm text-gray-500">Ordenado Alfabeticamente (A-Z)</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque Atual</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mínimo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {produtos.map((produto) => (
                                            <tr key={produto.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produto.nome}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.quantidade}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.quantidade_minima}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {produto.quantidade < produto.quantidade_minima ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Baixo Estoque
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Normal
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}