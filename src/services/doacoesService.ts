import { del, get, post, put } from './api';
import type { Doacao, NovaDoacao } from '../types/doacao';

export type PaginaDoacoes = {
  content: Doacao[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

function criarQuery(filtro: string, page: number, size: number): string {
  const parametros = `page=${page}&size=${size}&sort=criadoEm%2Cdesc`;
  const tipoItem = filtro.trim();
  return tipoItem
    ? `${parametros}&tipoItem=${encodeURIComponent(tipoItem)}`
    : parametros;
}

export const doacoesService = {
  listarPagina(
    filtro = '',
    page = 0,
    size = 10
  ): Promise<PaginaDoacoes> {
    return get<PaginaDoacoes>(
      `/api/v1/doacoes?${criarQuery(filtro, page, size)}`
    );
  },

  buscarPorId(id: string): Promise<Doacao> {
    return get<Doacao>(`/api/v1/doacoes/${encodeURIComponent(id)}`);
  },

  cadastrar(doacao: NovaDoacao): Promise<Doacao> {
    return post<Doacao>('/api/v1/doacoes', doacao);
  },

  editar(id: string, doacao: NovaDoacao): Promise<Doacao> {
    return put<Doacao>(`/api/v1/doacoes/${encodeURIComponent(id)}`, doacao);
  },

  excluir(id: string): Promise<void> {
    return del<void>(`/api/v1/doacoes/${encodeURIComponent(id)}`);
  },
};
