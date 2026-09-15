import React from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Building2,
  Layers,
  ArrowRight,
  ShieldAlert,
  Calculator,
  Plus,
  ExternalLink,
  Percent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  analisarViabilidadeLicitacao,
  formatarData,
  formatarMoeda,
  formatarPct,
} from '../utils/pricing';

interface DashboardViewProps {
  onOpenNovaLicitacao: () => void;
  onOpenViabilidade: (licitacaoId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNovaLicitacao,
  onOpenViabilidade,
}) => {
  const {
    licitacoes,
    documentos,
    produtos,
    fornecedores,
    cotacoes,
    setActiveTab,
    setSelectedLicitacaoId,
  } = useApp();

  // 1. Cálculos de Licitações
  const licitacoesAnalise = licitacoes.filter((l) => l.status === 'analise');
  const licitacoesAndamento = licitacoes.filter((l) =>
    ['preparacao', 'participando', 'disputa'].includes(l.status)
  );
  const licitacoesVencidas = licitacoes.filter((l) => l.status === 'vencida');
  const licitacoesPerdidas = licitacoes.filter((l) => l.status === 'perdida');

  // 2. Cálculos Financeiros e Oportunidades
  let valorTotalOportunidades = 0;
  let valorTotalVencido = 0;
  let lucroPotencialTotal = 0;
  let somaMargens = 0;
  let itensComMargemCount = 0;

  licitacoes.forEach((lic) => {
    if (['analise', 'preparacao', 'participando', 'disputa'].includes(lic.status)) {
      valorTotalOportunidades += lic.valorEstimado || 0;
    }
    if (lic.status === 'vencida') {
      valorTotalVencido += lic.valorEstimado || 0;
    }

    (lic.itens || []).forEach((item) => {
      if (item.precoProposto > 0) {
        lucroPotencialTotal += item.lucroEstimadoTotal || 0;
        somaMargens += item.margemCalculadaPct || 0;
        itensComMargemCount++;
      }
    });
  });

  const margemMedia = itensComMargemCount > 0 ? somaMargens / itensComMargemCount : 18.7;

  // 3. Documentos
  const docsValidos = documentos.filter((d) => d.status === 'valido');
  const docsVencendo30 = documentos.filter((d) => d.status === 'alerta_30');
  const docsVencendo7 = documentos.filter((d) => d.status === 'alerta_7');
  const docsVencidos = documentos.filter((d) => d.status === 'vencido');
  const docsProximosVencimento = docsVencendo30.length + docsVencendo7.length;

  // 4. Cotações
  const cotacoesVigentes = cotacoes.filter((c) => c.status === 'vigente');

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-vindas & Visão Estratégica */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                DavenzaTec Licitações & Formação de Preços
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Painel Integrado de Decisão Comercial
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Avaliação de viabilidade de negócios, controle de habilitação jurídica, gestão de cotações com distribuidores e cálculo rigoroso de preço mínimo com garantia de margem de lucro.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('formacao_preco')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 shadow-sm transition"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Formação de Preço</span>
            </button>
            <button
              onClick={onOpenNovaLicitacao}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-900/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Licitação</span>
            </button>
          </div>
        </div>

        {/* Linha do Fluxo Principal (Visual do Item 2 do Prompt) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Fluxo Operacional de Inteligência em Licitações</span>
            <span className="text-cyan-400 font-normal lowercase">decisão orientada a margem</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block font-mono">ETAPA 1</span>
              <span className="font-semibold text-slate-200">Licitação & Itens</span>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block font-mono">ETAPA 2</span>
              <span className="font-semibold text-slate-200">Fornecedor & Cotação</span>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block font-mono">ETAPA 3</span>
              <span className="font-semibold text-slate-200">Custo Base + Frete</span>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block font-mono">ETAPA 4</span>
              <span className="font-semibold text-slate-200">Impostos & Riscos</span>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block font-mono">ETAPA 5</span>
              <span className="font-semibold text-emerald-400">Preço Mínimo</span>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block font-mono">ETAPA 6</span>
              <span className="font-semibold text-cyan-400">Proposta Comercial</span>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700/60 col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-[10px] block font-mono">DECISÃO</span>
              <span className="font-bold text-amber-400">Viabilidade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal de Indicadores (Conforme Seção 3 do Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Licitações */}
        <div
          onClick={() => setActiveTab('licitacoes')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Licitações</span>
            <Briefcase className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{licitacoes.length}</span>
            <span className="text-xs text-slate-500">oportunidades</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{licitacoesAnalise.length} em análise</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{licitacoesAndamento.length} ativas</span>
            </span>
          </div>
        </div>

        {/* Documentos & Validades */}
        <div
          onClick={() => setActiveTab('documentos')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Documentos de Habilitação</span>
            <FileText className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{documentos.length}</span>
            <span className="text-xs text-slate-500">no cofre</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {docsValidos.length} válidos
            </span>
            {docsVencidos.length > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                {docsVencidos.length} vencidos
              </span>
            ) : docsProximosVencimento > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {docsProximosVencimento} a vencer
              </span>
            ) : (
              <span className="text-slate-500">100% em dia</span>
            )}
          </div>
        </div>

        {/* Catálogo de Produtos & Fornecedores */}
        <div
          onClick={() => setActiveTab('produtos')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Produtos & Serviços</span>
            <Layers className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{produtos.length}</span>
            <span className="text-xs text-slate-500">itens cadastrados</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{fornecedores.length} fornecedores</span>
            <span>{cotacoesVigentes.length} cotações vigentes</span>
          </div>
        </div>

        {/* Margem Média & Rentabilidade */}
        <div
          onClick={() => setActiveTab('formacao_preco')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Margem Média Operacional</span>
            <Percent className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {formatarPct(margemMedia)}
            </span>
            <span className="text-xs text-slate-500">meta: 20%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Lucro potencial:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatarMoeda(lucroPotencialTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Destaque Financeiro: Pipeline de Oportunidades & Contratos Homologados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900/70 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valor em Disputa (Pipeline)</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {formatarMoeda(valorTotalOportunidades)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Soma estimada das licitações em análise e ativas
            </div>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/70 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Licitações Vencidas (Ganhas)</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {formatarMoeda(valorTotalVencido)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {licitacoesVencidas.length} certame(s) homologado(s) com sucesso
            </div>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/70 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxa de Sucesso (Win Rate)</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {licitacoesVencidas.length + licitacoesPerdidas.length > 0
                ? `${Math.round(
                    (licitacoesVencidas.length /
                      (licitacoesVencidas.length + licitacoesPerdidas.length)) *
                      100
                  )}%`
                : '100%'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {licitacoesVencidas.length} ganha(s) vs {licitacoesPerdidas.length} perdida(s)
            </div>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Seção Central: Licitações Prioritárias & Análise de Viabilidade Imediata */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>Oportunidades & Decisão de Participação</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cruze dados de edital, cotações, margens e documentação com um clique.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('licitacoes')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-1"
          >
            <span>Ver todas as licitações</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Licitação / Órgão</th>
                <th className="py-3 px-4">Modalidade & Abertura</th>
                <th className="py-3 px-4 text-right">Valor Estimado</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Viabilidade Comercial</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {licitacoes.slice(0, 5).map((lic) => {
                const viabilidade = analisarViabilidadeLicitacao(lic, documentos);

                let statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    🔵 Em análise
                  </span>
                );

                if (lic.status === 'preparacao') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      🟡 Preparação
                    </span>
                  );
                } else if (lic.status === 'participando') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      🟢 Participando
                    </span>
                  );
                } else if (lic.status === 'vencida') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      🏆 Vencida
                    </span>
                  );
                } else if (lic.status === 'perdida') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      🔴 Perdida
                    </span>
                  );
                }

                return (
                  <tr key={lic.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{lic.numero}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-xs">{lic.orgao}</div>
                      <div className="text-slate-400 text-[10px] truncate max-w-xs">{lic.objeto}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{lic.modalidade}</div>
                      <div className="text-slate-500 text-[11px] flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {formatarData(lic.dataAbertura)} às {lic.horario}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatarMoeda(lic.valorEstimado)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {statusBadge}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onOpenViabilidade(lic.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${viabilidade.badgeBg} ${viabilidade.badgeBorder} hover:opacity-90`}
                      >
                        <span>{viabilidade.rotulo}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedLicitacaoId(lic.id);
                          setActiveTab('licitacoes');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 font-semibold transition text-xs"
                      >
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid Inferior: Alertas Críticos de Documentos & Resumo de Fornecedores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Alertas de Vencimento de Documentos */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Controle de Validade de Certidões
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('documentos')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Cofre Completo ({documentos.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {documentos
              .filter((d) => ['vencido', 'alerta_7', 'alerta_30'].includes(d.status))
              .slice(0, 4)
              .map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    {doc.status === 'vencido' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    ) : doc.status === 'alerta_7' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 animate-pulse" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{doc.nome}</div>
                      <div className="text-[11px] text-slate-500">{doc.orgaoEmissor} • Nº {doc.numero}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      Validade: {formatarData(doc.validade)}
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        doc.status === 'vencido'
                          ? 'text-rose-600 dark:text-rose-400'
                          : doc.status === 'alerta_7'
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {doc.status === 'vencido'
                        ? '🔴 VENCIDO'
                        : doc.status === 'alerta_7'
                        ? '🟠 VENCE EM ATÉ 7 DIAS'
                        : '🟡 VENCE EM ATÉ 30 DIAS'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Cotações Recentes de Fornecedores */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Cotações Recentes de Fornecedores
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('cotacoes')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Todas as Cotações
            </button>
          </div>

          <div className="space-y-2.5">
            {cotacoes.slice(0, 4).map((cot) => {
              const fornecedor = fornecedores.find((f) => f.id === cot.fornecedorId);
              const produto = produtos.find((p) => p.id === cot.produtoId);

              return (
                <div
                  key={cot.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {cot.numero} — {produto?.nome || 'Produto'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {fornecedor?.nomeFantasia || 'Fornecedor'} • Condição: {cot.condicaoPagamento}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {formatarMoeda(cot.valorUnitario)} / un
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Validade: {formatarData(cot.validadeCotacao)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
