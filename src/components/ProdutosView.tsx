import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Filter,
  Layers,
  Edit,
  Trash2,
  Building2,
  TrendingUp,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Produto, ProdutoCategoria, ProdutoTipo } from '../types';
import { formatarMoeda, formatarPct } from '../utils/pricing';
import { ProdutoModal } from './ProdutoModal';

export const ProdutosView: React.FC = () => {
  const { produtos, fornecedores, deleteProduto } = useApp();

  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const produtosFiltrados = produtos.filter((p) => {
    if (tipoFiltro !== 'todos' && p.tipo !== tipoFiltro) return false;
    if (categoriaFiltro !== 'todas' && p.categoria !== categoriaFiltro) return false;

    if (busca.trim()) {
      const q = busca.toLowerCase();
      return (
        p.nome.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Catálogo & Portfólio de Soluções
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <span>Produtos & Serviços</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de softwares, hardwares, serviços e consultorias com rastreabilidade de custos e fornecedores.
          </p>
        </div>

        <button
          onClick={() => {
            setProdutoEditando(null);
            setModalAberto(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto / Serviço</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro Tipo */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setTipoFiltro('todos')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                tipoFiltro === 'todos'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Todos ({produtos.length})
            </button>
            <button
              onClick={() => setTipoFiltro('produto')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                tipoFiltro === 'produto'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Produtos
            </button>
            <button
              onClick={() => setTipoFiltro('servico')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                tipoFiltro === 'servico'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Serviços
            </button>
          </div>

          {/* Filtro Categoria */}
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="todas">Todas as categorias</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Serviços">Serviços</option>
            <option value="Consultoria">Consultoria</option>
            <option value="Cloud">Cloud</option>
          </select>
        </div>

        {/* Busca */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, SKU, fabricante..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>
      </div>

      {/* Grid de Itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtosFiltrados.map((prod) => {
          const fornecedor = fornecedores.find((f) => f.id === prod.fornecedorPrincipalId);

          return (
            <div
              key={prod.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header do Card */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                      {prod.categoria} • {prod.tipo.toUpperCase()}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                      {prod.nome}
                    </h3>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setProdutoEditando(prod);
                        setModalAberto(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Editar"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja excluir o item ${prod.nome}?`)) {
                          deleteProduto(prod.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {prod.descricao}
                </p>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>SKU / Fabricante:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {prod.sku} ({prod.marca})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distribuidor Ref:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                      {fornecedor?.nomeFantasia || 'Nenhum'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco de Preços & Margem */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Custo Base</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {formatarMoeda(prod.custoAtual)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Sugerido Venda</span>
                  <span className="font-mono font-black text-blue-600 dark:text-blue-400">
                    {formatarMoeda(prod.precoSugerido)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalAberto && (
        <ProdutoModal
          produtoParaEditar={produtoEditando}
          onClose={() => {
            setModalAberto(false);
            setProdutoEditando(null);
          }}
        />
      )}
    </div>
  );
};
