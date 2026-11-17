import { useCallback, useState } from 'react';
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
import type { RootStackParamList } from '../navigation/types';
import { pontosService } from '../services/pontosService';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

function DetalhePonto({
  ponto,
  excluindo,
  onEditar,
  onExcluir,
}: {
  ponto: Ponto;
  excluindo: boolean;
  onEditar: () => void;
  onExcluir: () => void;
}) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.nome}>{ponto.nome}</Text>

      <View style={styles.cardInfo}>
        <Text style={styles.rotulo}>📍 Endereço</Text>
        <Text style={styles.texto}>{ponto.endereco}</Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.rotulo}>⏰ Dias e Horários</Text>
        <Text style={styles.texto}>{ponto.diasHorarios}</Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.rotulo}>🤝 Recebe / Distribui</Text>
        <Text style={styles.texto}>{ponto.recebeDistribui}</Text>
      </View>

      <TouchableOpacity
        style={styles.botaoEditar}
        onPress={onEditar}
        activeOpacity={0.85}
        accessibilityRole="button"
      >
        <Text style={styles.textoBotaoEditar}>Editar ponto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
        onPress={onExcluir}
        disabled={excluindo}
        activeOpacity={0.85}
        accessibilityRole="button"
      >
        {excluindo ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.textoBotaoExcluir}>Excluir ponto</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function TelaDetalhePonto({ route, navigation }: Props) {
  const { id } = route.params;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;

      async function carregarPonto() {
        setCarregando(true);
        setMensagemErro('');
        try {
          const resultado = await pontosService.buscarPorId(id);
          if (telaAtiva) {
            setPonto(resultado);
          }
        } catch (error) {
          if (telaAtiva) {
            if (
              error instanceof Error &&
              'status' in error &&
              error.status === 404
            ) {
              setMensagemErro('Ponto não encontrado.');
            } else {
              setMensagemErro(
                'Não foi possível carregar este ponto. Verifique a conexão com a API.'
              );
            }
          }
        } finally {
          if (telaAtiva) {
            setCarregando(false);
          }
        }
      }

      void carregarPonto();
      return () => {
        telaAtiva = false;
      };
    }, [id])
  );

  const excluirPonto = async () => {
    setExcluindo(true);
    try {
      await pontosService.excluir(id);
      navigation.goBack();
    } catch {
      setExcluindo(false);
      Alert.alert(
        'Não foi possível excluir',
        'O ponto não foi removido. Verifique se a API está em execução e tente novamente.'
      );
    }
  };

  const confirmarExclusao = () => {
    Alert.alert(
      'Excluir ponto',
      'Tem certeza de que deseja excluir este ponto de coleta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => void excluirPonto(),
        },
      ]
    );
  };

  if (carregando) {
    return (
      <View style={styles.containerError}>
        <ActivityIndicator size="large" color="#1A2B4C" />
        <Text style={styles.textoErro}>Carregando ponto...</Text>
      </View>
    );
  }

  if (mensagemErro || !ponto) {
    return (
      <View style={styles.containerError}>
        <Text style={styles.textoErro}>
          {mensagemErro || 'Ponto não encontrado.'}
        </Text>
      </View>
    );
  }

  return (
    <DetalhePonto
      ponto={ponto}
      excluindo={excluindo}
      onEditar={() => navigation.navigate('FormularioPonto', { id })}
      onExcluir={confirmarExclusao}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: 20,
  },
  containerError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA',
  },
  textoErro: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 12,
  },
  nome: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2B4C',
    marginBottom: 20,
    lineHeight: 30,
  },
  cardInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(26, 43, 76, 0.05)',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A6B82',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  texto: {
    fontSize: 15,
    color: '#2C3E50',
    lineHeight: 22,
  },
  botaoEditar: {
    minHeight: 48,
    backgroundColor: '#1A2B4C',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  textoBotaoEditar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  botaoExcluir: {
    minHeight: 48,
    backgroundColor: '#B42318',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
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
});
