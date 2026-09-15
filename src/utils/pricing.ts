import { Documento, DocumentoStatus, ItemLicitacao, Licitacao } from '../types';

export const CURRENT_DATE_STR = '2026-09-15';

/**
 * Calcula o custo base (fornecedor + frete + taxas)
 */
export function calcularCustoBase(custoFornecedor: number, frete: number = 0, taxas: number = 0): number {
  return Number((custoFornecedor + frete + taxas).toFixed(2));
}

/**
 * Calcula o preço mínimo considerando o modelo tributário de licitações
 * Divisor (Preço = Custo Base / (1 - %Deduções))
 */
export function calcularPrecoMinimo(
  custoBase: number,
  impostosPct: number = 6,
  despesasPct: number = 3,
  riscoPct: number = 2,
  margemDesejadaPct: number = 20,
  metodo: 'divisor' | 'markup' = 'divisor'
): number {
  if (custoBase <= 0) return 0;

  const totalDeducoesPct = impostosPct + despesasPct + riscoPct + margemDesejadaPct;

  if (metodo === 'divisor') {
    const divisor = 1 - (Math.min(totalDeducoesPct, 95) / 100);
    return Number((custoBase / divisor).toFixed(2));
  } else {
    return Number((custoBase * (1 + totalDeducoesPct / 100)).toFixed(2));
  }
}

export interface SimulacaoResultado {
  custoBase: number;
  precoVenda: number;
  impostosReais: number;
  despesasReais: number;
  riscoReais: number;
  lucroEstimadoReais: number;
  margemEfetivaPct: number;
  statusMargem: 'abaixo_minimo' | 'atencao' | 'adequada' | 'acima_objetivo';
  statusTexto: string;
}

/**
 * Simula o resultado financeiro a partir de um preço de venda proposto
 */
export function simularPrecoVenda(
  custoBase: number,
  precoVenda: number,
  impostosPct: number = 6,
  despesasPct: number = 3,
  riscoPct: number = 2,
  margemMinimaPct: number = 15,
  margemDesejadaPct: number = 20
): SimulacaoResultado {
  if (precoVenda <= 0) {
    return {
      custoBase,
      precoVenda: 0,
      impostosReais: 0,
      despesasReais: 0,
      riscoReais: 0,
      lucroEstimadoReais: 0,
      margemEfetivaPct: 0,
      statusMargem: 'abaixo_minimo',
      statusTexto: 'Preço zerado ou inválido',
    };
  }

  const impostosReais = Number((precoVenda * (impostosPct / 100)).toFixed(2));
  const despesasReais = Number((precoVenda * (despesasPct / 100)).toFixed(2));
  const riscoReais = Number((precoVenda * (riscoPct / 100)).toFixed(2));
  const deducoes = impostosReais + despesasReais + riscoReais;
  const lucroEstimadoReais = Number((precoVenda - custoBase - deducoes).toFixed(2));
  const margemEfetivaPct = Number(((lucroEstimadoReais / precoVenda) * 100).toFixed(2));

  let statusMargem: 'abaixo_minimo' | 'atencao' | 'adequada' | 'acima_objetivo' = 'adequada';
  let statusTexto = 'Margem adequada (Dentro da meta)';

  if (margemEfetivaPct < margemMinimaPct) {
    statusMargem = 'abaixo_minimo';
    statusTexto = 'Margem abaixo do mínimo';
  } else if (margemEfetivaPct < margemDesejadaPct) {
    statusMargem = 'atencao';
    statusTexto = 'Margem de atenção';
  } else if (margemEfetivaPct > margemDesejadaPct + 5) {
    statusMargem = 'acima_objetivo';
    statusTexto = 'Margem acima do objetivo';
  }

  return {
    custoBase,
    precoVenda,
    impostosReais,
    despesasReais,
    riscoReais,
    lucroEstimadoReais,
    margemEfetivaPct,
    statusMargem,
    statusTexto,
  };
}

