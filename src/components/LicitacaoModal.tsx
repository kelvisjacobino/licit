import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Package,
  Layers,
  DollarSign,
  Calculator,
  Save,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ItemLicitacao,
  Licitacao,
  LicitacaoModalidade,
  LicitacaoStatus,
} from '../types';
import {
  calcularCustoBase,
  calcularPrecoMinimo,
  formatarMoeda,
  formatarPct,
  simularPrecoVenda,
} from '../utils/pricing';

interface LicitacaoModalProps {
  licitacaoParaEditar?: Licitacao | null;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

export const LicitacaoModal: React.FC<LicitacaoModalProps> = ({
  licitacaoParaEditar,
  onClose,
  onSuccess,
}) => {
  const {
    produtos,
    fornecedores,
    documentos,
    parametros,
    usuarioAtivo,
    addLicitacao,
    updateLicitacao,
  } = useApp();

  // Dados Gerais
  const [numero, setNumero] = useState(licitacaoParaEditar?.numero || 'Pregão Eletrônico nº ');
  const [processo, setProcesso] = useState(licitacaoParaEditar?.processo || '');
  const [orgao, setOrgao] = useState(licitacaoParaEditar?.orgao || '');
  const [cnpjOrgao, setCnpjOrgao] = useState(licitacaoParaEditar?.cnpjOrgao || '');
  const [modalidade, setModalidade] = useState<LicitacaoModalidade>(
    licitacaoParaEditar?.modalidade || 'Pregão Eletrônico'
  );
  const [objeto, setObjeto] = useState(licitacaoParaEditar?.objeto || '');
  const [dataAbertura, setDataAbertura] = useState(
    licitacaoParaEditar?.dataAbertura || '2026-09-30'
  );
  const [horario, setHorario] = useState(licitacaoParaEditar?.horario || '10:00');
  const [portal, setPortal] = useState(
    licitacaoParaEditar?.portal || 'Comprasnet (Compras.gov.br)'
  );
  const [link, setLink] = useState(licitacaoParaEditar?.link || '');
  const [valorEstimado, setValorEstimado] = useState<number>(
    licitacaoParaEditar?.valorEstimado || 0
  );
  const [status, setStatus] = useState<LicitacaoStatus>(
    licitacaoParaEditar?.status || 'analise'
  );
  const [responsavel, setResponsavel] = useState(
    licitacaoParaEditar?.responsavel || usuarioAtivo.nome
  );
  const [observacoes, setObservacoes] = useState(licitacaoParaEditar?.observacoes || '');
  const [documentosExigidos, setDocumentosExigidos] = useState<string[]>(
    licitacaoParaEditar?.documentosExigidos || [
      'doc-1',
      'doc-2',
      'doc-4',
      'doc-5',
      'doc-6',
      'doc-7',
      'doc-9',
    ]
  );

  // Itens da Licitação
  const [itens, setItens] = useState<ItemLicitacao[]>(
    licitacaoParaEditar?.itens || []
  );

  // Estado para adicionar novo item
  const [itemProdutoId, setItemProdutoId] = useState<string>(produtos[0]?.id || '');
  const [itemDescricao, setItemDescricao] = useState<string>('');
  const [itemQuantidade, setItemQuantidade] = useState<number>(1);
  const [itemUnidade, setItemUnidade] = useState<string>('Licença');
  const [itemCusto, setItemCusto] = useState<number>(produtos[0]?.custoAtual || 100);
  const [itemFrete, setItemFrete] = useState<number>(0);
  const [itemMargemDesejada, setItemMargemDesejada] = useState<number>(
    parametros.margemDesejadaPadraoPct
  );
  const [itemPrecoProposto, setItemPrecoProposto] = useState<number>(150);

  // Atualiza custos quando muda o produto do novo item
  const handleNovoItemProdutoChange = (prodId: string) => {
    setItemProdutoId(prodId);
    const p = produtos.find((x) => x.id === prodId);
    if (p) {
      setItemDescricao(p.nome);
      setItemUnidade(p.unidade);
      setItemCusto(p.custoAtual);
      const min = calcularPrecoMinimo(
        p.custoAtual,
        parametros.impostosPadraoPct,
        parametros.despesasPadraoPct,
        parametros.riscoPadraoPct,
        parametros.margemDesejadaPadraoPct
      );
      setItemPrecoProposto(p.precoSugerido || min * 1.05);
    }
  };

  const handleAddItem = () => {
    const p = produtos.find((x) => x.id === itemProdutoId);
    const custoBase = calcularCustoBase(itemCusto, itemFrete, 0);
    const precoMin = calcularPrecoMinimo(
      custoBase,
      parametros.impostosPadraoPct,
      parametros.despesasPadraoPct,
      parametros.riscoPadraoPct,
      itemMargemDesejada
    );

    const sim = simularPrecoVenda(
      custoBase,
      itemPrecoProposto,
      parametros.impostosPadraoPct,
      parametros.despesasPadraoPct,
      parametros.riscoPadraoPct,
      parametros.margemMinimaPadraoPct,
      itemMargemDesejada
    );

    const novoItem: ItemLicitacao = {
      id: `item-${Date.now()}`,
      numeroItem: itens.length + 1,
      produtoId: itemProdutoId,
      produtoNome: p?.nome || itemDescricao || 'Item Personalizado',
      descricao: itemDescricao || p?.nome || '',
      quantidade: itemQuantidade,
      unidade: itemUnidade,
      fornecedorId: p?.fornecedorPrincipalId,
      custoUnitario: itemCusto,
      freteTaxasUnitario: itemFrete,
      impostosPct: parametros.impostosPadraoPct,
      despesasPct: parametros.despesasPadraoPct,
      riscoPct: parametros.riscoPadraoPct,
      margemDesejadaPct: itemMargemDesejada,
      precoMinimo: precoMin,
      precoProposto: itemPrecoProposto,
      margemCalculadaPct: sim.margemEfetivaPct,
      lucroEstimadoTotal: sim.lucroEstimadoReais * itemQuantidade,
      status: 'cotado',
    };

    setItens([...itens, novoItem]);
    // Resetar campos
    setItemQuantidade(1);
  };

  const handleRemoveItem = (id: string) => {
    setItens(itens.filter((it) => it.id !== id));
  };

  const toggleDocExigido = (docId: string) => {
    if (documentosExigidos.includes(docId)) {
      setDocumentosExigidos(documentosExigidos.filter((d) => d !== docId));
    } else {
      setDocumentosExigidos([...documentosExigidos, docId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dadosLicitacao = {
      numero,
      processo,
      orgao,
      cnpjOrgao,
      modalidade,
      objeto,
      dataAbertura,
      horario,
      portal,
      link,
      valorEstimado,
      status,
      responsavel,
      observacoes,
      itens,
      documentosExigidos,
    };

    if (licitacaoParaEditar) {
      updateLicitacao({ ...dadosLicitacao, id: licitacaoParaEditar.id });
      onSuccess(licitacaoParaEditar.id);
    } else {
      const novoId = addLicitacao(dadosLicitacao);
      onSuccess(novoId);
    }
    onClose();
  };

  const totalPrecoProposto = itens.reduce((acc, it) => acc + it.precoProposto * it.quantidade, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Topo do Modal */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {licitacaoParaEditar ? 'Editar Licitação' : 'Cadastrar Nova Licitação'}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {numero || 'Nova Oportunidade'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com abas internas ou scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Seção 1: Dados do Edital e Órgão */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
              1. Informações do Certame & Órgão Público
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número da Licitação *
                </label>
                <input
                  type="text"
                  required
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Ex: Pregão Eletrônico nº 020/2026"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Processo Administrativo
                </label>
                <input
                  type="text"
                  value={processo}
                  onChange={(e) => setProcesso(e.target.value)}
                  placeholder="Ex: Proc. 2026/8901-TRT"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Modalidade *
                </label>
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value as LicitacaoModalidade)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                  <option value="Dispensa de Licitação">Dispensa de Licitação</option>
                  <option value="Concorrência Pública">Concorrência Pública</option>
                  <option value="Inexigibilidade">Inexigibilidade</option>
                  <option value="Pregão Presencial">Pregão Presencial</option>
                  <option value="Credenciamento">Credenciamento</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Órgão Público *
                </label>
                <input
                  type="text"
                  required
                  value={orgao}
                  onChange={(e) => setOrgao(e.target.value)}
                  placeholder="Ex: Tribunal de Justiça do Estado de São Paulo"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CNPJ do Órgão
                </label>
                <input
                  type="text"
                  value={cnpjOrgao}
                  onChange={(e) => setCnpjOrgao(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Objeto da Licitação *
              </label>
              <textarea
                required
                rows={2}
                value={objeto}
                onChange={(e) => setObjeto(e.target.value)}
                placeholder="Descreva o objeto completo da licitação..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Data de Abertura *
                </label>
                <input
                  type="date"
                  required
                  value={dataAbertura}
                  onChange={(e) => setDataAbertura(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Horário
                </label>
                <input
                  type="time"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Portal de Compras
                </label>
                <input
                  type="text"
                  value={portal}
                  onChange={(e) => setPortal(e.target.value)}
                  placeholder="Ex: Comprasnet"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Valor Estimado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={valorEstimado}
                  onChange={(e) => setValorEstimado(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status Atual da Licitação
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LicitacaoStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="analise">🔵 Em análise</option>
                  <option value="preparacao">🟡 Preparação</option>
                  <option value="participando">🟢 Participando</option>
                  <option value="disputa">🟣 Em disputa</option>
                  <option value="vencida">🏆 Vencida (Homologada)</option>
                  <option value="perdida">🔴 Perdida</option>
                  <option value="cancelada">⚫ Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Responsável Interno
                </label>
                <input
                  type="text"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Documentos Exigidos pelo Edital */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
              <span>2. Habilitação & Documentos Exigidos pelo Edital</span>
              <span className="text-[11px] font-normal text-slate-400">
                {documentosExigidos.length} selecionados
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {documentos.map((doc) => {
                const isSelected = documentosExigidos.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocExigido(doc.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 text-blue-900 dark:text-blue-200 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate text-xs">{doc.nome}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{doc.categoria}</div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-blue-600 text-white' : 'border border-slate-400'
                      }`}
                    >
                      {isSelected && '✓'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seção 3: Itens da Licitação & Formação de Preço Integrada */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>3. Itens da Licitação ({itens.length})</span>
              </h3>
              <div className="text-right">
                <span className="text-slate-500 mr-2">Total Proposto:</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-sm font-mono">
                  {formatarMoeda(totalPrecoProposto)}
                </span>
              </div>
            </div>

            {/* Lista de Itens Já Adicionados */}
            {itens.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5">Produto / Descrição</th>
                      <th className="p-2.5 text-center">Qtd</th>
                      <th className="p-2.5 text-right">Custo Base</th>
                      <th className="p-2.5 text-right">Preço Mínimo</th>
                      <th className="p-2.5 text-right">Preço Proposto</th>
                      <th className="p-2.5 text-right">Margem</th>
                      <th className="p-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {itens.map((it) => (
                      <tr key={it.id}>
                        <td className="p-2.5 font-bold font-mono">#{it.numeroItem}</td>
                        <td className="p-2.5 font-semibold text-slate-900 dark:text-white">
                          {it.produtoNome}
                        </td>
                        <td className="p-2.5 text-center">
                          {it.quantidade} {it.unidade}
                        </td>
                        <td className="p-2.5 text-right font-mono">
                          {formatarMoeda(it.custoUnitario + it.freteTaxasUnitario)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-amber-600 dark:text-amber-400">
                          {formatarMoeda(it.precoMinimo)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                          {formatarMoeda(it.precoProposto)}
                        </td>
                        <td className="p-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatarPct(it.margemCalculadaPct)}
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Adicionar Novo Item inline */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Adicionar Novo Item ao Certame</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 mb-0.5">
                    Produto / Serviço da DavenzaTec
                  </label>
                  <select
                    value={itemProdutoId}
                    onChange={(e) => handleNovoItemProdutoChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({p.marca}) — Custo: {formatarMoeda(p.custoAtual)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-0.5">Quantidade & Unidade</label>
                  <div className="flex space-x-1.5">
                    <input
                      type="number"
                      min="1"
                      value={itemQuantidade}
                      onChange={(e) => setItemQuantidade(parseInt(e.target.value) || 1)}
                      className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                    <input
                      type="text"
                      value={itemUnidade}
                      onChange={(e) => setItemUnidade(e.target.value)}
                      placeholder="Licença"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-0.5">Custo Fornecedor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemCusto}
                    onChange={(e) => setItemCusto(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-0.5">Frete Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemFrete}
                    onChange={(e) => setItemFrete(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-0.5">Margem Meta (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={itemMargemDesejada}
                    onChange={(e) => setItemMargemDesejada(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-0.5">Preço Proposto (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={itemPrecoProposto}
                    onChange={(e) => setItemPrecoProposto(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-blue-400 dark:border-blue-600 bg-white dark:bg-slate-900 font-bold text-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Inserir Item na Licitação</span>
                </button>
              </div>
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{licitacaoParaEditar ? 'Salvar Alterações' : 'Criar Licitação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
