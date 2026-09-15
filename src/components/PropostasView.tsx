import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  FileText,
  Copy,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatarData, formatarMoeda, CURRENT_DATE_STR } from '../utils/pricing';

interface PropostasViewProps {
  initialLicitacaoId?: string | null;
}

export const PropostasView: React.FC<PropostasViewProps> = ({ initialLicitacaoId }) => {
  const { licitacoes, parametros, usuarioAtivo } = useApp();

  const [selectedLicitacaoId, setSelectedLicitacaoId] = useState<string>(
    initialLicitacaoId || licitacoes[0]?.id || ''
  );
  const [validadePropostaDias, setValidadePropostaDias] = useState<number>(60);
  const [prazoGarantiaMeses, setPrazoGarantiaMeses] = useState<number>(12);
  const [prazoEntregaDias, setPrazoEntregaDias] = useState<number>(15);
  const [copied, setCopied] = useState(false);

  const licitacao = licitacoes.find((l) => l.id === selectedLicitacaoId) || licitacoes[0];

  const itens = licitacao?.itens || [];
  const totalProposta = itens.reduce((acc, it) => acc + it.precoProposto * it.quantidade, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const lines = [
      `PROPOSTA COMERCIAL — DAVENZATEC TECNOLOGIA LTDA.`,
      `Licitação: ${licitacao?.numero}`,
      `Órgão: ${licitacao?.orgao}`,
      `Objeto: ${licitacao?.objeto}`,
      `Valor Total Proposto: ${formatarMoeda(totalProposta)}`,
      `Validade da Proposta: ${validadePropostaDias} dias`,
      `Prazo de Entrega: ${prazoEntregaDias} dias úteis`,
      `Garantia: ${prazoGarantiaMeses} meses`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Topo / Barra de Configurações da Proposta (Não impressa) */}
      <div className="print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Documentos Comerciais Oficiais
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <FileCheck2 className="w-6 h-6 text-teal-600" />
              <span>Gerador de Propostas Comerciais</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Gere propostas formais e estruturadas em conformidade com a Lei de Licitações (Lei 14.133/21).
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center space-x-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copiado!' : 'Copiar Resumo'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>

        {/* Seleção do Certame & Ajustes */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Selecione a Licitação Vinculada:
            </label>
            <select
              value={selectedLicitacaoId}
              onChange={(e) => setSelectedLicitacaoId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            >
              {licitacoes.map((lic) => (
                <option key={lic.id} value={lic.id}>
                  {lic.numero} — {lic.orgao} ({formatarMoeda(lic.valorEstimado)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Validade da Proposta
            </label>
            <input
              type="number"
              min="1"
              value={validadePropostaDias}
              onChange={(e) => setValidadePropostaDias(parseInt(e.target.value) || 60)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Prazo de Entrega (dias úteis)
            </label>
            <input
              type="number"
              min="1"
              value={prazoEntregaDias}
              onChange={(e) => setPrazoEntregaDias(parseInt(e.target.value) || 15)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* DOCUMENTO DA PROPOSTA COMERCIAL (Estilizado como papel A4 oficial) */}
      <div className="bg-white text-slate-900 max-w-4xl mx-auto p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 text-xs leading-relaxed">
        {/* Cabeçalho da Empresa */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-xl">
              DT
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                {parametros.empresaRazaoSocial}
              </h2>
              <div className="text-[11px] text-slate-600 font-medium">
                {parametros.empresaNomeFantasia} • Soluções em Tecnologia & Gestão
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                CNPJ: {parametros.empresaCnpj} • I.E.: 123.456.789.110
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-600">
            <div>{parametros.empresaEndereco}</div>
            <div>São Paulo/SP — CEP: 01310-100</div>
            <div className="font-semibold text-slate-800">{parametros.empresaEmail}</div>
            <div>(11) 3456-7890 • www.davenzatec.com.br</div>
          </div>
        </div>

        {/* Título & Destinatário */}
        <div className="my-6 space-y-4">
          <div className="text-center py-2 bg-slate-100 rounded-lg font-bold uppercase tracking-wider text-xs border border-slate-300">
            PROPOSTA COMERCIAL DE PREÇOS
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Órgão Licitante / Cliente:</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">{licitacao?.orgao}</span>
              {licitacao?.cnpjOrgao && (
                <span className="text-[11px] text-slate-600 block">CNPJ: {licitacao.cnpjOrgao}</span>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Identificação do Certame:</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5 font-mono">{licitacao?.numero}</span>
              <span className="text-[11px] text-slate-600 block">
                {licitacao?.modalidade} • Processo: {licitacao?.processo || 'N/A'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Objeto:</span>
            <p className="text-xs text-slate-800 mt-1 text-justify">{licitacao?.objeto}</p>
          </div>
        </div>

        {/* Tabela Detalhada de Itens Propostos */}
        <div className="my-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2">
            Planilha de Preços e Especificação Técnica dos Itens
          </h3>

          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 text-center border-r border-slate-300">Item</th>
                  <th className="p-2.5 border-r border-slate-300">Especificação Detalhada / Marca</th>
                  <th className="p-2.5 text-center border-r border-slate-300">Qtd</th>
                  <th className="p-2.5 text-center border-r border-slate-300">Unidade</th>
                  <th className="p-2.5 text-right border-r border-slate-300">Preço Unitário (R$)</th>
                  <th className="p-2.5 text-right">Preço Total (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {itens.map((it) => (
                  <tr key={it.id}>
                    <td className="p-2.5 text-center font-bold font-mono border-r border-slate-200">
                      {it.numeroItem}
                    </td>
                    <td className="p-2.5 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{it.produtoNome}</div>
                      <div className="text-[11px] text-slate-600">{it.descricao}</div>
                    </td>
                    <td className="p-2.5 text-center font-semibold border-r border-slate-200">
                      {it.quantidade}
                    </td>
                    <td className="p-2.5 text-center text-slate-600 border-r border-slate-200">
                      {it.unidade}
                    </td>
                    <td className="p-2.5 text-right font-mono border-r border-slate-200">
                      {formatarMoeda(it.precoProposto)}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      {formatarMoeda(it.precoProposto * it.quantidade)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-xs">
                <tr>
                  <td colSpan={5} className="p-3 text-right uppercase tracking-wider text-slate-700">
                    VALOR TOTAL GLOBAL DA PROPOSTA:
                  </td>
                  <td className="p-3 text-right font-mono text-sm text-blue-900 font-black">
                    {formatarMoeda(totalProposta)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Condições Comerciais & Prazos */}
        <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px]">
          <h4 className="font-bold uppercase tracking-wider text-slate-800 text-xs">
            Condições Gerais de Fornecimento
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
            <div>
              <span className="font-semibold">Validade da Proposta:</span> {validadePropostaDias} (sessenta) dias a contar da abertura.
            </div>
            <div>
              <span className="font-semibold">Prazo de Entrega / Início:</span> Em até {prazoEntregaDias} dias úteis após a emissão da Ordem de Fornecimento.
            </div>
            <div>
              <span className="font-semibold">Garantia / Suporte Técnico:</span> {prazoGarantiaMeses} meses com atendimento direto da DavenzaTec.
            </div>
            <div>
              <span className="font-semibold">Condição de Pagamento:</span> Conforme edital, mediante liquidação e nota fiscal em até 30 dias.
            </div>
          </div>
        </div>

        {/* Declarações Oficiais da Lei 14.133/2021 */}
        <div className="my-6 space-y-2 text-[10px] text-slate-600 text-justify leading-relaxed">
          <p>
            <strong>DECLARAÇÕES FORMAIS:</strong> A proponente declara, sob as penas da lei, que nos preços propostos estão inclusos todos os tributos federais, estaduais e municipais, encargos sociais, trabalhistas e previdenciários, frete, seguro, transporte e quaisquer outras despesas diretas ou indiretas necessárias à integral execução do objeto.
          </p>
          <p>
            Declara ainda o pleno atendimento às normas de proteção ao trabalho do menor (art. 7º, XXXIII, da CF/88), inexistência de fatos impeditivos de habilitação perante a Administração Pública e conformidade irrestrita com todas as exigências do edital convocatório.
          </p>
        </div>

        {/* Dados Bancários */}
        <div className="my-6 p-3 bg-slate-100 rounded-lg text-[11px] font-mono flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-slate-300">
          <div>
            <span className="font-bold">Dados Bancários para Pagamento:</span> Banco do Brasil (001) • Ag: 1234-5 • C/C: 98765-4
          </div>
          <div className="font-bold text-slate-800">
            Chave Pix: {parametros.empresaCnpj}
          </div>
        </div>

        {/* Data & Assinatura */}
        <div className="mt-12 pt-6 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6">
          <div className="text-xs text-slate-600">
            <div>São Paulo/SP, {formatarData(CURRENT_DATE_STR)}.</div>
          </div>

          <div className="text-center">
            <div className="w-64 border-b border-slate-400 mx-auto mb-1.5" />
            <div className="font-bold text-xs text-slate-900">{usuarioAtivo.nome}</div>
            <div className="text-[10px] text-slate-500 uppercase">{usuarioAtivo.cargo} • DavenzaTec Tecnologia</div>
          </div>
        </div>
      </div>
    </div>
  );
};
