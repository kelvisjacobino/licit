import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Wrench,
  Layers,
  Box,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Produto } from '../types';
import { formatarMoeda } from '../utils/pricing';
import { ProdutoModal } from './ProdutoModal';

/**
 * Função utilitária para determinar se um item é estritamente Serviço ou Produto/Licença
 */
export const isItemServico = (p: Produto): boolean => {
  // 1. Se tiver tipo explicitamente definido
  if (p.tipo) {
    const t = String(p.tipo).toLowerCase();
    if (t.includes('servi')) return true;
    if (t.includes('prod')) return false;
  }
  // 2. Se não tiver tipo, infere pela categoria
  const cat = (p.categoria || '').toLowerCase();
  return cat.includes('servi') || cat.includes('consult') || cat.includes('treina');
};

export const ProdutosView: React.FC = () => {
  const { produtos, fornecedores, deleteProduto } = useApp();

  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'produto' | 'servico'>('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  // Contagem estrita por tipo
  const totalServicos = produtos.filter((p) => isItemServico(p)).length;
  const totalProdutos = produtos.filter((p) => !isItemServico(p)).length;

  // Categorias disponíveis no catálogo
  const categoriasDisponiveis = Array.from(
    new Set(produtos.map((p) => p.categoria).filter(Boolean))
  );

  const produtosFiltrados = produtos.filter((p) => {
    const ehServico = isItemServico(p);

    // Filtro por Tipo Principal (Todos / Produtos / Serviços)
    if (tipoFiltro === 'produto' && ehServico) {
      return false; // Se quer ver produtos, descarta serviços
    }
    if (tipoFiltro === 'servico' && !ehServico) {
      return false; // Se quer ver serviços, descarta produtos (como softwares e hardwares)
    }

    // Filtro por Categoria Específica
    if (categoriaFiltro !== 'todas') {
      const catNorm = (p.categoria || '').toLowerCase().replace(/s$/, '');
      const filtroNorm = categoriaFiltro.toLowerCase().replace(/s$/, '');
      if (catNorm !== filtroNorm) {
        return false;
      }
    }

    // Filtro de Busca Textual
    if (busca.trim()) {
      const q = busca.toLowerCase();
      const matchNome = (p.nome || '').toLowerCase().includes(q);
      const matchSku = (p.sku || p.codigo || '').toLowerCase().includes(q);
      const matchMarca = (p.marca || '').toLowerCase().includes(q);
      const matchDesc = (p.descricao || p.observacoes || '').toLowerCase().includes(q);

      return matchNome || matchSku || matchMarca || matchDesc;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Topo do Módulo */}
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
            Gestão de softwares, hardwares, serviços técnicos e consultorias com rastreabilidade de custos.
          </p>
        </div>

        <button
          id="btn-novo-produto"
          onClick={() => {
            setProdutoEditando(null);
            setModalAberto(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto / Serviço</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Botões Segmentados de Filtro com Destaque Visual Nítido */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              id="filter-tipo-todos"
              type="button"
              onClick={() => setTipoFiltro('todos')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                tipoFiltro === 'todos'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Todos</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                tipoFiltro === 'todos' ? 'bg-blue-700/80 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {produtos.length}
              </span>
            </button>

            <button
              id="filter-tipo-produto"
              type="button"
              onClick={() => setTipoFiltro('produto')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                tipoFiltro === 'produto'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Produtos & Licenças</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                tipoFiltro === 'produto' ? 'bg-blue-700/80 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {totalProdutos}
              </span>
            </button>

            <button
              id="filter-tipo-servico"
              type="button"
              onClick={() => setTipoFiltro('servico')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                tipoFiltro === 'servico'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Serviços & Consultorias</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                tipoFiltro === 'servico' ? 'bg-blue-700/80 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {totalServicos}
              </span>
            </button>
          </div>

          {/* Filtro por Categoria Específica */}
          <select
            id="filter-categoria"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="todas">Todas as categorias</option>
            {categoriasDisponiveis.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Botão para limpar filtros caso ativo */}
          {(tipoFiltro !== 'todos' || categoriaFiltro !== 'todas' || busca) && (
            <button
              id="btn-limpar-filtros"
              type="button"
              onClick={() => {
                setTipoFiltro('todos');
                setCategoriaFiltro('todas');
                setBusca('');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold px-2 cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Campo de Busca Textual */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="input-busca-produtos"
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, SKU, fabricante..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>
      </div>

      {/* Grid de Itens */}
      {produtosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3 shadow-sm">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">
            Nenhum item encontrado para esta seleção
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {tipoFiltro === 'servico' && 'Não há serviços que atendam a este filtro no momento.'}
            {tipoFiltro === 'produto' && 'Não há produtos ou licenças que atendam a este filtro no momento.'}
            {tipoFiltro === 'todos' && 'Nenhum registro corresponde aos critérios pesquisados.'}
          </p>
          <button
            onClick={() => {
              setTipoFiltro('todos');
              setCategoriaFiltro('todas');
              setBusca('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition cursor-pointer"
          >
            Exibir Todo o Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtosFiltrados.map((prod) => {
            const fornecedor = fornecedores.find((f) => f.id === prod.fornecedorPrincipalId);
            const ehServico = isItemServico(prod);

            // Cores de badge por categoria
            const getCategoriaBadge = () => {
              const cat = (prod.categoria || '').toLowerCase();
              if (cat.includes('soft')) {
                return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900';
              }
              if (cat.includes('hard')) {
                return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900';
              }
              if (cat.includes('serv')) {
                return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
              }
              if (cat.includes('consult')) {
                return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900';
              }
              return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
            };

            return (
              <div
                key={prod.id}
                id={`card-produto-${prod.id}`}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header do Card com Badges Limpos e Objetivos */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        {/* Categoria Clara (Software, Hardware, Serviço, etc.) */}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoriaBadge()}`}>
                          {prod.categoria || (ehServico ? 'Serviço' : 'Produto')}
                        </span>

                        {/* Indicador de Natureza: Produto/Licença ou Serviço Técnico */}
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">
                          {ehServico ? 'Serviço' : 'Produto / Licença'}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2 leading-tight">
                        {prod.nome}
                      </h3>
                    </div>

                    <div className="flex space-x-1 shrink-0 ml-2">
                      <button
                        id={`btn-editar-${prod.id}`}
                        onClick={() => {
                          setProdutoEditando(prod);
                          setModalAberto(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`btn-excluir-${prod.id}`}
                        onClick={() => {
                          if (confirm(`Deseja excluir o item ${prod.nome}?`)) {
                            deleteProduto(prod.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {prod.descricao || prod.observacoes || 'Item cadastrado no catálogo corporativo.'}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Código / SKU:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {prod.sku || prod.codigo || 'S/N'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fabricante / Marca:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {prod.marca || 'DavenzaTec'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distribuidor / Canal:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                        {fornecedor?.nomeFantasia || 'Próprio / Direto'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unidade de Medida:</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {prod.unidade || 'Unidade'}
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
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                      {formatarMoeda(prod.precoSugerido)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
