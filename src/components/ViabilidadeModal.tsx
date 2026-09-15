import React from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck2,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  analisarViabilidadeLicitacao,
  formatarData,
  formatarMoeda,
  formatarPct,
} from '../utils/pricing';

interface ViabilidadeModalProps {
  licitacaoId: string;
  onClose: () => void;
  onOpenProposta: (licitacaoId: string) => void;
}

export const ViabilidadeModal: React.FC<ViabilidadeModalProps> = ({
  licitacaoId,
  onClose,
  onOpenProposta,
}) => {
  const { licitacoes, documentos } = useApp();
  const licitacao = licitacoes.find((l) => l.id === licitacaoId);

  if (!licitacao) return null;

  const resultado = analisarViabilidadeLicitacao(licitacao, documentos);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabeçalho do Modal */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Análise de Viabilidade Comercial & Jurídica
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {licitacao.numero}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Decisão Estratégica Central (Seção 30 do Prompt) */}
          <div
            className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
              resultado.decisao === 'FAVORAVEL'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                : resultado.decisao === 'ATENCAO'
                ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-400 dark:border-rose-700 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div>
              <div className="text-xs font-bold tracking-wider uppercase opacity-80">
                Parecer de Decisão Comercial
              </div>
              <div className="text-2xl font-black mt-1 flex items-center space-x-2">
                {resultado.decisao === 'FAVORAVEL' ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : resultado.decisao === 'ATENCAO' ? (
                  <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span>{resultado.rotulo}</span>
              </div>
              <p className="text-xs mt-1 max-w-xl opacity-90 leading-relaxed">
                {resultado.decisao === 'FAVORAVEL'
                  ? 'O certame apresenta margem atrativa, compatibilidade com o valor de referência do órgão e documentação 100% regular.'
                  : resultado.decisao === 'ATENCAO'
                  ? 'A oportunidade possui margem aceitável, porém requer atenção em prazos, renovação de certidões ou negociação com distribuidores.'
                  : 'A DavenzaTec não deve participar ou precisa renegociar custos: preço mínimo excede edital, margem é deficitária ou há impeditivo de habilitação.'}
              </p>
            </div>

            <div className="text-right shrink-0 bg-white/70 dark:bg-slate-900/60 p-3.5 rounded-xl border border-black/5 dark:border-white/5">
              <div className="text-xs text-slate-500">Margem Projetada</div>
              <div className="text-2xl font-black">{formatarPct(resultado.margemMediaPct)}</div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                + {formatarMoeda(resultado.lucroEstimadoTotal)} lucro líquido
              </div>
            </div>
          </div>

          {/* Comparativo Financeiro */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Cruzamento Econômico-Financeiro
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-medium block">Valor Estimado do Órgão</span>
                <span className="text-base font-bold text-slate-900 dark:text-white block mt-1">
                  {formatarMoeda(resultado.valorEstimadoOrgao)}
                </span>
                <span className="text-[10px] text-slate-400">Teto orçamentário do edital</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-medium block">Custo Total DavenzaTec</span>
                <span className="text-base font-bold text-slate-700 dark:text-slate-300 block mt-1">
                  {formatarMoeda(resultado.custoTotalDavenza)}
                </span>
                <span className="text-[10px] text-slate-400">Fornecedores + fretes + taxas</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-medium block">Preço Mínimo de Lance</span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400 block mt-1">
                  {formatarMoeda(resultado.precoMinimoTotal)}
                </span>
                <span className="text-[10px] text-slate-400">Limite com margem mínima</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-medium block">Preço Proposto Final</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400 block mt-1">
                  {formatarMoeda(resultado.precoPropostoTotal)}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {resultado.diferencaParaEstimado >= 0
                    ? `R$ ${resultado.diferencaParaEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} abaixo do teto`
                    : 'Acima do teto do órgão'}
                </span>
              </div>
            </div>
          </div>

          {/* Análise de Documentação de Habilitação */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {resultado.capacidadeDocumentalOk ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                )}
                <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Auditoria de Capacidade Documental para Habilitação
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  resultado.capacidadeDocumentalOk
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                }`}
              >
                {resultado.capacidadeDocumentalOk ? 'Habilitada' : 'Pendências'}
              </span>
            </div>

            {resultado.documentosCriticos.length > 0 ? (
              <div className="mt-2 space-y-1">
                <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  Certidões com atenção imediata para a data de abertura ({formatarData(licitacao.dataAbertura)}):
                </div>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                  {resultado.documentosCriticos.map((docInfo, idx) => (
                    <li key={idx}>{docInfo}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Todas as certidões fiscais, trabalhistas, societárias e atestados técnicos exigidos estão plenamente válidos para a abertura em {formatarData(licitacao.dataAbertura)}.
              </p>
            )}
          </div>

          {/* Pontos Fortes e Fatores de Atenção */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pontos Fortes & Vantagens</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-300">
                {resultado.pontosFortes.map((ponto, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="font-bold">•</span>
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
              <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Alertas & Riscos Comerciais</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-300">
                {resultado.alertas.length > 0 ? (
                  resultado.alertas.map((alerta, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="font-bold">•</span>
                      <span>{alerta}</span>
                    </li>
                  ))
                ) : (
                  <li>Nenhum risco relevante identificado.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Itens e Custo por Item */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
              Composição de Itens da Oportunidade ({licitacao.itens?.length || 0} itens)
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3">Produto / Especificação</th>
                    <th className="py-2.5 px-3 text-center">Qtd</th>
                    <th className="py-2.5 px-3 text-right">Custo Un.</th>
                    <th className="py-2.5 px-3 text-right">Preço Mínimo</th>
                    <th className="py-2.5 px-3 text-right">Preço Proposto</th>
                    <th className="py-2.5 px-3 text-right">Margem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {(licitacao.itens || []).map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 font-mono font-bold">#{item.numeroItem}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{item.produtoNome}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{item.descricao}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium">
                        {item.quantidade} {item.unidade}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatarMoeda(item.custoUnitario + item.freteTaxasUnitario)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-600 dark:text-amber-400">
                        {formatarMoeda(item.precoMinimo)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                        {formatarMoeda(item.precoProposto)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatarPct(item.margemCalculadaPct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Órgão: <span className="font-semibold text-slate-700 dark:text-slate-300">{licitacao.orgao}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenProposta(licitacao.id);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Gerar Proposta Comercial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
