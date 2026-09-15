import React, { useState } from 'react';
import { X, Save, MessageSquareQuote } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Cotacao, CotacaoStatus } from '../types';
import { CURRENT_DATE_STR, formatarMoeda } from '../utils/pricing';

interface CotacaoModalProps {
  cotacaoParaEditar?: Cotacao | null;
  onClose: () => void;
}

export const CotacaoModal: React.FC<CotacaoModalProps> = ({
  cotacaoParaEditar,
  onClose,
}) => {
  const { fornecedores, produtos, licitacoes, usuarioAtivo, addCotacao, updateCotacao } =
    useApp();

  const [numero, setNumero] = useState(
    cotacaoParaEditar?.numero || `COT-${Date.now().toString().slice(-4)}/2026`
  );
  const [fornecedorId, setFornecedorId] = useState(
    cotacaoParaEditar?.fornecedorId || fornecedores[0]?.id || ''
  );
  const [produtoId, setProdutoId] = useState(
    cotacaoParaEditar?.produtoId || produtos[0]?.id || ''
  );
  const [licitacaoId, setLicitacaoId] = useState(cotacaoParaEditar?.licitacaoId || '');
  const [valorUnitario, setValorUnitario] = useState<number>(
    cotacaoParaEditar?.valorUnitario || produtos[0]?.custoAtual || 100
  );
  const [quantidade, setQuantidade] = useState<number>(cotacaoParaEditar?.quantidade || 1);
  const [frete, setFrete] = useState<number>(cotacaoParaEditar?.frete || 0);
  const [taxas, setTaxas] = useState<number>(cotacaoParaEditar?.taxas || 0);
  const [condicaoPagamento, setCondicaoPagamento] = useState(
    cotacaoParaEditar?.condicaoPagamento || '28 DDL'
  );
  const [prazoEntregaDias, setPrazoEntregaDias] = useState<number>(
    cotacaoParaEditar?.prazoEntregaDias || 5
  );
  const [dataCotacao, setDataCotacao] = useState(
    cotacaoParaEditar?.dataCotacao || CURRENT_DATE_STR
  );
  const [validadeCotacao, setValidadeCotacao] = useState(
    cotacaoParaEditar?.validadeCotacao || '2026-10-15'
  );
  const [status, setStatus] = useState<CotacaoStatus>(cotacaoParaEditar?.status || 'vigente');
  const [responsavel, setResponsavel] = useState(
    cotacaoParaEditar?.responsavel || usuarioAtivo.nome
  );
  const [observacoes, setObservacoes] = useState(cotacaoParaEditar?.observacoes || '');

  const handleProdutoChange = (prodId: string) => {
    setProdutoId(prodId);
    const p = produtos.find((x) => x.id === prodId);
    if (p) {
      setValorUnitario(p.custoAtual);
      if (p.fornecedorPrincipalId) {
        setFornecedorId(p.fornecedorPrincipalId);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dados = {
      numero,
      fornecedorId,
      produtoId,
      licitacaoId: licitacaoId || undefined,
      valorUnitario,
      quantidade,
      frete,
      taxas,
      condicaoPagamento,
      prazoEntregaDias,
      dataCotacao,
      validadeCotacao,
      responsavel,
      status,
      observacoes,
    };

    if (cotacaoParaEditar) {
      updateCotacao({ ...dados, id: cotacaoParaEditar.id });
    } else {
      addCotacao(dados);
    }
    onClose();
  };

  const totalGeral = valorUnitario * quantidade + frete + taxas;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <MessageSquareQuote className="w-5 h-5 text-violet-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {cotacaoParaEditar ? 'Editar Cotação' : 'Registrar Nova Cotação de Fornecedor'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número da Cotação *
              </label>
              <input
                type="text"
                required
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fornecedor / Distribuidor *
              </label>
              <select
                value={fornecedorId}
                onChange={(e) => setFornecedorId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                {fornecedores.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nomeFantasia} ({f.categoria})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Produto ou Serviço Cotado *
              </label>
              <select
                value={produtoId}
                onChange={(e) => handleProdutoChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.marca})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vincular a Licitação (Opcional)
              </label>
              <select
                value={licitacaoId}
                onChange={(e) => setLicitacaoId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Nenhuma (Cotação Geral de Catálogo)</option>
                {licitacoes.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.numero} — {l.orgao}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preço Unitário (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={valorUnitario}
                onChange={(e) => setValorUnitario(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Frete Total (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={frete}
                onChange={(e) => setFrete(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Taxas / Difal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={taxas}
                onChange={(e) => setTaxas(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Condição de Pagto
              </label>
              <input
                type="text"
                value={condicaoPagamento}
                onChange={(e) => setCondicaoPagamento(e.target.value)}
                placeholder="Ex: 28 DDL"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data da Cotação
              </label>
              <input
                type="date"
                value={dataCotacao}
                onChange={(e) => setDataCotacao(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Validade da Cotação *
              </label>
              <input
                type="date"
                required
                value={validadeCotacao}
                onChange={(e) => setValidadeCotacao(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status da Cotação
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CotacaoStatus)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="vigente">🟢 Vigente</option>
                <option value="aprovada">✅ Aprovada / Utilizada</option>
                <option value="vencida">🔴 Vencida</option>
                <option value="rejeitada">❌ Rejeitada</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prazo de Entrega (dias úteis)
              </label>
              <input
                type="number"
                min="0"
                value={prazoEntregaDias}
                onChange={(e) => setPrazoEntregaDias(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-800/70 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Valor Total da Cotação:
            </span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono">
              {formatarMoeda(totalGeral)}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow transition flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{cotacaoParaEditar ? 'Salvar Cotação' : 'Registrar Cotação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
