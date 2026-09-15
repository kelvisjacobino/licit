export type DocumentoCategoria =
  | 'juridico'
  | 'fiscal'
  | 'economico'
  | 'tecnico'
  | 'comercial'
  | 'juridica'
  | 'fiscal_trabalhista'
  | 'tecnica'
  | 'economica'
  | 'declaracoes';

export type DocumentoStatus =
  | 'valido'
  | 'alerta_30'
  | 'alerta_7'
  | 'vencido';

export interface Documento {
  id: string;
  nome: string;
  categoria: DocumentoCategoria;
  numero: string;
  emissao?: string;
  dataEmissao?: string;
  validade: string;
  arquivoNome: string;
  arquivoTamanho?: string;
  arquivoUrl?: string;
  status: DocumentoStatus;
  diasParaVencer?: number;
  codigoAutenticidade?: string;
  responsavelRenovacao?: string;
  observacoes?: string;
  orgaoEmissor?: string;
}

export type FornecedorCategoria =
  | 'Distribuidor'
  | 'Fabricante'
  | 'Prestador de Serviço'
  | 'Revenda'
  | 'Outro';

export interface Fornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  contato?: string;
  contatoNome?: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  cidadeUf?: string;
  site?: string;
  categoria: FornecedorCategoria;
  marcas?: string[];
  prazoPagamentoDias?: number;
  condicaoPagamentoPadrao?: string;
  prazoEntregaDias: number;
  dadosBancariosPix?: string;
  observacoes?: string;
  status: 'Ativo' | 'Inativo' | 'ativo' | 'inativo';
}

export type ProdutoCategoria = 'Software' | 'Hardware' | 'Serviço' | 'Infraestrutura';
export type ProdutoTipo = 'Produto' | 'Serviço';

export interface Produto {
  id: string;
  codigo?: string; // SKU / Part Number
  sku?: string;
  nome: string;
  descricao?: string;
  categoria: ProdutoCategoria;
  tipo?: ProdutoTipo;
  marca: string;
  fornecedorPrincipalId: string;
  unidade: 'Licença' | 'Mês' | 'Unidade' | 'Hora' | 'Assinatura Anual' | 'Lote' | 'Turma' | 'Diária' | 'Serviço' | string;
  custoAtual: number;
  custoMedio?: number;
  precoSugerido: number;
  margemPadrao?: number; // %
  margemHistoricaPct?: number;
  status: 'Ativo' | 'Inativo' | 'ativo' | 'inativo';
  observacoes?: string;
  observacoesTecnicas?: string;
}

export type CotacaoStatus = 'vigente' | 'vencida' | 'aprovada' | 'rejeitada' | 'pendente';

export interface Cotacao {
  id: string;
  numero: string;
  fornecedorId: string;
  produtoId: string;
  licitacaoId?: string;
  quantidade: number;
  valorUnitario: number;
  frete: number;
  taxas: number;
  prazoEntregaDias: number;
  condicaoPagamento: string;
  validadeCotacao: string;
  dataCotacao: string;
  responsavel?: string;
  observacoes?: string;
  arquivoCotacao?: string;
  status: CotacaoStatus;
}

export type LicitacaoStatus =
  | 'analise'       // 🔵 Em análise
  | 'preparacao'    // 🟡 Preparação
  | 'participando'  // 🟢 Participando
  | 'disputa'       // 🟣 Em disputa
  | 'vencida'       // 🏆 Vencida
  | 'perdida'       // 🔴 Perdida
  | 'cancelada';    // ⚫ Cancelada

export type LicitacaoModalidade =
  | 'Pregão Eletrônico'
  | 'Concorrência Pública'
  | 'Dispensa de Licitação'
  | 'Inexigibilidade'
  | 'Pregão Presencial'
  | 'Credenciamento';

export interface ItemLicitacao {
  id: string;
  numeroItem: number;
  produtoId?: string;
  produtoNome: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  fornecedorId?: string;
  custoUnitario: number;
  freteTaxasUnitario: number;
  impostosPct: number;
  despesasPct: number;
  riscoPct: number;
  margemDesejadaPct: number;
  precoMinimo: number;
  precoProposto: number;
  margemCalculadaPct: number;
  lucroEstimadoTotal: number;
  status: 'pendente' | 'cotado' | 'homologado' | 'vencido' | 'perdido';
}

export interface Licitacao {
  id: string;
  numero: string; // Ex: Pregão Eletrônico nº 008/2026
  processo: string; // Ex: Processo 2026/0491-SEDUC
  orgao: string; // Ex: Tribunal Regional Federal 1ª Região
  cnpjOrgao: string;
  modalidade: LicitacaoModalidade;
  objeto: string;
  dataAbertura: string;
  horario: string;
  portal: string; // Ex: Comprasnet, Licitações-e, BLL
  link?: string;
  valorEstimado: number;
  status: LicitacaoStatus;
  responsavel: string;
  observacoes?: string;
  itens: ItemLicitacao[];
  documentosExigidos?: string[]; // IDs de Documentos necessários
  motivoResultado?: string;
}

export interface HistoricoPreco {
  id: string;
  data: string;
  produtoId: string;
  produtoNome: string;
  fornecedorId: string;
  fornecedorNome: string;
  custo: number;
  venda: number;
  margemPct: number;
  licitacaoNumero?: string;
  observacao?: string;
}

export interface PropostaComercial {
  id: string;
  licitacaoId: string;
  numeroProposta: string;
  dataEmissao: string;
  validadeDias: number;
  prazoEntregaDias: number;
  condicoesPagamento: string;
  garantiaMeses: number;
  itens: ItemLicitacao[];
  valorTotal: number;
  observacoesFinais: string;
  responsavelNome: string;
  responsavelCargo: string;
  status: 'rascunho' | 'emitida' | 'homologada';
}

export interface ParametrosTributarios {
  impostosPadraoPct: number;
  despesasPadraoPct: number;
  riscoPadraoPct: number;
  margemMinimaPadraoPct: number;
  margemDesejadaPadraoPct: number;
  regimeTributario: 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real';
  metodoCalculo: 'divisor' | 'markup'; // divisor: Preço = Custo / (1 - taxas%)
}

export interface ParametrosConfig extends ParametrosTributarios {
  empresaRazaoSocial: string;
  empresaNomeFantasia: string;
  empresaCnpj: string;
  empresaEndereco: string;
  empresaEmail: string;
  empresaTelefone: string;
  alertaDiasAmarelo: number;
  alertaDiasLaranja: number;
}

export interface AlertaNotificacao {
  id: string;
  tipo: 'documento_vencendo' | 'documento_vencido' | 'cotacao_vencendo' | 'licitacao_abertura' | 'margem_baixa';
  titulo: string;
  mensagem: string;
  data: string;
  lido: boolean;
  targetTab: string;
  severidade: 'critico' | 'atencao' | 'info';
}

export interface UsuarioAtivo {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  papel: 'ADMINISTRADOR' | 'COMERCIAL' | 'CONSULTA';
}
