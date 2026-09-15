import React, { useState } from 'react';
import { X, Save, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Produto, ProdutoCategoria, ProdutoTipo } from '../types';

interface ProdutoModalProps {
  produtoParaEditar?: Produto | null;
  onClose: () => void;
}

export const ProdutoModal: React.FC<ProdutoModalProps> = ({
  produtoParaEditar,
  onClose,
}) => {
  const { fornecedores, addProduto, updateProduto } = useApp();

  const [tipo, setTipo] = useState<ProdutoTipo>(produtoParaEditar?.tipo || 'produto');
  const [nome, setNome] = useState(produtoParaEditar?.nome || '');
  const [descricao, setDescricao] = useState(produtoParaEditar?.descricao || '');
  const [categoria, setCategoria] = useState<ProdutoCategoria>(
    produtoParaEditar?.categoria || 'Software'
  );
  const [unidade, setUnidade] = useState(produtoParaEditar?.unidade || 'Licença');
  const [sku, setSku] = useState(produtoParaEditar?.sku || '');
  const [marca, setMarca] = useState(produtoParaEditar?.marca || '');
  const [fornecedorPrincipalId, setFornecedorPrincipalId] = useState(
    produtoParaEditar?.fornecedorPrincipalId || fornecedores[0]?.id || ''
  );
  const [custoAtual, setCustoAtual] = useState<number>(produtoParaEditar?.custoAtual || 0);
  const [precoSugerido, setPrecoSugerido] = useState<number>(
    produtoParaEditar?.precoSugerido || 0
  );
  const [observacoesTecnicas, setObservacoesTecnicas] = useState(
    produtoParaEditar?.observacoesTecnicas || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dados = {
      tipo,
      nome,
      descricao,
      categoria,
      unidade,
      sku: sku || `DVT-${Date.now().toString().slice(-4)}`,
      marca,
      fornecedorPrincipalId,
      custoAtual,
      precoSugerido,
      margemHistoricaPct:
        custoAtual > 0 && precoSugerido > 0
          ? ((precoSugerido - custoAtual) / precoSugerido) * 100
          : 20,
      observacoesTecnicas,
    };

    if (produtoParaEditar) {
      updateProduto({ ...dados, id: produtoParaEditar.id });
    } else {
      addProduto(dados);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {produtoParaEditar ? 'Editar Item do Catálogo' : 'Novo Produto ou Serviço'}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tipo *
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as ProdutoTipo)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="produto">Produto Físico / Licença</option>
                <option value="servico">Serviço Especializado / Consultoria</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoria *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as ProdutoCategoria)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Software">Software & Licenças</option>
                <option value="Hardware">Hardware & Equipamentos</option>
                <option value="Serviços">Serviços Técnicos</option>
                <option value="Consultoria">Consultoria & Treinamento</option>
                <option value="Cloud">Cloud & Infraestrutura</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nome do Item *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Firewall Fortinet FortiGate 100F"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição Detalhada / Especificações do Edital
            </label>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição técnica exigida em editais de licitação..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unidade de Medida
              </label>
              <input
                type="text"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                placeholder="Unidade, Licença, Hora..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Código / SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ex: DVT-FTNT-100F"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fabricante / Marca
              </label>
              <input
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Ex: Fortinet, Dell, Microsoft..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fornecedor Principal
              </label>
              <select
                value={fornecedorPrincipalId}
                onChange={(e) => setFornecedorPrincipalId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {fornecedores.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nomeFantasia}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custo de Referência (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={custoAtual}
                onChange={(e) => setCustoAtual(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preço Sugerido Venda (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={precoSugerido}
                onChange={(e) => setPrecoSugerido(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-blue-400 dark:border-blue-600 bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações Técnicas / Compatibilidade
            </label>
            <textarea
              rows={2}
              value={observacoesTecnicas}
              onChange={(e) => setObservacoesTecnicas(e.target.value)}
              placeholder="Ex: Exige certificação Fortinet NSE 4 do corpo técnico para suporte..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
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
              <span>{produtoParaEditar ? 'Salvar Alterações' : 'Cadastrar Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
