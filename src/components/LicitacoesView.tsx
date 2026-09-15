import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  Clock,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  FileCheck2,
  Layers,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Licitacao, LicitacaoStatus } from '../types';
import {
  analisarViabilidadeLicitacao,
  formatarData,
  formatarMoeda,
  formatarPct,
} from '../utils/pricing';

interface LicitacoesViewProps {
  onOpenNovaLicitacao: () => void;
  onEditarLicitacao: (licitacao: Licitacao) => void;
  onOpenViabilidade: (licitacaoId: string) => void;
  onOpenProposta: (licitacaoId: string) => void;
}

export const LicitacoesView: React.FC<LicitacoesViewProps> = ({
  onOpenNovaLicitacao,
  onEditarLicitacao,
  onOpenViabilidade,
  onOpenProposta,
}) => {
  const {
    licitacoes,
    documentos,
    activeLicitacaoFilter,
    setActiveLicitacaoFilter,
    deleteLicitacao,
    updateLicitacao,
  } = useApp();

  const [busca, setBusca] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'tabela'>('cards');

  // Filtragem conforme submenu e busca
  const licitacoesFiltradas = licitacoes.filter((lic) => {
    // Filtro de status
    if (activeLicitacaoFilter === 'analise' && lic.status !== 'analise') return false;
    if (
      activeLicitacaoFilter === 'andamento' &&
      !['preparacao', 'participando', 'disputa'].includes(lic.status)
    )
      return false;
    if (activeLicitacaoFilter === 'vencidas' && lic.status !== 'vencida') return false;
    if (activeLicitacaoFilter === 'perdidas' && lic.status !== 'perdida') return false;

    // Busca textual
    if (busca.trim()) {
      const q = busca.toLowerCase();
      const matchNumero = (lic.numero || '').toLowerCase().includes(q);
      const matchOrgao = (lic.orgao || '').toLowerCase().includes(q);
      const matchObjeto = (lic.objeto || '').toLowerCase().includes(q);
      const matchPortal = (lic.portal || '').toLowerCase().includes(q);
      return matchNumero || matchOrgao || matchObjeto || matchPortal;
    }

    return true;
  });

  // Estatísticas rápidas
  const totalEmDisputa = licitacoes
    .filter((l) => ['analise', 'preparacao', 'participando', 'disputa'].includes(l.status))
    .reduce((acc, l) => acc + (l.valorEstimado || 0), 0);

  const totalVencido = licitacoes
    .filter((l) => l.status === 'vencida')
    .reduce((acc, l) => acc + (l.valorEstimado || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Gestão de Oportunidades Públicas
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <span>Licitações & Certames</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Acompanhamento de editais, composição de custos por item e cálculo de viabilidade comercial.
          </p>
        </div>

        <button
          onClick={onOpenNovaLicitacao}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Licitação</span>
        </button>
      </div>

      {/* Mini KPIs de Licitações */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Total em Pipeline</div>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {formatarMoeda(totalEmDisputa)}
            </div>
            <div className="text-[10px] text-slate-400">Oportunidades ativas</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Homologadas (Vencidas)</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatarMoeda(totalVencido)}
            </div>
            <div className="text-[10px] text-slate-400">
              {licitacoes.filter((l) => l.status === 'vencida').length} contratos ganhos
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Certames Registrados</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {licitacoes.length}
            </div>
            <div className="text-[10px] text-slate-400">Total no banco de dados</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros Rápidos e Pesquisa */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Sub-abas de Status */}
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          {[
            { id: 'todas', label: 'Todas', count: licitacoes.length },
            {
              id: 'analise',
              label: 'Em análise',
              count: licitacoes.filter((l) => l.status === 'analise').length,
            },
            {
              id: 'andamento',
              label: 'Em andamento',
              count: licitacoes.filter((l) =>
                ['preparacao', 'participando', 'disputa'].includes(l.status)
              ).length,
            },
            {
              id: 'vencidas',
              label: 'Vencidas',
              count: licitacoes.filter((l) => l.status === 'vencida').length,
            },
            {
              id: 'perdidas',
              label: 'Perdidas',
              count: licitacoes.filter((l) => l.status === 'perdida').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLicitacaoFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeLicitacaoFilter === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 opacity-80 text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Input de Busca */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por número, órgão, objeto..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Lista de Cards de Licitação */}
      {licitacoesFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Nenhuma licitação encontrada
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Não há registros correspondentes aos filtros selecionados. Cadastre uma nova oportunidade para iniciar.
          </p>
          <button
            onClick={onOpenNovaLicitacao}
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Licitação</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {licitacoesFiltradas.map((lic) => {
            const viabilidade = analisarViabilidadeLicitacao(lic, documentos);
            const totalProposto = (lic.itens || []).reduce(
              (acc, it) => acc + it.precoProposto * it.quantidade,
              0
            );

            return (
              <div
                key={lic.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Faixa Superior do Card */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                        {lic.numero}
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {lic.modalidade}
                      </span>
                      {lic.portal && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          {lic.portal}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lic.orgao}</span>
                      {lic.cnpjOrgao && (
                        <span className="text-slate-400 font-normal">({lic.cnpjOrgao})</span>
                      )}
                    </div>
                  </div>

                  {/* Badges de Status e Viabilidade */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status da Licitação */}
                    <select
                      value={lic.status}
                      onChange={(e) =>
                        updateLicitacao({ ...lic, status: e.target.value as LicitacaoStatus })
                      }
                      className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="analise">🔵 Em análise</option>
                      <option value="preparacao">🟡 Preparação</option>
                      <option value="participando">🟢 Participando</option>
                      <option value="disputa">🟣 Em disputa</option>
                      <option value="vencida">🏆 Vencida</option>
                      <option value="perdida">🔴 Perdida</option>
                      <option value="cancelada">⚫ Cancelada</option>
                    </select>

                    {/* Botão Parecer de Viabilidade */}
                    <button
                      onClick={() => onOpenViabilidade(lic.id)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold border shadow-sm transition hover:opacity-90 ${viabilidade.badgeBg} ${viabilidade.badgeBorder}`}
                    >
                      <span>{viabilidade.rotulo}</span>
                    </button>
                  </div>
                </div>

                {/* Corpo do Card: Objeto, Datas, Valores e Tabela de Itens */}
                <div className="p-5 space-y-4">
                  {/* Descrição do Objeto */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Objeto da Licitação
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                      {lic.objeto}
                    </p>
                  </div>

                  {/* Grid de Metadados: Abertura, Horário, Valores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Abertura / Disputa</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{formatarData(lic.dataAbertura)}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 block">às {lic.horario}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Teto do Órgão</span>
                      <span className="font-bold text-slate-900 dark:text-white block mt-0.5 font-mono">
                        {formatarMoeda(lic.valorEstimado)}
                      </span>
                      <span className="text-[10px] text-slate-400">Edital oficial</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Preço Proposto Davenza</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 block mt-0.5 font-mono">
                        {formatarMoeda(totalProposto)}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Margem: {formatarPct(viabilidade.margemMediaPct)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Lucro Estimado</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5 font-mono">
                        {formatarMoeda(viabilidade.lucroEstimadoTotal)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {lic.itens?.length || 0} item(ns)
                      </span>
                    </div>
                  </div>

                  {/* Resumo de Itens Cadastrados */}
                  {(lic.itens || []).length > 0 && (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                      <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 flex justify-between items-center">
                        <span>Composição de Itens Cotados</span>
                        <span className="text-[11px] text-slate-500">
                          {lic.itens.length} produto(s) / serviço(s)
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {lic.itens.map((it) => (
                          <div
                            key={it.id}
                            className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                          >
                            <div>
                              <span className="font-mono font-bold text-blue-600 mr-2">
                                Item #{it.numeroItem}
                              </span>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {it.produtoNome}
                              </span>
                              <span className="text-slate-500 text-[11px] ml-2">
                                ({it.quantidade} {it.unidade})
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 text-right">
                              <div>
                                <span className="text-[10px] text-slate-400 block">Preço Mínimo</span>
                                <span className="font-mono text-amber-600 dark:text-amber-400">
                                  {formatarMoeda(it.precoMinimo)}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block">Proposto</span>
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                  {formatarMoeda(it.precoProposto)}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block">Margem</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  {formatarPct(it.margemCalculadaPct)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rodapé de Ações Rápidas */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500">
                    Responsável: <span className="font-semibold text-slate-700 dark:text-slate-300">{lic.responsavel}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onOpenViabilidade(lic.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Viabilidade</span>
                    </button>

                    <button
                      onClick={() => onOpenProposta(lic.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Gerar Proposta</span>
                    </button>

                    <button
                      onClick={() => onEditarLicitacao(lic)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition flex items-center space-x-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Deseja excluir a licitação ${lic.numero}?`)) {
                          deleteLicitacao(lic.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Excluir licitação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
