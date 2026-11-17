import type { Doacao } from '../types/doacao';

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { id: string };
  FormularioPonto: { id?: string } | undefined;
  Cadastro: undefined;
  Historico: undefined;
  DetalheDoacao: { doacao: Doacao };
  EditarDoacao: { doacao: Doacao };
};
