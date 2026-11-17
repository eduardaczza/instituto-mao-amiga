import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doacoesService } from '../services/doacoesService';
import type { RootStackParamList } from '../navigation/types';
import type { Doacao } from '../types/doacao';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

function statusDoErro(error: unknown): number | undefined {
  if (error instanceof Error && 'status' in error) {
    return typeof error.status === 'number' ? error.status : undefined;
  }
  return undefined;
}

export default function TelaDetalheDoacao({ route, navigation }: Props) {
  const { id } = route.params;
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [tentativa, setTentativa] = useState(0);
  const [statusErro, setStatusErro] = useState<number>();
  const [excluindo, setExcluindo] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;

      async function atualizarDoacao() {
        setCarregando(true);
        setStatusErro(undefined);
        try {
          const doacaoAtualizada = await doacoesService.buscarPorId(id);
          if (telaAtiva) {
            setDoacao(doacaoAtualizada);
          }
        } catch (error) {
          if (telaAtiva) {
            const status = statusDoErro(error);
            setStatusErro(status);
            if (status === 404) {
              setDoacao(null);
            }
          }
        } finally {
          if (telaAtiva) {
            setCarregando(false);
          }
        }
      }

      void atualizarDoacao();
      return () => {
        telaAtiva = false;
      };
    }, [id, tentativa])
  );

  const excluirDoacao = async () => {
    if (excluindo) {
      return;
    }

    setExcluindo(true);
    try {
      await doacoesService.excluir(id);
      navigation.goBack();
    } catch (error) {
      const status = statusDoErro(error);
      Alert.alert(
        status === 0 ? 'API indisponível' : 'Não foi possível excluir',
        status === 0
          ? 'Não foi possível conectar à API. A doação não foi excluída.'
          : 'Ocorreu um erro ao excluir a doação. Tente novamente.'
      );
    } finally {
      setExcluindo(false);
    }
  };

  const confirmarExclusao = () => {
    Alert.alert(
      'Excluir doação?',
      'Tem certeza de que deseja excluir esta doação? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => void excluirDoacao(),
        },
      ]
    );
  };

  const dataRegistro = doacao ? new Date(doacao.criadoEm) : null;
  const dataFormatada =
    dataRegistro && doacao
      ? Number.isNaN(dataRegistro.getTime())
        ? doacao.criadoEm
        : dataRegistro.toLocaleString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
      : '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      {carregando && !doacao ? (
        <View style={styles.estado}>
          <ActivityIndicator size="large" color="#1A2B4C" />
          <Text style={styles.mensagemEstado}>Carregando doação...</Text>
        </View>
      ) : statusErro === 404 ? (
        <View style={styles.estado}>
          <Text style={styles.mensagemErro}>Doação não encontrada.</Text>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
          >
            <Text style={styles.textoBotaoVoltar}>Voltar ao histórico</Text>
          </TouchableOpacity>
        </View>
      ) : doacao ? (
        <>
          {statusErro !== undefined && (
            <Text style={styles.erroCarregamento}>
              Não foi possível atualizar os dados da doação. Verifique a conexão com a API.
            </Text>
          )}
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
            style={styles.botaoEditar}
            onPress={() => navigation.navigate('EditarDoacao', { id })}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Text style={styles.textoBotaoEditar}>Editar doação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
            onPress={confirmarExclusao}
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
        </>
      ) : (
        <View style={styles.estado}>
          <Text style={styles.mensagemErro}>
            Não foi possível carregar a doação. Verifique se a API está em execução.
          </Text>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => setTentativa((atual) => atual + 1)}
            accessibilityRole="button"
          >
            <Text style={styles.textoBotaoVoltar}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  conteudo: {
    padding: 20,
    paddingBottom: 32,
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
  erroCarregamento: {
    color: '#B42318',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 21,
  },
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mensagemEstado: {
    color: '#5A6B82',
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
  },
  mensagemErro: {
    color: '#B42318',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 18,
  },
  botaoVoltar: {
    minHeight: 48,
    backgroundColor: '#1A2B4C',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  textoBotaoVoltar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  botaoEditar: {
    minHeight: 48,
    backgroundColor: '#1A2B4C',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  textoBotaoEditar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
