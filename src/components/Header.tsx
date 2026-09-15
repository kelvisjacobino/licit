import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  FileSpreadsheet,
  Plus,
  Calculator,
  User,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENT_DATE_STR, formatarData } from '../utils/pricing';

interface HeaderProps {
  onOpenNovaLicitacao: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNovaLicitacao }) => {
  const {
    usuarioAtivo,
    setUsuarioAtivo,
    alertas,
    marcarAlertaLido,
    marcarTodosAlertasLidos,
    setActiveTab,
  } = useApp();

  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const alertasNaoLidos = alertas.filter((a) => !a.lido);
  const alertasCriticos = alertas.filter((a) => a.severidade === 'critico');

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Marca & Identidade DavenzaTec */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-inner border border-cyan-400/30">
            <span className="text-white font-black text-xl tracking-tighter">DZ</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">DAVENZATEC</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium border border-blue-400/30">
                LICITAÇÕES & PREÇOS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal tracking-wide hidden sm:block">
              Tecnologia • Software • Cloud • Segurança
            </p>
          </div>
        </div>

        {/* Status Operacional & Data de Referência */}
        <div className="hidden md:flex items-center space-x-4 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">Operação Ativa</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Ref: {formatarData(CURRENT_DATE_STR)}</span>
        </div>

        {/* Ações Rápidas, Alertas e Perfil */}
        <div className="flex items-center space-x-3">
          {/* Botão Rápido Simulador */}
          <button
            onClick={() => setActiveTab('formacao_preco')}
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Abrir Simulador de Preços"
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulador</span>
          </button>

          {/* Botão Nova Licitação */}
          <button
            onClick={onOpenNovaLicitacao}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Licitação</span>
          </button>

          {/* Sino de Alertas com Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAlertDropdown(!showAlertDropdown)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Notificações e Alertas"
            >
              <Bell className="w-4 h-4" />
              {alertasNaoLidos.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full border-2 border-slate-900">
                  {alertasNaoLidos.length}
                </span>
              )}
            </button>

            {showAlertDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm text-white">Central de Alertas</span>
                  </div>
                  {alertasNaoLidos.length > 0 && (
                    <button
                      onClick={marcarTodosAlertasLidos}
                      className="text-[11px] text-blue-400 hover:text-blue-300 transition"
                    >
                      Marcar todos lidos
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800 text-xs">
                  {alertas.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      Nenhum alerta pendente no momento.
                    </div>
                  ) : (
                    alertas.map((alerta) => (
                      <div
                        key={alerta.id}
                        onClick={() => {
                          marcarAlertaLido(alerta.id);
                          setActiveTab(alerta.targetTab);
                          setShowAlertDropdown(false);
                        }}
                        className={`p-3 cursor-pointer transition flex items-start space-x-3 ${
                          !alerta.lido ? 'bg-slate-800/60 hover:bg-slate-800' : 'opacity-70 hover:opacity-100 hover:bg-slate-800/40'
                        }`}
                      >
                        {alerta.severidade === 'critico' ? (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        ) : alerta.severidade === 'atencao' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-slate-200">{alerta.titulo}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{alerta.mensagem}</div>
                          <div className="text-[10px] text-slate-500 mt-1">Ref: {formatarData(alerta.data)}</div>
                        </div>
                        {!alerta.lido && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Usuário Ativo & Perfil */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {usuarioAtivo.nome.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <div className="font-medium text-slate-200 leading-tight">{usuarioAtivo.nome}</div>
                <div className="text-[10px] text-blue-400">{usuarioAtivo.papel}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in duration-100 text-xs">
                <div className="px-4 py-2 border-b border-slate-800">
                  <div className="font-semibold text-slate-200">{usuarioAtivo.nome}</div>
                  <div className="text-slate-400 text-[11px]">{usuarioAtivo.email}</div>
                  <div className="text-slate-400 text-[11px]">{usuarioAtivo.cargo}</div>
                </div>

                <div className="px-4 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Simular Perfil de Acesso
                </div>

                <button
                  onClick={() => {
                    setUsuarioAtivo({
                      ...usuarioAtivo,
                      nome: 'Carlos Davenza',
                      cargo: 'Diretor Comercial & Operações',
                      papel: 'ADMINISTRADOR',
                    });
                    setShowUserDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                    usuarioAtivo.papel === 'ADMINISTRADOR' ? 'text-blue-400 font-semibold bg-slate-800/40' : 'text-slate-300'
                  }`}
                >
                  <span>Administrador</span>
                  {usuarioAtivo.papel === 'ADMINISTRADOR' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </button>

                <button
                  onClick={() => {
                    setUsuarioAtivo({
                      ...usuarioAtivo,
                      nome: 'Mariana Duarte',
                      cargo: 'Analista de Licitações Pleno',
                      papel: 'COMERCIAL',
                    });
                    setShowUserDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                    usuarioAtivo.papel === 'COMERCIAL' ? 'text-blue-400 font-semibold bg-slate-800/40' : 'text-slate-300'
                  }`}
                >
                  <span>Comercial</span>
                  {usuarioAtivo.papel === 'COMERCIAL' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </button>

                <button
                  onClick={() => {
                    setUsuarioAtivo({
                      ...usuarioAtivo,
                      nome: 'Auditoria Externa',
                      cargo: 'Consultor de Compliance',
                      papel: 'CONSULTA',
                    });
                    setShowUserDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                    usuarioAtivo.papel === 'CONSULTA' ? 'text-blue-400 font-semibold bg-slate-800/40' : 'text-slate-300'
                  }`}
                >
                  <span>Somente Consulta</span>
                  {usuarioAtivo.papel === 'CONSULTA' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