export interface ViabilidadeResultado {
  decisao: 'FAVORAVEL' | 'ATENCAO' | 'NAO_RECOMENDADA';
  rotulo: string;
  cor: string;
  badgeBg: string;
  badgeBorder: string;
  valorEstimadoOrgao: number;
  custoTotalDavenza: number;
  precoMinimoTotal: number;
  precoPropostoTotal: number;
  lucroEstimadoTotal: number;
  margemMediaPct: number;
  diferencaParaEstimado: number;
  diferencaParaEstimadoPct: number;
  capacidadeDocumentalOk: boolean;
  documentosCriticos: string[];
  alertas: string[];
  pontosFortes: string[];
}

/**
 * Análise de viabilidade comercial e jurídica da licitação
 * Cruza: Preço estimado, Custos, Preço Davenza, Margem e Documentação
 */
export function analisarViabilidadeLicitacao(
  licitacao: Licitacao,
  documentosCadastrados: Documento[]
): ViabilidadeResultado {
  const itens = licitacao.itens || [];

  let custoTotalDavenza = 0;
  let precoMinimoTotal = 0;
  let precoPropostoTotal = 0;
  let lucroEstimadoTotal = 0;

  itens.forEach((item) => {
    const qtd = item.quantidade || 1;
    const custoItem = (item.custoUnitario + item.freteTaxasUnitario) * qtd;
    const precoMinItem = item.precoMinimo * qtd;
    const precoPropItem = item.precoProposto * qtd;

    custoTotalDavenza += custoItem;
    precoMinimoTotal += precoMinItem;
    precoPropostoTotal += precoPropItem;
    lucroEstimadoTotal += (item.lucroEstimadoTotal || 0);
  });

  const margemMediaPct = precoPropostoTotal > 0
    ? Number(((lucroEstimadoTotal / precoPropostoTotal) * 100).toFixed(2))
    : 0;

  const valorEstimado = licitacao.valorEstimado || 0;
  const diferencaParaEstimado = Number((valorEstimado - precoPropostoTotal).toFixed(2));
  const diferencaParaEstimadoPct = valorEstimado > 0
    ? Number(((diferencaParaEstimado / valorEstimado) * 100).toFixed(2))
    : 0;

  // Verificação documental
  const documentosCriticos: string[] = [];
  let capacidadeDocumentalOk = true;

  // Documentos essenciais de habilitação fiscal e jurídica
  const docsExigidosIds = licitacao.documentosExigidos || [];
  const docsParaVerificar = docsExigidosIds.length > 0
    ? documentosCadastrados.filter((d) => docsExigidosIds.includes(d.id))
    : documentosCadastrados.filter((d) => d.categoria === 'fiscal' || d.categoria === 'juridico');

  const dataAbertura = new Date(licitacao.dataAbertura || CURRENT_DATE_STR);

  docsParaVerificar.forEach((doc) => {
    const validade = new Date(doc.validade);
    if (doc.status === 'vencido' || validade < dataAbertura) {
      documentosCriticos.push(`${doc.nome} (Vencido ou vence antes da abertura em ${doc.validade})`);
      capacidadeDocumentalOk = false;
    } else if (doc.status === 'alerta_7') {
      documentosCriticos.push(`${doc.nome} (Vence em menos de 7 dias)`);
    }
  });

  const alertas: string[] = [];
  const pontosFortes: string[] = [];

  // Avaliação de Preço vs Estimado
  if (precoMinimoTotal > valorEstimado && valorEstimado > 0) {
    alertas.push(`Preço mínimo da DavenzaTec (R$ ${precoMinimoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) supera o valor de referência do órgão (R$ ${valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).`);
  } else if (precoPropostoTotal <= valorEstimado && valorEstimado > 0) {
    pontosFortes.push(`Preço proposto está R$ ${diferencaParaEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${diferencaParaEstimadoPct}%) abaixo do teto do edital, mantendo competitividade.`);
  }

  // Avaliação de Margem
  if (margemMediaPct < 15) {
    alertas.push(`Margem média calculada (${margemMediaPct}%) está abaixo do patamar mínimo desejado de 15%.`);
  } else if (margemMediaPct >= 20) {
    pontosFortes.push(`Excelente margem operacional projetada de ${margemMediaPct}%, gerando R$ ${lucroEstimadoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de lucro líquido.`);
  } else {
    pontosFortes.push(`Margem média viável de ${margemMediaPct}%.`);
  }

  // Avaliação Documental
  if (documentosCriticos.length > 0) {
    alertas.push(`Atenção documental: ${documentosCriticos.length} documento(s) com pendência ou vencimento próximo.`);
  } else {
    pontosFortes.push('Documentação de habilitação 100% válida e em conformidade.');
  }

  if (itens.length === 0) {
    alertas.push('Licitação ainda sem itens cadastrados ou precificados.');
  }

  // Conclusão
  let decisao: 'FAVORAVEL' | 'ATENCAO' | 'NAO_RECOMENDADA' = 'FAVORAVEL';
  let rotulo = '🟢 FAVORÁVEL (PARTICIPAR)';
  let cor = 'text-emerald-700 dark:text-emerald-400';
  let badgeBg = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
  let badgeBorder = 'border-emerald-300 dark:border-emerald-800';

  if ((precoMinimoTotal > valorEstimado && valorEstimado > 0) || !capacidadeDocumentalOk || margemMediaPct < 10) {
    decisao = 'NAO_RECOMENDADA';
    rotulo = '🔴 NÃO RECOMENDADA';
    cor = 'text-rose-700 dark:text-rose-400';
    badgeBg = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300';
    badgeBorder = 'border-rose-300 dark:border-rose-800';
  } else if (margemMediaPct < 18 || documentosCriticos.length > 0 || diferencaParaEstimadoPct < 3) {
    decisao = 'ATENCAO';
    rotulo = '🟡 PARTICIPAR COM ATENÇÃO';
    cor = 'text-amber-700 dark:text-amber-400';
    badgeBg = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300';
    badgeBorder = 'border-amber-300 dark:border-amber-800';
  }

  return {
    decisao,
    rotulo,
    cor,
    badgeBg,
    badgeBorder,
    valorEstimadoOrgao: valorEstimado,
    custoTotalDavenza,
    precoMinimoTotal,
    precoPropostoTotal,
    lucroEstimadoTotal,
    margemMediaPct,
    diferencaParaEstimado,
    diferencaParaEstimadoPct,
    capacidadeDocumentalOk,
    documentosCriticos,
    alertas,
    pontosFortes,
  };
}

