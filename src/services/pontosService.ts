import { api } from './api';
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

export const pontosService = {
  listar(page = 0, size = 20): Promise<Pagina<Ponto>> {
    return api.get<Pagina<Ponto>>(
      `/pontos?page=${page}&size=${size}&sort=nome%2Casc`
    );
  },

  buscarPorId(id: string): Promise<Ponto> {
    return api.get<Ponto>(`/pontos/${encodeURIComponent(id)}`);
  },
};
