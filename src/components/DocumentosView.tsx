import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Calendar,
  Building,
  Edit,
  Trash2,
  Download,
  FileCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Documento, DocumentoCategoria, DocumentoStatus } from '../types';
import { formatarData } from '../utils/pricing';
import { DocumentoModal } from './DocumentoModal';

export const DocumentosView: React.FC = () => {
  const { documentos, deleteDocumento, updateDocumento } = useApp();

  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [statusFiltro, setStatusFiltro] = useState<string>('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [documentoEditando, setDocumentoEditando] = useState<Documento | null>(null);

  // Contagens por status
  const validos = documentos.filter((d) => d.status === 'valido');
  const alerta30 = documentos.filter((d) => d.status === 'alerta_30');
  const alerta7 = documentos.filter((d) => d.status === 'alerta_7');
  const vencidos = documentos.filter((d) => d.status === 'vencido');

  const documentosFiltrados = documentos.filter((doc) => {
    if (statusFiltro !== 'todos' && doc.status !== statusFiltro) return false;
    if (categoriaFiltro !== 'todas' && doc.categoria !== categoriaFiltro) return false;

    if (busca.trim()) {
      const q = busca.toLowerCase();
      return (
        doc.nome.toLowerCase().includes(q) ||
        doc.orgaoEmissor.toLowerCase().includes(q) ||
        doc.numero.toLowerCase().includes(q) ||
        doc.codigoAutenticidade.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Habilitação Jurídica & Compliance
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <span>Cofre de Documentos & Certidões</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Auditoria permanente de validade de CNDs, atestados técnicos, balanços e certidões para certames públicos.
          </p>
        </div>

        <button
          onClick={() => {
            setDocumentoEditando(null);
            setModalAberto(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Certidão</span>
        </button>
      </div>

      {/* Grid de Semáforo de Validade (Seção 4 do Prompt: 🟢, 🟡, 🟠, 🔴) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFiltro(statusFiltro === 'valido' ? 'todos' : 'valido')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFiltro === 'valido'
              ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">🟢 VÁLIDOS</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {validos.length}
          </div>
          <div className="text-[10px] text-slate-500">Mais de 30 dias de vigência</div>
        </div>

        <div
          onClick={() => setStatusFiltro(statusFiltro === 'alerta_30' ? 'todos' : 'alerta_30')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFiltro === 'alerta_30'
              ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">🟡 ATENÇÃO (30d)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {alerta30.length}
          </div>
          <div className="text-[10px] text-slate-500">Vencem nos próximos 30 dias</div>
        </div>

        <div
          onClick={() => setStatusFiltro(statusFiltro === 'alerta_7' ? 'todos' : 'alerta_7')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFiltro === 'alerta_7'
              ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">🟠 URGENTE (7d)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {alerta7.length}
          </div>
          <div className="text-[10px] text-slate-500">Vencimento iminente</div>
        </div>

        <div
          onClick={() => setStatusFiltro(statusFiltro === 'vencido' ? 'todos' : 'vencido')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFiltro === 'vencido'
              ? 'ring-2 ring-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">🔴 VENCIDOS</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {vencidos.length}
          </div>
          <div className="text-[10px] text-slate-500">Impede habilitação</div>
        </div>
      </div>

      {/* Barra de Filtros de Categoria e Pesquisa */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-500">Categoria:</span>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="todas">Todas as categorias ({documentos.length})</option>
            <option value="juridica">Habilitação Jurídica</option>
            <option value="fiscal_trabalhista">Fiscal & Trabalhista</option>
            <option value="tecnica">Qualificação Técnica</option>
            <option value="economica">Qualificação Econômica</option>
            <option value="declaracoes">Declarações</option>
          </select>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar certidão, emissor, autenticidade..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>
      </div>

      {/* Grid de Certidões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentosFiltrados.map((doc) => {
          let statusColor = 'border-emerald-200 bg-emerald-50/40 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300';
          let badgeText = '🟢 Válido';

          if (doc.status === 'alerta_30') {
            statusColor = 'border-amber-300 bg-amber-50/40 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300';
            badgeText = `🟡 Vence em ${doc.diasParaVencer} dias`;
          } else if (doc.status === 'alerta_7') {
            statusColor = 'border-orange-400 bg-orange-50/40 text-orange-800 dark:bg-orange-950/20 dark:text-orange-300';
            badgeText = `🟠 Vence em ${doc.diasParaVencer} dias!`;
          } else if (doc.status === 'vencido') {
            statusColor = 'border-rose-400 bg-rose-50/40 text-rose-800 dark:bg-rose-950/20 dark:text-rose-300';
            badgeText = '🔴 Vencido!';
          }

          return (
            <div
              key={doc.id}
              className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md bg-white dark:bg-slate-900 flex flex-col justify-between ${
                doc.status === 'vencido' ? 'border-rose-300 dark:border-rose-800' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                    {badgeText}
                  </span>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setDocumentoEditando(doc);
                        setModalAberto(true);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Editar"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja remover o documento ${doc.nome}?`)) {
                          deleteDocumento(doc.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {doc.nome}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {doc.orgaoEmissor} • Nº {doc.numero}
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Emissão:</span>
                    <span>{formatarData(doc.dataEmissao)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Validade:</span>
                    <span
                      className={
                        doc.status === 'vencido'
                          ? 'text-rose-600'
                          : doc.status === 'alerta_7'
                          ? 'text-orange-600'
                          : 'text-slate-900 dark:text-white'
                      }
                    >
                      {formatarData(doc.validade)}
                    </span>
                  </div>
                  {doc.codigoAutenticidade && (
                    <div className="flex justify-between text-[10px] text-slate-400 truncate">
                      <span>Controle:</span>
                      <span className="truncate max-w-[150px]">{doc.codigoAutenticidade}</span>
                    </div>
                  )}
                </div>

                {doc.observacoes && (
                  <p className="text-[11px] text-slate-500 italic">
                    "{doc.observacoes}"
                  </p>
                )}
              </div>

              {/* Arquivo Anexado & Ação Rápida */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] truncate max-w-[180px]">
                  <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate font-medium">{doc.arquivoNome}</span>
                </div>

                <button
                  onClick={() => {
                    // Ação rápida de renovação
                    setDocumentoEditando(doc);
                    setModalAberto(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold transition text-[11px] flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Renovar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalAberto && (
        <DocumentoModal
          documentoParaEditar={documentoEditando}
          onClose={() => {
            setModalAberto(false);
            setDocumentoEditando(null);
          }}
        />
      )}
    </div>
  );
};
