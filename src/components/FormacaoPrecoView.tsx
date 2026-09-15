import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Percent,
  DollarSign,
  TrendingUp,
  History,
  Save,
  Plus,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Building2,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  calcularCustoBase,
  calcularPrecoMinimo,
  formatarData,
  formatarMoeda,
  formatarPct,
  simularPrecoVenda,
  CURRENT_DATE_STR,
} from '../utils/pricing';

export const FormacaoPrecoView: React.FC = () => {
  const {
    produtos,
    fornecedores,
    cotacoes,
    historicoPrecos,
    addHistoricoPreco,
    parametros,
    usuarioAtivo,
  } = useApp();

  // Estados de Entrada (Dados de Entrada Seção 10)
  const [selectedProdutoId, setSelectedProdutoId] = useState<string>(produtos[0]?.id || '');
  const [customNome, setCustomNome] = useState<string>('');
  const [selectedFornecedorId, setSelectedFornecedorId] = useState<string>(
    fornecedores[0]?.id || ''
  );

  const [custoFornecedor, setCustoFornecedor] = useState<number>(produtos[0]?.custoAtual || 100);
  const [frete, setFrete] = useState<number>(0);
  const [taxas, setTaxas] = useState<number>(0);

  const [impostosPct, setImpostosPct] = useState<number>(parametros.impostosPadraoPct);
  const [despesasPct, setDespesasPct] = useState<number>(parametros.despesasPadraoPct);
  const [riscoPct, setRiscoPct] = useState<number>(parametros.riscoPadraoPct);
  const [margemMinimaPct, setMargemMinimaPct] = useState<number>(parametros.margemMinimaPadraoPct);
  const [margemDesejadaPct, setMargemDesejadaPct] = useState<number>(
    parametros.margemDesejadaPadraoPct
  );
  const [prazoPagamento, setPrazoPagamento] = useState<string>('30 dias');
  const [validadeCotacao, setValidadeCotacao] = useState<string>('2026-10-15');

  // Preço Proposto para o Simulador (Seção 12)
  const [precoProposto, setPrecoProposto] = useState<number>(150);

  // Mensagem de sucesso
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Quando troca o produto, auto-preenche custos e fornecedor
  useEffect(() => {
    const prod = produtos.find((p) => p.id === selectedProdutoId);
    if (prod) {
      setCustoFornecedor(prod.custoAtual);
      setSelectedFornecedorId(prod.fornecedorPrincipalId);
      setCustomNome(prod.nome);

      // Checa se há cotação vigente para este produto
      const cotVigente = cotacoes.find(
        (c) => c.produtoId === prod.id && c.status === 'vigente'
      );
      if (cotVigente) {
        setCustoFornecedor(cotVigente.valorUnitario);
        setFrete(cotVigente.frete);
        setTaxas(cotVigente.taxas);
        setSelectedFornecedorId(cotVigente.fornecedorId);
        setValidadeCotacao(cotVigente.validadeCotacao);
        setPrazoPagamento(cotVigente.condicaoPagamento);
      }

      // Calcula preço sugerido inicial
      const base = calcularCustoBase(prod.custoAtual, 0, 0);
      const min = calcularPrecoMinimo(
        base,
        impostosPct,
        despesasPct,
        riscoPct,
        margemDesejadaPct
      );
      setPrecoProposto(prod.precoSugerido || min * 1.05);
    }
  }, [selectedProdutoId]);

  // Cálculos dinâmicos
  const custoBase = calcularCustoBase(custoFornecedor, frete, taxas);
  const precoMinimo = calcularPrecoMinimo(
    custoBase,
    impostosPct,
    despesasPct,
    riscoPct,
    margemDesejadaPct
  );

  const simulacao = simularPrecoVenda(
    custoBase,
    precoProposto,
    impostosPct,
    despesasPct,
    riscoPct,
    margemMinimaPct,
    margemDesejadaPct
  );

  const produtoSelecionado = produtos.find((p) => p.id === selectedProdutoId);
  const fornecedorSelecionado = fornecedores.find((f) => f.id === selectedFornecedorId);

  const handleSalvarNoHistorico = () => {
    addHistoricoPreco({
      data: CURRENT_DATE_STR,
      produtoId: selectedProdutoId || 'custom',
      produtoNome: customNome || produtoSelecionado?.nome || 'Item Customizado',
      fornecedorId: selectedFornecedorId || 'forn-1',
      fornecedorNome: fornecedorSelecionado?.nomeFantasia || 'Fornecedor',
      custo: custoBase,
      venda: precoProposto,
      margemPct: simulacao.margemEfetivaPct,
      observacao: `Formação simulada com ${impostosPct}% impostos, R$ ${simulacao.lucroEstimadoReais} de lucro.`,
    });

    setSavedSuccess('Formação de preço gravada com sucesso no histórico!');
    setTimeout(() => setSavedSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Módulo Financeiro & Comercial
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-emerald-600" />
            <span>Formação de Preços & Simulador de Margem</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Determine o preço mínimo de viabilidade para licitações e simule o retorno líquido em tempo real.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedSuccess}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Parâmetros de Entrada (Col 1-6) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Card: Seleção de Produto & Fornecedor */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Package className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                1. Identificação do Produto & Fornecedor
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Selecionar Produto do Catálogo
                </label>
                <select
                  value={selectedProdutoId}
                  onChange={(e) => setSelectedProdutoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.marca}] {p.nome} — Custo Ref: {formatarMoeda(p.custoAtual)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fornecedor / Distribuidor
                  </label>
                  <select
                    value={selectedFornecedorId}
                    onChange={(e) => setSelectedFornecedorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {fornecedores.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nomeFantasia} ({f.categoria})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Condição / Prazo Pagto
                  </label>
                  <input
                    type="text"
                    value={prazoPagamento}
                    onChange={(e) => setPrazoPagamento(e.target.value)}
                    placeholder="Ex: 28 DDL"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Custos Diretos & Composição */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                2. Custos Diretos de Aquisição
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custo Fornecedor (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={custoFornecedor}
                    onChange={(e) => setCustoFornecedor(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Frete Unitário (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={frete}
                    onChange={(e) => setFrete(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Taxas / Outros (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={taxas}
                    onChange={(e) => setTaxas(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Total Custo Base */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Custo Base Unitário (Fornecedor + Frete + Taxas):
              </span>
              <span className="font-black text-slate-900 dark:text-white text-base font-mono">
                {formatarMoeda(custoBase)}
              </span>
            </div>
          </div>

          {/* Card: Parâmetros Tributários & Margem Desejada */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Percent className="w-4 h-4 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                3. Alíquotas Tributárias & Metas de Margem (%)
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Impostos (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="40"
                  value={impostosPct}
                  onChange={(e) => setImpostosPct(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Simples / ICMS / ISS</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Despesas/Comissão (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={despesasPct}
                  onChange={(e) => setDespesasPct(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Custos operacionais</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reserva / Risco (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={riscoPct}
                  onChange={(e) => setRiscoPct(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Inadimplência / Edital</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Margem Desejada (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="60"
                  value={margemDesejadaPct}
                  onChange={(e) => setMargemDesejadaPct(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Meta líquida de lucro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Direito: Preço Mínimo & Simulador Interativo em Tempo Real (Col 7-12) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Card: Cálculo do Preço Mínimo (Seção 11 do Prompt) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Preço Mínimo de Viabilidade (Piso)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                Fórmula: Divisor por Dentro
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {formatarMoeda(precoMinimo)}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Menor preço que a DavenzaTec pode praticar sem comprometer a margem de {formatarPct(margemDesejadaPct)}.
                </p>
              </div>
              <button
                onClick={() => setPrecoProposto(precoMinimo)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30 transition shrink-0"
              >
                Aplicar ao Simulador
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/80 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-400 block">Custo Base:</span>
                <span className="font-semibold text-white">{formatarMoeda(custoBase)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Deduções Totais:</span>
                <span className="font-semibold text-amber-400">
                  {impostosPct + despesasPct + riscoPct + margemDesejadaPct}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Lucro Mínimo:</span>
                <span className="font-semibold text-emerald-400">
                  {formatarMoeda(precoMinimo * (margemDesejadaPct / 100))}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Simulador de Preços & Margem Efetiva (Seção 12 & 13 do Prompt) */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                  Simulador Interativo de Preço Proposto
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Recalculo instantâneo</span>
            </div>

            {/* Input Preço Proposto */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Informe o Preço Proposto / Venda (R$):
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">R$</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={precoProposto}
                    onChange={(e) => setPrecoProposto(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-2 text-lg font-black text-slate-900 dark:text-white rounded-xl border border-blue-400 dark:border-blue-600 bg-slate-50 dark:bg-slate-800/80 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setPrecoProposto((prev) => Number((prev * 0.95).toFixed(2)))}
                    className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    title="-5%"
                  >
                    -5%
                  </button>
                  <button
                    onClick={() => setPrecoProposto((prev) => Number((prev * 1.05).toFixed(2)))}
                    className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    title="+5%"
                  >
                    +5%
                  </button>
                </div>
              </div>
            </div>

            {/* Indicador Visual de Margem (Seção 13 do Prompt) */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                simulacao.statusMargem === 'adequada'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : simulacao.statusMargem === 'acima_objetivo'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                  : simulacao.statusMargem === 'atencao'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}
            >
              <div>
                <div className="text-[11px] uppercase font-bold tracking-wider opacity-80">
                  Status da Margem
                </div>
                <div className="text-base font-black mt-0.5 flex items-center space-x-1.5">
                  {simulacao.statusMargem === 'adequada' && (
                    <span>🟢 DENTRO DA META</span>
                  )}
                  {simulacao.statusMargem === 'acima_objetivo' && (
                    <span>🔵 ACIMA DO OBJETIVO</span>
                  )}
                  {simulacao.statusMargem === 'atencao' && (
                    <span>🟠 MARGEM DE ATENÇÃO</span>
                  )}
                  {simulacao.statusMargem === 'abaixo_minimo' && (
                    <span>🔴 ABAIXO DO MÍNIMO</span>
                  )}
                </div>
                <div className="text-xs opacity-90 mt-0.5">
                  Mínima: {margemMinimaPct}% | Desejada: {margemDesejadaPct}%
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black">{formatarPct(simulacao.margemEfetivaPct)}</span>
                <span className="text-xs block opacity-80">Margem Efetiva</span>
              </div>
            </div>

            {/* Demonstração de Resultado da Venda */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-700">
                Demonstrativo por Unidade
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Preço Proposto (Faturamento Bruto):</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {formatarMoeda(precoProposto)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>(-) Custo Base Fornecedor:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  - {formatarMoeda(custoBase)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>(-) Impostos ({impostosPct}%):</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  - {formatarMoeda(simulacao.impostosReais)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>(-) Despesas Operacionais ({despesasPct}%):</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  - {formatarMoeda(simulacao.despesasReais)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>(-) Reserva de Risco ({riscoPct}%):</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  - {formatarMoeda(simulacao.riscoReais)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm">
                <span className="text-emerald-700 dark:text-emerald-400">(=) Lucro Líquido Estimado:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">
                  {formatarMoeda(simulacao.lucroEstimadoReais)}
                </span>
              </div>
            </div>

            {/* Botão de Salvar no Histórico */}
            <button
              onClick={handleSalvarNoHistorico}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Gravar no Histórico de Preços da DavenzaTec</span>
            </button>
          </div>
        </div>
      </div>

      {/* Histórico de Preços (Seção 17 do Prompt) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Histórico de Preços & Custos
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rastreabilidade de evolução de custos, cotações e margens praticadas pela empresa.
            </p>
          </div>

          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {historicoPrecos.length} registros armazenados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Produto / Descrição</th>
                <th className="py-3 px-4">Fornecedor</th>
                <th className="py-3 px-4 text-right">Custo Base</th>
                <th className="py-3 px-4 text-right">Preço Venda</th>
                <th className="py-3 px-4 text-right">Margem</th>
                <th className="py-3 px-4">Referência / Certame</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {historicoPrecos.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500">
                    {formatarData(item.data)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {item.produtoNome}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {item.fornecedorNome}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatarMoeda(item.custo)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatarMoeda(item.venda)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.margemPct >= 20
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : item.margemPct >= 15
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {formatarPct(item.margemPct)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {item.licitacaoNumero || item.observacao || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
