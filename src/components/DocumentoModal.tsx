import React, { useState } from 'react';
import { X, Save, FileText, Upload, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Documento, DocumentoCategoria } from '../types';
import { calcularStatusDocumento, CURRENT_DATE_STR } from '../utils/pricing';

interface DocumentoModalProps {
  documentoParaEditar?: Documento | null;
  onClose: () => void;
}

export const DocumentoModal: React.FC<DocumentoModalProps> = ({
  documentoParaEditar,
  onClose,
}) => {
  const { usuarioAtivo, addDocumento, updateDocumento } = useApp();

  const [nome, setNome] = useState(documentoParaEditar?.nome || '');
  const [categoria, setCategoria] = useState<DocumentoCategoria>(
    documentoParaEditar?.categoria || 'fiscal_trabalhista'
  );
  const [orgaoEmissor, setOrgaoEmissor] = useState(
    documentoParaEditar?.orgaoEmissor || 'Receita Federal / PGFN'
  );
  const [numero, setNumero] = useState(documentoParaEditar?.numero || '');
  const [codigoAutenticidade, setCodigoAutenticidade] = useState(
    documentoParaEditar?.codigoAutenticidade || ''
  );
  const [dataEmissao, setDataEmissao] = useState(
    documentoParaEditar?.dataEmissao || CURRENT_DATE_STR
  );
  const [validade, setValidade] = useState(
    documentoParaEditar?.validade || '2026-11-30'
  );
  const [responsavelRenovacao, setResponsavelRenovacao] = useState(
    documentoParaEditar?.responsavelRenovacao || usuarioAtivo.nome
  );
  const [observacoes, setObservacoes] = useState(documentoParaEditar?.observacoes || '');
  const [arquivoNome, setArquivoNome] = useState(
    documentoParaEditar?.arquivoNome || 'certidao_atualizada.pdf'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { status, diasParaVencer } = calcularStatusDocumento(validade);

    const dados = {
      nome,
      categoria,
      orgaoEmissor,
      numero,
      codigoAutenticidade,
      dataEmissao,
      validade,
      diasParaVencer,
      status,
      arquivoNome,
      arquivoTamanho: '450 KB',
      arquivoUrl: '#',
      responsavelRenovacao,
      observacoes,
    };

    if (documentoParaEditar) {
      updateDocumento({ ...dados, id: documentoParaEditar.id });
    } else {
      addDocumento(dados);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {documentoParaEditar
                ? 'Editar Documento / Certidão'
                : 'Cadastrar Certidão no Cofre de Habilitação'}
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
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nome do Documento / Certidão *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Certidão Negativa de Débitos Federais (CND Federal)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoria de Habilitação *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as DocumentoCategoria)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="juridica">Habilitação Jurídica (Contrato, CNPJ...)</option>
                <option value="fiscal_trabalhista">
                  Regularidade Fiscal e Trabalhista (CNDs, FGTS, CNDT...)
                </option>
                <option value="tecnica">Qualificação Técnica (Atestados de Capacidade...)</option>
                <option value="economica">
                  Qualificação Econômico-Financeira (Balanço, Falência...)
                </option>
                <option value="declaracoes">Declarações Oficiais & Outros</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Órgão Emissor *
              </label>
              <input
                type="text"
                required
                value={orgaoEmissor}
                onChange={(e) => setOrgaoEmissor(e.target.value)}
                placeholder="Ex: Secretaria da Fazenda / TST"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número do Documento
              </label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ex: CND-2026/99812"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Código de Autenticidade / Controle
              </label>
              <input
                type="text"
                value={codigoAutenticidade}
                onChange={(e) => setCodigoAutenticidade(e.target.value)}
                placeholder="Ex: F8A1.99C4.3312"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data de Emissão
              </label>
              <input
                type="date"
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data de Validade *
              </label>
              <input
                type="date"
                required
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-blue-400 dark:border-blue-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Responsável Renovação
              </label>
              <input
                type="text"
                value={responsavelRenovacao}
                onChange={(e) => setResponsavelRenovacao(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Upload de Arquivo Simulado */}
          <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 text-center space-y-1.5">
            <Upload className="w-6 h-6 text-slate-400 mx-auto" />
            <div className="text-slate-700 dark:text-slate-300 font-semibold">
              Arquivo PDF da Certidão
            </div>
            <div className="text-slate-500 text-[11px]">
              Arquivo atual: <span className="font-mono font-bold text-blue-600">{arquivoNome}</span>
            </div>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setArquivoNome(file.name);
              }}
              className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Emissão automática pelo portal e-CAC da Receita Federal..."
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
              <span>{documentoParaEditar ? 'Salvar Documento' : 'Salvar no Cofre'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
