import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  COTACOES_INICIAIS,
  DOCUMENTOS_INICIAIS,
  FORNECEDORES_INICIAIS,
  HISTORICO_PRECOS_INICIAIS,
  LICITACOES_INICIAIS,
  PARAMETROS_INICIAIS,
  PRODUTOS_INICIAIS,
  PROPOSTAS_INICIAIS,
  USUARIO_INICIAL,
} from '../data/initialData';
import {
  AlertaNotificacao,
  Cotacao,
  Documento,
  Fornecedor,
  HistoricoPreco,
  Licitacao,
  ParametrosTributarios,
  Produto,
  PropostaComercial,
  UsuarioAtivo,
} from '../types';
import { calcularStatusDocumento, CURRENT_DATE_STR } from '../utils/pricing';

interface AppContextType {
  licitacoes: Licitacao[];
  produtos: Produto[];
  fornecedores: Fornecedor[];
  cotacoes: Cotacao[];
  documentos: Documento[];
  propostas: PropostaComercial[];
  historicoPrecos: HistoricoPreco[];
  parametros: ParametrosTributarios;
  usuarioAtivo: UsuarioAtivo;
  activeTab: string;
  activeLicitacaoFilter: string;
  selectedLicitacaoId: string | null;
  alertas: AlertaNotificacao[];

  setActiveTab: (tab: string, filter?: string) => void;
  setActiveLicitacaoFilter: (filter: string) => void;
  setSelectedLicitacaoId: (id: string | null) => void;

  addLicitacao: (lic: Omit<Licitacao, 'id'>) => string;
  updateLicitacao: (lic: Licitacao) => void;
  deleteLicitacao: (id: string) => void;

  addProduto: (prod: Omit<Produto, 'id'>) => string;
  updateProduto: (prod: Produto) => void;
  deleteProduto: (id: string) => void;

  addFornecedor: (forn: Omit<Fornecedor, 'id'>) => string;
  updateFornecedor: (forn: Fornecedor) => void;
  deleteFornecedor: (id: string) => void;

  addCotacao: (cot: Omit<Cotacao, 'id'>) => string;
  updateCotacao: (cot: Cotacao) => void;
  deleteCotacao: (id: string) => void;

  addDocumento: (doc: Omit<Documento, 'id'>) => string;
  updateDocumento: (doc: Documento) => void;
  deleteDocumento: (id: string) => void;

  addProposta: (prop: Omit<PropostaComercial, 'id'>) => string;
  updateProposta: (prop: PropostaComercial) => void;
  deleteProposta: (id: string) => void;

  addHistoricoPreco: (hist: Omit<HistoricoPreco, 'id'>) => void;
  updateParametros: (p: ParametrosTributarios) => void;
  setUsuarioAtivo: (usr: UsuarioAtivo) => void;

