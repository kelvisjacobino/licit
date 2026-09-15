import React, { useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Fornecedor, FornecedorCategoria } from '../types';

interface FornecedorModalProps {
  fornecedorParaEditar?: Fornecedor | null;
  onClose: () => void;
}

export const FornecedorModal: React.FC<FornecedorModalProps> = ({
  fornecedorParaEditar,
  onClose,
}) => {
  const { addFornecedor, updateFornecedor } = useApp();

  const [razaoSocial, setRazaoSocial] = useState(fornecedorParaEditar?.razaoSocial || '');
  const [nomeFantasia, setNomeFantasia] = useState(fornecedorParaEditar?.nomeFantasia || '');
  const [cnpj, setCnpj] = useState(fornecedorParaEditar?.cnpj || '');
  const [categoria, setCategoria] = useState<FornecedorCategoria>(
    fornecedorParaEditar?.categoria || 'Distribuidor'
  );
  const [contatoNome, setContatoNome] = useState(fornecedorParaEditar?.contatoNome || '');
  const [email, setEmail] = useState(fornecedorParaEditar?.email || '');
  const [telefone, setTelefone] = useState(fornecedorParaEditar?.telefone || '');
  const [whatsapp, setWhatsapp] = useState(fornecedorParaEditar?.whatsapp || '');
  const [cidadeUf, setCidadeUf] = useState(fornecedorParaEditar?.cidadeUf || 'São Paulo/SP');
  const [condicaoPagamentoPadrao, setCondicaoPagamentoPadrao] = useState(
    fornecedorParaEditar?.condicaoPagamentoPadrao || '28 DDL'
  );
  const [prazoEntregaDias, setPrazoEntregaDias] = useState<number>(
    fornecedorParaEditar?.prazoEntregaDias || 5
  );
  const [dadosBancariosPix, setDadosBancariosPix] = useState(
    fornecedorParaEditar?.dadosBancariosPix || ''
  );
  const [observacoes, setObservacoes] = useState(fornecedorParaEditar?.observacoes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dados = {
      razaoSocial,
      nomeFantasia: nomeFantasia || razaoSocial,
      cnpj,
      categoria,
      contatoNome,
      email,
      telefone,
      whatsapp,
      cidadeUf,
      condicaoPagamentoPadrao,
      prazoEntregaDias,
      dadosBancariosPix,
      status: 'ativo' as const,
      observacoes,
    };

    if (fornecedorParaEditar) {
      updateFornecedor({ ...dados, id: fornecedorParaEditar.id });
    } else {
      addFornecedor(dados);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {fornecedorParaEditar ? 'Editar Fornecedor' : 'Cadastrar Novo Fornecedor'}
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
                Nome Fantasia *
              </label>
              <input
                type="text"
                required
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                placeholder="Ex: Ingram Micro Brasil"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Razão Social
              </label>
              <input
                type="text"
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                placeholder="Ex: Ingram Micro Distribuidora Ltda."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CNPJ *
              </label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoria *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as FornecedorCategoria)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Distribuidor">Distribuidor Oficial</option>
                <option value="Fabricante">Fabricante Direto</option>
                <option value="Prestador de Serviço">Prestador de Serviço / Terc.</option>
                <option value="Revenda">Revenda Parceira</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cidade / UF
              </label>
              <input
                type="text"
                value={cidadeUf}
                onChange={(e) => setCidadeUf(e.target.value)}
                placeholder="São Paulo/SP"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nome do Gerente / Contato
              </label>
              <input
                type="text"
                value={contatoNome}
                onChange={(e) => setContatoNome(e.target.value)}
                placeholder="Ex: Carlos Silva"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                E-mail Comercial
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="comercial@fornecedor.com.br"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp / Celular
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Condição Padrão de Faturamento
              </label>
              <input
                type="text"
                value={condicaoPagamentoPadrao}
                onChange={(e) => setCondicaoPagamentoPadrao(e.target.value)}
                placeholder="Ex: Faturado 28 DDL ou À vista 3% desc."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prazo Médio de Entrega (dias úteis)
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

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chave Pix / Informações Bancárias
            </label>
            <input
              type="text"
              value={dadosBancariosPix}
              onChange={(e) => setDadosBancariosPix(e.target.value)}
              placeholder="Ex: CNPJ: 11.222.333/0001-44 (Banco do Brasil ag. 1234 c/c 5678-9)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações Comerciais & Parcerias
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Canal Premier com rebates trimestrais e registro de oportunidades de licitação..."
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
              <span>{fornecedorParaEditar ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
