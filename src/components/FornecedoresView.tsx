import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Edit,
  Trash2,
  ExternalLink,
  MessageSquare,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Fornecedor } from '../types';
import { FornecedorModal } from './FornecedorModal';

interface FornecedoresViewProps {
  onNovaCotacaoParaFornecedor?: (fornecedorId: string) => void;
}

export const FornecedoresView: React.FC<FornecedoresViewProps> = ({
  onNovaCotacaoParaFornecedor,
}) => {
  const { fornecedores, produtos, cotacoes, deleteFornecedor, setActiveTab } = useApp();

  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [modalAberto, setModalAberto] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);

  const fornecedoresFiltrados = fornecedores.filter((f) => {
    if (categoriaFiltro !== 'todas' && f.categoria !== categoriaFiltro) return false;

    if (busca.trim()) {
      const q = busca.toLowerCase();
      return (
        f.nomeFantasia.toLowerCase().includes(q) ||
        f.razaoSocial.toLowerCase().includes(q) ||
        f.cnpj.includes(q) ||
        f.contatoNome.toLowerCase().includes(q) ||
        f.cidadeUf.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Rede de Suprimentos & Distribuição
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-sky-600" />
            <span>Cadastro & Gestão de Fornecedores</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralize distribuidores, fabricantes oficiais, contatos de vendas e condições comerciais.
          </p>
        </div>

        <button
          onClick={() => {
            setFornecedorEditando(null);
            setModalAberto(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Fornecedor</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-500">Filtrar por Categoria:</span>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="todas">Todas as categorias ({fornecedores.length})</option>
            <option value="Distribuidor">Distribuidores</option>
            <option value="Fabricante">Fabricantes</option>
            <option value="Prestador de Serviço">Prestadores de Serviço</option>
            <option value="Revenda">Revendas</option>
          </select>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome fantasia, CNPJ, contato..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>
      </div>

      {/* Grid de Fornecedores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {fornecedoresFiltrados.map((forn) => {
          const prodsAssociados = produtos.filter((p) => p.fornecedorPrincipalId === forn.id);
          const cotacoesForn = cotacoes.filter((c) => c.fornecedorId === forn.id);

          return (
            <div
              key={forn.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Fornecedor */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900">
                        {forn.categoria}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        Ativo
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                      {forn.nomeFantasia}
                    </h3>
                    <div className="text-[11px] text-slate-500">{forn.razaoSocial}</div>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setFornecedorEditando(forn);
                        setModalAberto(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Editar Fornecedor"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja excluir o fornecedor ${forn.nomeFantasia}?`)) {
                          deleteFornecedor(forn.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Detalhes de Contato & Localização */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{forn.cidadeUf}</span>
                  </div>

                  <div className="flex items-center space-x-2 font-mono text-[11px]">
                    <span className="font-bold text-slate-400">CNPJ:</span>
                    <span>{forn.cnpj}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Entrega: {forn.prazoEntregaDias} dias úteis</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{forn.condicaoPagamentoPadrao}</span>
                  </div>
                </div>

                {/* Contato Comercial */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>Representante: {forn.contatoNome}</span>
                    {forn.whatsapp && (
                      <a
                        href={`https://wa.me/55${forn.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-500">
                    <span>{forn.email}</span>
                    <span>{forn.telefone}</span>
                  </div>
                </div>

                {forn.observacoes && (
                  <p className="text-[11px] text-slate-500 italic">
                    "{forn.observacoes}"
                  </p>
                )}
              </div>

              {/* Rodapé do Card */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-400 text-[11px]">
                  <span>{prodsAssociados.length} produtos vinculados</span> •{' '}
                  <span>{cotacoesForn.length} cotações</span>
                </div>

                <button
                  onClick={() => setActiveTab('cotacoes')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  Ver Cotações
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalAberto && (
        <FornecedorModal
          fornecedorParaEditar={fornecedorEditando}
          onClose={() => {
            setModalAberto(false);
            setFornecedorEditando(null);
          }}
        />
      )}
    </div>
  );
};
