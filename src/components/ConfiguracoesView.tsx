import React, { useState } from 'react';
import { Settings, Save, RotateCcw, CheckCircle2, Building, Percent, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ParametrosConfig } from '../types';

export const ConfiguracoesView: React.FC = () => {
  const { parametros, updateParametros, resetToDefaultData } = useApp();

  const [form, setForm] = useState<ParametrosConfig>({ ...parametros });
  const [salvo, setSalvo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParametros(form);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  const handleRestaurar = () => {
    if (
      confirm(
        'Deseja restaurar todos os dados e parâmetros do sistema para o estado inicial demonstrativo da DavenzaTec?'
      )
    ) {
      resetToDefaultData();
      alert('Dados restaurados com sucesso!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Administração do Sistema
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Settings className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            <span>Configurações & Parâmetros Gerais</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Definição de alíquotas tributárias padrão, metas de rentabilidade corporativa e dados institucionais.
          </p>
        </div>

        {salvo && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Parâmetros salvos com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Dados da Empresa */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              1. Dados Institucionais da DavenzaTec
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Razão Social
              </label>
              <input
                type="text"
                value={form.empresaRazaoSocial}
                onChange={(e) => setForm({ ...form, empresaRazaoSocial: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nome Fantasia
              </label>
              <input
                type="text"
                value={form.empresaNomeFantasia}
                onChange={(e) => setForm({ ...form, empresaNomeFantasia: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={form.empresaCnpj}
                onChange={(e) => setForm({ ...form, empresaCnpj: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                E-mail Comercial
              </label>
              <input
                type="email"
                value={form.empresaEmail}
                onChange={(e) => setForm({ ...form, empresaEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telefone de Contato
              </label>
              <input
                type="text"
                value={form.empresaTelefone}
                onChange={(e) => setForm({ ...form, empresaTelefone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Endereço Completo (para Propostas)
            </label>
            <input
              type="text"
              value={form.empresaEndereco}
              onChange={(e) => setForm({ ...form, empresaEndereco: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Parâmetros Financeiros & Formação de Preço */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Percent className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              2. Parâmetros Financeiros Padrão de Formação de Preço
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Impostos Padrão (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.impostosPadraoPct}
                onChange={(e) =>
                  setForm({ ...form, impostosPadraoPct: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Despesas / Op. (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.despesasPadraoPct}
                onChange={(e) =>
                  setForm({ ...form, despesasPadraoPct: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reserva Risco (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.riscoPadraoPct}
                onChange={(e) =>
                  setForm({ ...form, riscoPadraoPct: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Margem Mínima (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={form.margemMinimaPadraoPct}
                onChange={(e) =>
                  setForm({ ...form, margemMinimaPadraoPct: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-rose-300 dark:border-rose-700 bg-slate-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Margem Desejada (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={form.margemDesejadaPadraoPct}
                onChange={(e) =>
                  setForm({ ...form, margemDesejadaPadraoPct: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Parâmetros de Alertas de Certidões */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              3. Parâmetros de Alerta de Vencimento de Documentos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alerta Preventivo Amarelo (Dias de Antecedência)
              </label>
              <input
                type="number"
                min="15"
                max="90"
                value={form.alertaDiasAmarelo}
                onChange={(e) =>
                  setForm({ ...form, alertaDiasAmarelo: parseInt(e.target.value) || 30 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alerta Crítico Laranja (Dias de Antecedência)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={form.alertaDiasLaranja}
                onChange={(e) =>
                  setForm({ ...form, alertaDiasLaranja: parseInt(e.target.value) || 7 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
          <button
            type="button"
            onClick={handleRestaurar}
            className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar dados de exemplo do sistema</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Parâmetros Gerais</span>
          </button>
        </div>
      </form>
    </div>
  );
};
