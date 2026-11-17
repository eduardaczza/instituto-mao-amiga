import { del, get, post, put } from './api';
import type { Ponto } from '../types/ponto';

export type Pagina<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type PontoCadastro = {
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: string;
};

type PontoCrud = PontoCadastro & {
  id: string;
};

function criarQuery(page: number, size: number, filtro = ''): string {
  const parametros = `page=${page}&size=${size}&sort=nome%2Casc`;
  return filtro ? `${parametros}&nome=${encodeURIComponent(filtro)}` : parametros;
}

export const pontosService = {
  listar(page = 0, size = 20): Promise<Pagina<Ponto>> {
    return get<Pagina<Ponto>>(`/pontos?${criarQuery(page, size)}`);
  },

  buscarPagina(
    filtro: string,
    page = 0,
    size = 20
  ): Promise<Pagina<Ponto>> {
    return get<Pagina<Ponto>>(
      `/pontos?${criarQuery(page, size, filtro.trim())}`
    );
  },

  buscarPorId(id: string): Promise<Ponto> {
    return get<Ponto>(`/pontos/${encodeURIComponent(id)}`);
  },

  cadastrar(ponto: PontoCadastro): Promise<PontoCrud> {
    return post<PontoCrud>('/api/v1/pontos', ponto);
  },

  editar(id: string, ponto: PontoCadastro): Promise<PontoCrud> {
    return put<PontoCrud>(`/api/v1/pontos/${encodeURIComponent(id)}`, ponto);
  },

  excluir(id: string): Promise<void> {
    return del<void>(`/api/v1/pontos/${encodeURIComponent(id)}`);
  },
};
