import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Download,
  Building2,
  FileText,
  DollarSign,
  PieChart,
  Percent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatarData, formatarMoeda, formatarPct } from '../utils/pricing';

export const RelatoriosView: React.FC = () => {
  const { licitacoes, documentos, produtos, fornecedores, cotacoes, historicoPrecos } =
    useApp();

  const [relatorioTipo, setRelatorioTipo] = useState<'viabilidade' | 'fornecedores' | 'vencimentos' | 'licitacoes'>('viabilidade');

  // Cálculos consolidados
  const totalLicitacoes = licitacoes.length;
  const ganhas = licitacoes.filter((l) => l.status === 'vencida').length;
  const perdidas = licitacoes.filter((l) => l.status === 'perdida').length;
  const emAndamento = licitacoes.filter((l) =>
    ['analise', 'preparacao', 'participando', 'disputa'].includes(l.status)
  ).length;

  const winRate = ganhas + perdidas > 0 ? (ganhas / (ganhas + perdidas)) * 100 : 100;

  const valorTotalDisputa = licitacoes
    .filter((l) => ['analise', 'preparacao', 'participando', 'disputa'].includes(l.status))
    .reduce((acc, l) => acc + (l.valorEstimado || 0), 0);

  const valorTotalGanho = licitacoes
    .filter((l) => l.status === 'vencida')
    .reduce((acc, l) => acc + (l.valorEstimado || 0), 0);

  const exportarCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Numero,Orgao,Modalidade,Status,ValorEstimado,DataAbertura\n' +
      licitacoes
        .map(
          (l) =>
            `"${l.numero}","${l.orgao}","${l.modalidade}","${l.status}",${l.valorEstimado},"${l.dataAbertura}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `davenzatec_licitacoes_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Inteligência Comercial & Decisão
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-orange-500" />
            <span>Relatórios & Análise de Resultados</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Métricas de desempenho em certames, taxas de conversão, auditoria de fornecedores e controle gerencial.
          </p>
        </div>

        <button
          onClick={exportarCSV}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Dados (CSV)</span>
        </button>
      </div>

      {/* Cartões Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Taxa de Sucesso (Win Rate)</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {formatarPct(winRate)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {ganhas} certames homologados vs {perdidas} perdidos
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Volume Homologado (Ganhos)</div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {formatarMoeda(valorTotalGanho)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Contratos públicos vigentes
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Pipeline em Disputa</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
            {formatarMoeda(valorTotalDisputa)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {emAndamento} certames em análise e andamento
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Cofre de Documentos</div>
          <div className="text-3xl font-black text-amber-500 mt-2">
            {documentos.filter((d) => d.status === 'valido').length} / {documentos.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Certidões com 100% de regularidade
          </div>
        </div>
      </div>

      {/* Seletor de Tipo de Relatório */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-bold max-w-2xl">
        <button
          onClick={() => setRelatorioTipo('viabilidade')}
          className={`flex-1 py-2 rounded-lg transition ${
            relatorioTipo === 'viabilidade'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Margem & Viabilidade
        </button>
        <button
          onClick={() => setRelatorioTipo('fornecedores')}
          className={`flex-1 py-2 rounded-lg transition ${
            relatorioTipo === 'fornecedores'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Fornecedores Competitivos
        </button>
        <button
          onClick={() => setRelatorioTipo('vencimentos')}
          className={`flex-1 py-2 rounded-lg transition ${
            relatorioTipo === 'vencimentos'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Alerta de Validades
        </button>
        <button
          onClick={() => setRelatorioTipo('licitacoes')}
          className={`flex-1 py-2 rounded-lg transition ${
            relatorioTipo === 'licitacoes'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Histórico de Licitações
        </button>
      </div>

      {/* Conteúdo do Relatório Selecionado */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        {relatorioTipo === 'viabilidade' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Análise Consolidada de Rentabilidade por Certame
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Licitação</th>
                    <th className="py-2.5 px-3">Órgão</th>
                    <th className="py-2.5 px-3 text-right">Teto Órgão</th>
                    <th className="py-2.5 px-3 text-right">Preço Proposto</th>
                    <th className="py-2.5 px-3 text-right">Margem Média</th>
                    <th className="py-2.5 px-3 text-right">Lucro Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {licitacoes.map((lic) => {
                    const totalProposto = (lic.itens || []).reduce(
                      (acc, it) => acc + it.precoProposto * it.quantidade,
                      0
                    );
                    const totalLucro = (lic.itens || []).reduce(
                      (acc, it) => acc + (it.lucroEstimadoTotal || 0),
                      0
                    );
                    const margemMedia =
                      (lic.itens || []).length > 0
                        ? (lic.itens || []).reduce(
                            (acc, it) => acc + it.margemCalculadaPct,
                            0
                          ) / (lic.itens || []).length
                        : 0;

                    return (
                      <tr key={lic.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {lic.numero}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                          {lic.orgao}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {formatarMoeda(lic.valorEstimado)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600">
                          {formatarMoeda(totalProposto)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                          {formatarPct(margemMedia)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                          {formatarMoeda(totalLucro)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {relatorioTipo === 'fornecedores' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Avaliação de Desempenho e Cotações dos Fornecedores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fornecedores.map((forn) => {
                const cotacoesForn = cotacoes.filter((c) => c.fornecedorId === forn.id);
                return (
                  <div
                    key={forn.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {forn.nomeFantasia}
                        </div>
                        <div className="text-[11px] text-slate-500">{forn.categoria}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {cotacoesForn.length} cotações
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      <div>Condição: {forn.condicaoPagamentoPadrao}</div>
                      <div>Prazo Médio: {forn.prazoEntregaDias} dias úteis</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {relatorioTipo === 'vencimentos' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Cronograma de Vencimento de Habilitação Jurídica e Fiscal
            </h3>
            <div className="space-y-2">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{doc.nome}</div>
                    <div className="text-[11px] text-slate-500">{doc.orgaoEmissor} • {doc.numero}</div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="font-bold">{formatarData(doc.validade)}</div>
                    <div
                      className={`text-[10px] font-bold ${
                        doc.status === 'vencido'
                          ? 'text-rose-600'
                          : doc.status === 'alerta_7'
                          ? 'text-orange-600'
                          : doc.status === 'alerta_30'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {doc.status === 'vencido'
                        ? 'VENCIDO'
                        : `${doc.diasParaVencer} dias restantes`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatorioTipo === 'licitacoes' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Relação Geral de Oportunidades Registradas
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">Número</th>
                    <th className="p-2.5">Órgão</th>
                    <th className="p-2.5">Modalidade</th>
                    <th className="p-2.5">Data Abertura</th>
                    <th className="p-2.5 text-right">Valor Estimado</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {licitacoes.map((l) => (
                    <tr key={l.id}>
                      <td className="p-2.5 font-mono font-bold">{l.numero}</td>
                      <td className="p-2.5">{l.orgao}</td>
                      <td className="p-2.5">{l.modalidade}</td>
                      <td className="p-2.5">{formatarData(l.dataAbertura)}</td>
                      <td className="p-2.5 text-right font-mono font-bold">{formatarMoeda(l.valorEstimado)}</td>
                      <td className="p-2.5 text-center font-bold capitalize">{l.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
