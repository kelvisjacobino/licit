import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Search,
  Plus,
  Building2,
  Package,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Cotacao } from '../types';
import { formatarData, formatarMoeda } from '../utils/pricing';
import { CotacaoModal } from './CotacaoModal';

export const CotacoesView: React.FC = () => {
  const { cotacoes, fornecedores, produtos, licitacoes, deleteCotacao, setActiveTab } =
    useApp();

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<string>('todas');
  const [modalAberto, setModalAberto] = useState(false);
  const [cotacaoEditando, setCotacaoEditando] = useState<Cotacao | null>(null);

  const cotacoesFiltradas = cotacoes.filter((c) => {
    if (statusFiltro !== 'todas' && c.status !== statusFiltro) return false;

    if (busca.trim()) {
      const q = busca.toLowerCase();
      const forn = fornecedores.find((f) => f.id === c.fornecedorId);
      const prod = produtos.find((p) => p.id === c.produtoId);

      return (
        c.numero.toLowerCase().includes(q) ||
        forn?.nomeFantasia.toLowerCase().includes(q) ||
        prod?.nome.toLowerCase().includes(q)
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
            Gestão de Compras & Cotações
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <MessageSquareQuote className="w-6 h-6 text-violet-600" />
            <span>Controle de Cotações com Fornecedores</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Histórico e rastreamento de orçamentos, prazos de validade e condições comerciais de distribuidores.
          </p>
        </div>

        <button
          onClick={() => {
            setCotacaoEditando(null);
            setModalAberto(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nova Cotação</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-semibold">
          {[
            { id: 'todas', label: 'Todas', count: cotacoes.length },
            {
              id: 'vigente',
              label: 'Vigentes',
              count: cotacoes.filter((c) => c.status === 'vigente').length,
            },
            {
              id: 'aprovada',
              label: 'Aprovadas',
              count: cotacoes.filter((c) => c.status === 'aprovada').length,
            },
            {
              id: 'vencida',
              label: 'Vencidas',
              count: cotacoes.filter((c) => c.status === 'vencida').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFiltro(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFiltro === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1 text-[10px] opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar cotação, fornecedor, produto..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>
      </div>

      {/* Tabela de Cotações */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Cotação / Data</th>
                <th className="py-3 px-4">Produto / Serviço</th>
                <th className="py-3 px-4">Fornecedor</th>
                <th className="py-3 px-4 text-center">Qtd</th>
                <th className="py-3 px-4 text-right">Valor Unitário</th>
                <th className="py-3 px-4 text-right">Total c/ Frete</th>
                <th className="py-3 px-4 text-center">Validade</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {cotacoesFiltradas.map((cot) => {
                const forn = fornecedores.find((f) => f.id === cot.fornecedorId);
                const prod = produtos.find((p) => p.id === cot.produtoId);
                const totalItem = cot.valorUnitario * cot.quantidade + cot.frete + cot.taxas;

                return (
                  <tr key={cot.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {cot.numero}
                      </div>
                      <div className="text-[11px] text-slate-400">{formatarData(cot.dataCotacao)}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {prod?.nome || 'Item não encontrado'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {forn?.nomeFantasia || 'Fornecedor'}
                      </div>
                      <div className="text-[10px] text-slate-400">{cot.condicaoPagamento}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-medium">
                      {cot.quantidade}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-medium">
                      {formatarMoeda(cot.valorUnitario)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatarMoeda(totalItem)}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {formatarData(cot.validadeCotacao)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {cot.status === 'vigente' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          Vigente
                        </span>
                      )}
                      {cot.status === 'aprovada' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                          Aprovada
                        </span>
                      )}
                      {cot.status === 'vencida' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          Vencida
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setCotacaoEditando(cot);
                          setModalAberto(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja remover a cotação ${cot.numero}?`)) {
                            deleteCotacao(cot.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <CotacaoModal
          cotacaoParaEditar={cotacaoEditando}
          onClose={() => {
            setModalAberto(false);
            setCotacaoEditando(null);
          }}
        />
      )}
    </div>
  );
};
