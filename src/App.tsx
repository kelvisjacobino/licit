import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { LicitacoesView } from './components/LicitacoesView';
import { FormacaoPrecoView } from './components/FormacaoPrecoView';
import { ProdutosView } from './components/ProdutosView';
import { FornecedoresView } from './components/FornecedoresView';
import { CotacoesView } from './components/CotacoesView';
import { DocumentosView } from './components/DocumentosView';
import { PropostasView } from './components/PropostasView';
import { RelatoriosView } from './components/RelatoriosView';
import { ConfiguracoesView } from './components/ConfiguracoesView';
import { LicitacaoModal } from './components/LicitacaoModal';
import { ViabilidadeModal } from './components/ViabilidadeModal';
import { Licitacao } from './types';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  // Modais globais
  const [licitacaoModalAberta, setLicitacaoModalAberta] = useState(false);
  const [licitacaoEditando, setLicitacaoEditando] = useState<Licitacao | null>(null);

  const [viabilidadeModalLicitacaoId, setViabilidadeModalLicitacaoId] = useState<string | null>(
    null
  );

  const [propostaTargetLicitacaoId, setPropostaTargetLicitacaoId] = useState<string | null>(null);

  const handleOpenNovaLicitacao = () => {
    setLicitacaoEditando(null);
    setLicitacaoModalAberta(true);
  };

  const handleEditarLicitacao = (lic: Licitacao) => {
    setLicitacaoEditando(lic);
    setLicitacaoModalAberta(true);
  };

  const handleOpenViabilidade = (licitacaoId: string) => {
    setViabilidadeModalLicitacaoId(licitacaoId);
  };

  const handleOpenProposta = (licitacaoId: string) => {
    setPropostaTargetLicitacaoId(licitacaoId);
    setActiveTab('propostas');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Barra de Topo Corporativa */}
      <Header />

      {/* Conteúdo Principal com Sidebar e Área de Trabalho */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/70 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                onOpenNovaLicitacao={handleOpenNovaLicitacao}
                onOpenViabilidade={handleOpenViabilidade}
              />
            )}

            {activeTab === 'licitacoes' && (
              <LicitacoesView
                onOpenNovaLicitacao={handleOpenNovaLicitacao}
                onEditarLicitacao={handleEditarLicitacao}
                onOpenViabilidade={handleOpenViabilidade}
                onOpenProposta={handleOpenProposta}
              />
            )}

            {activeTab === 'formacao_preco' && <FormacaoPrecoView />}

            {activeTab === 'produtos' && <ProdutosView />}

            {activeTab === 'fornecedores' && <FornecedoresView />}

            {activeTab === 'cotacoes' && <CotacoesView />}

            {activeTab === 'documentos' && <DocumentosView />}

            {activeTab === 'propostas' && (
              <PropostasView initialLicitacaoId={propostaTargetLicitacaoId} />
            )}

            {activeTab === 'relatorios' && <RelatoriosView />}

            {activeTab === 'configuracoes' && <ConfiguracoesView />}
          </div>
        </main>
      </div>

      {/* Modais Globais */}
      {licitacaoModalAberta && (
        <LicitacaoModal
          licitacaoParaEditar={licitacaoEditando}
          onClose={() => {
            setLicitacaoModalAberta(false);
            setLicitacaoEditando(null);
          }}
          onSuccess={(id) => {
            setLicitacaoModalAberta(false);
            setLicitacaoEditando(null);
          }}
        />
      )}

      {viabilidadeModalLicitacaoId && (
        <ViabilidadeModal
          licitacaoId={viabilidadeModalLicitacaoId}
          onClose={() => setViabilidadeModalLicitacaoId(null)}
          onOpenProposta={(licId) => {
            setViabilidadeModalLicitacaoId(null);
            handleOpenProposta(licId);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
