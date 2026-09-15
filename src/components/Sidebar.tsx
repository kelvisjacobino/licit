import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Calculator,
  Package,
  Building2,
  MessageSquareQuote,
  FileText,
  FileCheck2,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeLicitacaoFilter,
    setActiveLicitacaoFilter,
    licitacoes,
    documentos,
    produtos,
  } = useApp();

  const [licitacoesExpanded, setLicitacoesExpanded] = useState(true);

  // Contagens para badges rápidos
  const emAnaliseCount = licitacoes.filter((l) => l.status === 'analise').length;
  const emAndamentoCount = licitacoes.filter((l) =>
    ['preparacao', 'participando', 'disputa'].includes(l.status)
  ).length;
  const vencidasCount = licitacoes.filter((l) => l.status === 'vencida').length;
  const perdidasCount = licitacoes.filter((l) => l.status === 'perdida').length;

  const docsCriticosCount = documentos.filter(
    (d) => d.status === 'vencido' || d.status === 'alerta_7'
  ).length;

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 border-r border-slate-800 shrink-0 flex flex-col justify-between select-none">
      {/* Menu principal com scroll se necessário */}
      <div className="p-3 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-cyan-400" />
          <span>Dashboard</span>
        </button>

        {/* Licitações com submenu retrátil */}
        <div className="pt-1">
          <button
            onClick={() => {
              setActiveTab('licitacoes');
              setLicitacoesExpanded(!licitacoesExpanded);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'licitacoes'
                ? 'bg-slate-800/80 text-white border-l-4 border-blue-500'
                : 'hover:bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ClipboardList className="w-4 h-4 text-blue-400" />
              <span>Licitações</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                {licitacoes.length}
              </span>
              {licitacoesExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
          </button>

          {licitacoesExpanded && (
            <div className="ml-5 pl-2 my-1 border-l border-slate-800 space-y-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab('licitacoes', 'todas')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition ${
                  activeTab === 'licitacoes' && activeLicitacaoFilter === 'todas'
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>Todas</span>
                <span>{licitacoes.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('licitacoes', 'analise')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition ${
                  activeTab === 'licitacoes' && activeLicitacaoFilter === 'analise'
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Em análise</span>
                </span>
                <span>{emAnaliseCount}</span>
              </button>

              <button
                onClick={() => setActiveTab('licitacoes', 'andamento')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition ${
                  activeTab === 'licitacoes' && activeLicitacaoFilter === 'andamento'
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Em andamento</span>
                </span>
                <span>{emAndamentoCount}</span>
              </button>

              <button
                onClick={() => setActiveTab('licitacoes', 'vencidas')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition ${
                  activeTab === 'licitacoes' && activeLicitacaoFilter === 'vencidas'
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Vencidas (Ganhas)</span>
                </span>
                <span className="text-emerald-400 font-bold">{vencidasCount}</span>
              </button>

              <button
                onClick={() => setActiveTab('licitacoes', 'perdidas')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition ${
                  activeTab === 'licitacoes' && activeLicitacaoFilter === 'perdidas'
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Perdidas</span>
                </span>
                <span>{perdidasCount}</span>
              </button>
            </div>
          )}
        </div>

        {/* Formação de Preços & Simulador */}
        <button
          onClick={() => setActiveTab('formacao_preco')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'formacao_preco'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Formação de Preços</span>
        </button>

        {/* Produtos e Serviços */}
        <button
          onClick={() => setActiveTab('produtos')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'produtos'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Package className="w-4 h-4 text-indigo-400" />
            <span>Produtos & Serviços</span>
          </div>
          <span className="text-xs text-slate-400">{produtos.length}</span>
        </button>

        {/* Fornecedores */}
        <button
          onClick={() => setActiveTab('fornecedores')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'fornecedores'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4 text-sky-400" />
          <span>Fornecedores</span>
        </button>

        {/* Cotações */}
        <button
          onClick={() => setActiveTab('cotacoes')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'cotacoes'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4 text-violet-400" />
          <span>Cotações</span>
        </button>

        {/* Documentos & Cofre */}
        <button
          onClick={() => setActiveTab('documentos')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'documentos'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Documentos & Cofre</span>
          </div>
          {docsCriticosCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {docsCriticosCount} alerta
            </span>
          )}
        </button>

        {/* Propostas Comerciais */}
        <button
          onClick={() => setActiveTab('propostas')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'propostas'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-teal-400" />
          <span>Propostas Comerciais</span>
        </button>

        {/* Relatórios */}
        <button
          onClick={() => setActiveTab('relatorios')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'relatorios'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-orange-400" />
          <span>Relatórios</span>
        </button>

        {/* Configurações */}
        <button
          onClick={() => setActiveTab('configuracoes')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'configuracoes'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Configurações</span>
        </button>
      </div>

      {/* Cartão de Resumo Inferior */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/50 m-2 rounded-xl text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="font-semibold uppercase text-[10px] tracking-wider">Habilitação Jurídica</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all"
            style={{
              width: `${Math.round(
                (documentos.filter((d) => d.status === 'valido').length / Math.max(documentos.length, 1)) * 100
              )}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>{documentos.filter((d) => d.status === 'valido').length} válidos</span>
          <span className="text-slate-300 font-medium">
            {Math.round(
              (documentos.filter((d) => d.status === 'valido').length / Math.max(documentos.length, 1)) * 100
            )}
            %
          </span>
        </div>
      </div>
    </aside>
  );
};
