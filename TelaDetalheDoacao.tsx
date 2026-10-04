import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doacoesStorage } from './src/services/doacoesStorage';

type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
  criadoEm: string;
};

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  Cadastro: undefined;
  Historico: undefined;
  DetalheDoacao: { doacao: Doacao };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

export default function TelaDetalheDoacao({ route, navigation }: Props) {
  const { doacao } = route.params;
  const [excluindo, setExcluindo] = useState(false);
  const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');
  const dataRegistro = new Date(doacao.criadoEm);
  const dataFormatada = Number.isNaN(dataRegistro.getTime())
    ? doacao.criadoEm
    : dataRegistro.toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const abrirConfirmacao = () => {
    setErroExclusao('');
    setConfirmacaoVisivel(true);
  };

  const excluirDoacao = async () => {
    if (excluindo) {
      return;
    }

    setExcluindo(true);
    try {
      await doacoesStorage.excluirDoacao(doacao.id);
      setConfirmacaoVisivel(false);
      navigation.goBack();
    } catch {
      setExcluindo(false);
      setErroExclusao('Não foi possível excluir a doação. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{doacao.tipoItem}</Text>
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Identificador</Text>
          <Text style={styles.valor}>{doacao.id}</Text>
        </View>
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Tipo do item</Text>
          <Text style={styles.valor}>{doacao.tipoItem}</Text>
        </View>
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Quantidade</Text>
          <Text style={styles.valor}>{doacao.quantidade}</Text>
        </View>
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Ponto de destino</Text>
          <Text style={styles.valor}>{doacao.pontoDestino}</Text>
        </View>
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Data do registro</Text>
          <Text style={styles.valor}>{dataFormatada}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
        onPress={abrirConfirmacao}
        disabled={excluindo}
        activeOpacity={0.85}
        accessibilityRole="button"
      >
        {excluindo ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.textoBotaoExcluir}>Excluir doação</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={confirmacaoVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!excluindo) {
            setConfirmacaoVisivel(false);
          }
        }}
      >
        <View style={styles.fundoModal}>
          <View
            style={styles.dialogo}
            accessibilityRole="alert"
            accessibilityLabel="Confirmação de exclusão"
          >
            <Text style={styles.tituloDialogo}>
              {erroExclusao ? 'Erro ao excluir doação' : 'Excluir doação?'}
            </Text>
            <Text style={styles.mensagemDialogo}>
              {erroExclusao ||
                'Tem certeza de que deseja excluir esta doação? Esta ação não pode ser desfeita.'}
            </Text>
            <View style={styles.acoesDialogo}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => {
                  setConfirmacaoVisivel(false);
                  setErroExclusao('');
                }}
                disabled={excluindo}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={styles.textoCancelar}>
                  {erroExclusao ? 'Fechar' : 'Cancelar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.botaoConfirmar,
                  excluindo && styles.botaoDesabilitado,
                ]}
                onPress={() => void excluirDoacao()}
                disabled={excluindo}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                {excluindo ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.textoBotaoConfirmar}>
                    {erroExclusao ? 'Tentar novamente' : 'Excluir'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4EBF5',
    padding: 18,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2B4C',
    marginBottom: 18,
  },
  campo: {
    marginBottom: 16,
  },
  rotulo: {
    color: '#6E82A8',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  valor: {
    color: '#2C3E50',
    fontSize: 16,
    lineHeight: 23,
  },
  botaoExcluir: {
    minHeight: 48,
    backgroundColor: '#B42318',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoExcluir: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogo: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
  },
  tituloDialogo: {
    color: '#1A2B4C',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  mensagemDialogo: {
    color: '#40516A',
    fontSize: 15,
    lineHeight: 22,
  },
  acoesDialogo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: 22,
    gap: 10,
  },
  botaoCancelar: {
    minHeight: 48,
    minWidth: 96,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCancelar: {
    color: '#40516A',
    fontSize: 15,
    fontWeight: '700',
  },
  botaoConfirmar: {
    minHeight: 48,
    minWidth: 96,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#B42318',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoConfirmar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
