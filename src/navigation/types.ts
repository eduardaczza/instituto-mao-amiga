import type { Doacao } from '../types/doacao';

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  Cadastro: undefined;
  Historico: undefined;
  DetalheDoacao: { doacao: Doacao };
  EditarDoacao: { doacao: Doacao };
};