/**
 * Calcula o status de validade do documento em relação à data atual
 */
export function calcularStatusDocumento(validadeStr: string, dataBaseStr: string = CURRENT_DATE_STR): {
  status: DocumentoStatus;
  diasRestantes: number;
  diasParaVencer: number;
  texto: string;
} {
  const dataValidade = new Date(validadeStr);
  const dataBase = new Date(dataBaseStr);

  const diffTime = dataValidade.getTime() - dataBase.getTime();
  const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diasRestantes < 0) {
    return {
      status: 'vencido',
      diasRestantes,
      diasParaVencer: diasRestantes,
      texto: `Vencido há ${Math.abs(diasRestantes)} dia(s)`,
    };
  }

  if (diasRestantes <= 7) {
    return {
      status: 'alerta_7',
      diasRestantes,
      diasParaVencer: diasRestantes,
      texto: `Vence em ${diasRestantes} dia(s) (Crítico)`,
    };
  }

  if (diasRestantes <= 30) {
    return {
      status: 'alerta_30',
      diasRestantes,
      diasParaVencer: diasRestantes,
      texto: `Vence em ${diasRestantes} dias`,
    };
  }

  return {
    status: 'valido',
    diasRestantes,
    diasParaVencer: diasRestantes,
    texto: `Válido (${diasRestantes} dias restantes)`,
  };
}

/**
 * Formata moeda BRL
 */
export function formatarMoeda(valor: number = 0): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata percentual
 */
export function formatarPct(valor: number = 0): string {
  return `${valor.toFixed(1).replace('.', ',')}%`;
}

/**
 * Formata data ISO para DD/MM/AAAA
 */
export function formatarData(dataStr?: string): string {
  if (!dataStr) return '-';
  const partes = dataStr.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataStr;
}
