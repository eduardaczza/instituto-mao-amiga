import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Doacao, NovaDoacao } from '../types/doacao';

const STORAGE_KEY = '@mao_amiga:doacoes';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseDoacao(value: unknown): Doacao {
  if (!isRecord(value)) {
    throw new Error('Uma doação salva possui formato inválido.');
  }

  const { id, tipoItem, quantidade, pontoDestino, criadoEm } = value;
  const quantidadeNumerica =
    typeof quantidade === 'number' ? quantidade : Number(quantidade);

  if (
    typeof id !== 'string' ||
    typeof tipoItem !== 'string' ||
    !Number.isFinite(quantidadeNumerica) ||
    typeof pontoDestino !== 'string' ||
    typeof criadoEm !== 'string'
  ) {
    throw new Error('Uma doação salva possui campos inválidos.');
  }

  return {
    id,
    tipoItem,
    quantidade: quantidadeNumerica,
    pontoDestino,
    criadoEm,
  };
}

async function listarDoacoes(): Promise<Doacao[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json === null) {
      return [];
    }

    const decoded: unknown = JSON.parse(json);
    if (!Array.isArray(decoded)) {
      throw new Error('O conteúdo salvo para doações não é uma lista.');
    }

    return decoded.map(parseDoacao);
  } catch (error) {
    console.error('Erro ao ler doações', error);
    throw error;
  }
}

async function salvarDoacao(novaDoacao: NovaDoacao): Promise<Doacao> {
  try {
    const doacoes = await listarDoacoes();
    const idBase = String(Date.now());
    let id = idBase;
    let sufixo = 1;

    while (doacoes.some((doacao) => doacao.id === id)) {
      id = `${idBase}-${sufixo}`;
      sufixo += 1;
    }

    const itemComId: Doacao = {
      ...novaDoacao,
      id,
      criadoEm: new Date().toISOString(),
    };
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([itemComId, ...doacoes])
    );
    return itemComId;
  } catch (error) {
    console.error('Erro ao salvar doação', error);
    throw error;
  }
}

async function atualizarDoacao(doacaoEditada: Doacao): Promise<void> {
  try {
    const doacoes = await listarDoacoes();
    const listaAtualizada = doacoes.map((doacao) =>
      doacao.id === doacaoEditada.id ? doacaoEditada : doacao
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
  } catch (error) {
    console.error('Erro ao atualizar doação', error);
    throw error;
  }
}

async function excluirDoacao(id: string): Promise<void> {
  try {
    const doacoes = await listarDoacoes();
    const listaAtualizada = doacoes.filter((doacao) => doacao.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
  } catch (error) {
    console.error('Erro ao excluir doação', error);
    throw error;
  }
}

export const doacoesStorage = {
  listarDoacoes,
  salvarDoacao,
  atualizarDoacao,
  excluirDoacao,
};
