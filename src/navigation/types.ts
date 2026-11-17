import type { Doacao } from '../types/doacao';

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { id: string };
  Cadastro: undefined;
  Historico: undefined;
  DetalheDoacao: { doacao: Doacao };
  EditarDoacao: { doacao: Doacao };
};