  marcarAlertaLido: (id: string) => void;
  marcarTodosAlertasLidos: () => void;
  resetarDados: () => void;
  exportarBackup: () => string;
  importarBackup: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'davenzatec_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'licitacoes');
    return saved ? JSON.parse(saved) : LICITACOES_INICIAIS;
  });

  const [produtos, setProdutos] = useState<Produto[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'produtos');
    return saved ? JSON.parse(saved) : PRODUTOS_INICIAIS;
  });

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'fornecedores');
    return saved ? JSON.parse(saved) : FORNECEDORES_INICIAIS;
  });

  const [cotacoes, setCotacoes] = useState<Cotacao[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'cotacoes');
    return saved ? JSON.parse(saved) : COTACOES_INICIAIS;
  });

  const [documentos, setDocumentos] = useState<Documento[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'documentos');
    return saved ? JSON.parse(saved) : DOCUMENTOS_INICIAIS;
  });

  const [propostas, setPropostas] = useState<PropostaComercial[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'propostas');
    return saved ? JSON.parse(saved) : PROPOSTAS_INICIAIS;
  });

  const [historicoPrecos, setHistoricoPrecos] = useState<HistoricoPreco[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'historicoPrecos');
    return saved ? JSON.parse(saved) : HISTORICO_PRECOS_INICIAIS;
  });

  const [parametros, setParametros] = useState<ParametrosTributarios>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'parametros');
    return saved ? JSON.parse(saved) : PARAMETROS_INICIAIS;
  });

  const [usuarioAtivo, setUsuarioAtivo] = useState<UsuarioAtivo>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'usuario');
    return saved ? JSON.parse(saved) : USUARIO_INICIAL;
  });

  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [activeLicitacaoFilter, setActiveLicitacaoFilter] = useState<string>('todas');
  const [selectedLicitacaoId, setSelectedLicitacaoId] = useState<string | null>(null);

  // Recalcular status de documentos periodicamente
  useEffect(() => {
    setDocumentos((prevDocs) =>
      prevDocs.map((doc) => {
        const { status } = calcularStatusDocumento(doc.validade, CURRENT_DATE_STR);
        if (status !== doc.status) {
          return { ...doc, status };
        }
        return doc;
      })
    );
  }, []);

  // Persistência local
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'licitacoes', JSON.stringify(licitacoes));
  }, [licitacoes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'fornecedores', JSON.stringify(fornecedores));
  }, [fornecedores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'cotacoes', JSON.stringify(cotacoes));
  }, [cotacoes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'documentos', JSON.stringify(documentos));
  }, [documentos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'propostas', JSON.stringify(propostas));
  }, [propostas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'historicoPrecos', JSON.stringify(historicoPrecos));
  }, [historicoPrecos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'parametros', JSON.stringify(parametros));
  }, [parametros]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'usuario', JSON.stringify(usuarioAtivo));
  }, [usuarioAtivo]);

  // Alertas computados em tempo de execução
  const [alertasLidos, setAlertasLidos] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'alertas_lidos');
    return saved ? JSON.parse(saved) : [];
  });

  const alertas: AlertaNotificacao[] = [];

  // 1. Alertas de documentos vencidos ou a vencer
  documentos.forEach((doc) => {
    const calc = calcularStatusDocumento(doc.validade, CURRENT_DATE_STR);
    if (calc.status === 'vencido') {
      alertas.push({
        id: `alert-doc-venc-${doc.id}`,
        tipo: 'documento_vencido',
        titulo: `Documento Vencido: ${doc.nome}`,
        mensagem: `A validade expirou em ${doc.validade}. Renovação urgente requerida para não inabilitar certames.`,
        data: doc.validade,
        lido: alertasLidos.includes(`alert-doc-venc-${doc.id}`),
        targetTab: 'documentos',
        severidade: 'critico',
      });
    } else if (calc.status === 'alerta_7') {
      alertas.push({
        id: `alert-doc-7-${doc.id}`,
        tipo: 'documento_vencendo',
        titulo: `Vencimento em ${calc.diasRestantes} dias: ${doc.nome}`,
        mensagem: `O documento ${doc.nome} expira em ${doc.validade}. Solicite renovação imediatamente.`,
        data: doc.validade,
        lido: alertasLidos.includes(`alert-doc-7-${doc.id}`),
        targetTab: 'documentos',
        severidade: 'critico',
      });
    } else if (calc.status === 'alerta_30') {
      alertas.push({
        id: `alert-doc-30-${doc.id}`,
        tipo: 'documento_vencendo',
        titulo: `Atenção à Validade: ${doc.nome}`,
        mensagem: `Restam ${calc.diasRestantes} dias para o vencimento da certidão (${doc.validade}).`,
        data: doc.validade,
        lido: alertasLidos.includes(`alert-doc-30-${doc.id}`),
        targetTab: 'documentos',
        severidade: 'atencao',
      });
    }
  });

  // 2. Alertas de cotações vencidas ou próximas
  cotacoes.forEach((cot) => {
    const fornecedor = fornecedores.find((f) => f.id === cot.fornecedorId);
    const produto = produtos.find((p) => p.id === cot.produtoId);
    const validade = new Date(cot.validadeCotacao);
    const hoje = new Date(CURRENT_DATE_STR);
    const diffDias = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDias < 0 || cot.status === 'vencida') {
      alertas.push({
        id: `alert-cot-venc-${cot.id}`,
        tipo: 'cotacao_vencendo',
        titulo: `Cotação Expirada: ${cot.numero}`,
        mensagem: `Cotação de ${produto?.nome || 'Produto'} com ${fornecedor?.nomeFantasia || 'Fornecedor'} expirou.`,
        data: cot.validadeCotacao,
        lido: alertasLidos.includes(`alert-cot-venc-${cot.id}`),
        targetTab: 'cotacoes',
        severidade: 'atencao',
      });
    } else if (diffDias <= 3) {
      alertas.push({
        id: `alert-cot-exp-${cot.id}`,
        tipo: 'cotacao_vencendo',
        titulo: `Cotação ${cot.numero} vence em ${diffDias} dias`,
        mensagem: `Preço de ${produto?.nome || 'Item'} na ${fornecedor?.nomeFantasia || 'Distribuidora'} pode sofrer reajuste.`,
        data: cot.validadeCotacao,
        lido: alertasLidos.includes(`alert-cot-exp-${cot.id}`),
        targetTab: 'cotacoes',
        severidade: 'atencao',
      });
    }
  });

  // 3. Alertas de licitações com abertura iminente (<= 3 dias)
  licitacoes.forEach((lic) => {
    if (['analise', 'preparacao', 'participando'].includes(lic.status)) {
      const dataAbertura = new Date(lic.dataAbertura);
      const hoje = new Date(CURRENT_DATE_STR);
      const diffDias = Math.ceil((dataAbertura.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDias >= 0 && diffDias <= 3) {
        alertas.push({
          id: `alert-lic-open-${lic.id}`,
          tipo: 'licitacao_abertura',
          titulo: `Abertura em ${diffDias === 0 ? 'HOJE' : diffDias + ' dia(s)'}: ${lic.numero}`,
          mensagem: `Certame do(a) ${lic.orgao} abre às ${lic.horario} no ${lic.portal}. Verifique propostas e certidões.`,
          data: lic.dataAbertura,
          lido: alertasLidos.includes(`alert-lic-open-${lic.id}`),
          targetTab: 'licitacoes',
          severidade: diffDias <= 1 ? 'critico' : 'atencao',
        });
      }
    }
  });

  const setActiveTab = (tab: string, filter?: string) => {
    setActiveTabState(tab);
    if (filter) {
      setActiveLicitacaoFilter(filter);
    }
  };

  const marcarAlertaLido = (id: string) => {
    setAlertasLidos((prev) => {
      const next = [...prev, id];
      localStorage.setItem(STORAGE_PREFIX + 'alertas_lidos', JSON.stringify(next));
      return next;
    });
  };

  const marcarTodosAlertasLidos = () => {
    const todosIds = alertas.map((a) => a.id);
    setAlertasLidos(todosIds);
    localStorage.setItem(STORAGE_PREFIX + 'alertas_lidos', JSON.stringify(todosIds));
  };

  // CRUD Licitações
  const addLicitacao = (lic: Omit<Licitacao, 'id'>): string => {
    const newId = `lic-${Date.now()}`;
    const nova: Licitacao = { ...lic, id: newId };
    setLicitacoes((prev) => [nova, ...prev]);
    return newId;
  };

  const updateLicitacao = (lic: Licitacao) => {
    setLicitacoes((prev) => prev.map((item) => (item.id === lic.id ? lic : item)));
  };

  const deleteLicitacao = (id: string) => {
    setLicitacoes((prev) => prev.filter((item) => item.id !== id));
  };

  // CRUD Produtos
  const addProduto = (prod: Omit<Produto, 'id'>): string => {
    const newId = `prod-${Date.now()}`;
    const novoProduto: Produto = { ...prod, id: newId };
    setProdutos((prev) => [novoProduto, ...prev]);
    return newId;
  };

  const updateProduto = (prod: Produto) => {
    setProdutos((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
  };

  const deleteProduto = (id: string) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  // CRUD Fornecedores
  const addFornecedor = (forn: Omit<Fornecedor, 'id'>): string => {
    const newId = `forn-${Date.now()}`;
    const novo: Fornecedor = { ...forn, id: newId };
    setFornecedores((prev) => [novo, ...prev]);
    return newId;
  };

  const updateFornecedor = (forn: Fornecedor) => {
    setFornecedores((prev) => prev.map((f) => (f.id === forn.id ? forn : f)));
  };

  const deleteFornecedor = (id: string) => {
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
  };

  // CRUD Cotações
  const addCotacao = (cot: Omit<Cotacao, 'id'>): string => {
    const newId = `cot-${Date.now()}`;
    const nova: Cotacao = { ...cot, id: newId };
    setCotacoes((prev) => [nova, ...prev]);
    return newId;
  };

  const updateCotacao = (cot: Cotacao) => {
    setCotacoes((prev) => prev.map((c) => (c.id === cot.id ? cot : c)));
  };

  const deleteCotacao = (id: string) => {
    setCotacoes((prev) => prev.filter((c) => c.id !== id));
  };

  // CRUD Documentos
  const addDocumento = (doc: Omit<Documento, 'id'>): string => {
    const newId = `doc-${Date.now()}`;
    const { status } = calcularStatusDocumento(doc.validade, CURRENT_DATE_STR);
    const novo: Documento = { ...doc, id: newId, status };
    setDocumentos((prev) => [novo, ...prev]);
    return newId;
  };

  const updateDocumento = (doc: Documento) => {
    const { status } = calcularStatusDocumento(doc.validade, CURRENT_DATE_STR);
    const atualizado = { ...doc, status };
    setDocumentos((prev) => prev.map((d) => (d.id === doc.id ? atualizado : d)));
  };

  const deleteDocumento = (id: string) => {
    setDocumentos((prev) => prev.filter((d) => d.id !== id));
  };

  // CRUD Propostas
  const addProposta = (prop: Omit<PropostaComercial, 'id'>): string => {
    const newId = `prop-${Date.now()}`;
    const nova: PropostaComercial = { ...prop, id: newId };
    setPropostas((prev) => [nova, ...prev]);
    return newId;
  };

  const updateProposta = (prop: PropostaComercial) => {
    setPropostas((prev) => prev.map((p) => (p.id === prop.id ? prop : p)));
  };

  const deleteProposta = (id: string) => {
    setPropostas((prev) => prev.filter((p) => p.id !== id));
  };

  // Histórico de Preços
  const addHistoricoPreco = (hist: Omit<HistoricoPreco, 'id'>) => {
    const novo: HistoricoPreco = { ...hist, id: `hist-${Date.now()}` };
    setHistoricoPrecos((prev) => [novo, ...prev]);
  };

  const updateParametros = (p: ParametrosTributarios) => {
    setParametros(p);
  };

  const resetarDados = () => {
    localStorage.clear();
    setLicitacoes(LICITACOES_INICIAIS);
    setProdutos(PRODUTOS_INICIAIS);
    setFornecedores(FORNECEDORES_INICIAIS);
    setCotacoes(COTACOES_INICIAIS);
    setDocumentos(DOCUMENTOS_INICIAIS);
    setPropostas(PROPOSTAS_INICIAIS);
    setHistoricoPrecos(HISTORICO_PRECOS_INICIAIS);
    setParametros(PARAMETROS_INICIAIS);
    setUsuarioAtivo(USUARIO_INICIAL);
    setAlertasLidos([]);
  };

  const exportarBackup = (): string => {
    const payload = {
      licitacoes,
      produtos,
      fornecedores,
      cotacoes,
      documentos,
      propostas,
      historicoPrecos,
      parametros,
      exportadoEm: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  };

  const importarBackup = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.licitacoes) setLicitacoes(data.licitacoes);
      if (data.produtos) setProdutos(data.produtos);
      if (data.fornecedores) setFornecedores(data.fornecedores);
      if (data.cotacoes) setCotacoes(data.cotacoes);
      if (data.documentos) setDocumentos(data.documentos);
      if (data.propostas) setPropostas(data.propostas);
      if (data.historicoPrecos) setHistoricoPrecos(data.historicoPrecos);
      if (data.parametros) setParametros(data.parametros);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        licitacoes,
        produtos,
        fornecedores,
        cotacoes,
        documentos,
        propostas,
        historicoPrecos,
        parametros,
        usuarioAtivo,
        activeTab,
        activeLicitacaoFilter,
        selectedLicitacaoId,
        alertas,
        setActiveTab,
        setActiveLicitacaoFilter,
        setSelectedLicitacaoId,
        addLicitacao,
        updateLicitacao,
        deleteLicitacao,
        addProduto,
        updateProduto,
        deleteProduto,
        addFornecedor,
        updateFornecedor,
        deleteFornecedor,
        addCotacao,
        updateCotacao,
        deleteCotacao,
        addDocumento,
        updateDocumento,
        deleteDocumento,
        addProposta,
        updateProposta,
        deleteProposta,
        addHistoricoPreco,
        updateParametros,
        setUsuarioAtivo,
        marcarAlertaLido,
        marcarTodosAlertasLidos,
        resetarDados,
        exportarBackup,
        importarBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
