import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { ApiError } from '../services/api';
import { pontosService } from '../services/pontosService';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

function DetalhePonto({ ponto }: { ponto: Ponto }) {
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
    </ScrollView>
  );
}

export default function TelaDetalhePonto({ route }: Props) {
  const { pontoId } = route.params;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState('');

  useEffect(() => {
    let telaAtiva = true;

    async function carregarPonto() {
      setCarregando(true);
      setMensagemErro('');
      try {
        const resultado = await pontosService.buscarPorId(pontoId);
        if (telaAtiva) {
          setPonto(resultado);
        }
      } catch (error) {
        if (telaAtiva) {
          if (error instanceof ApiError && error.status === 404) {
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
  }, [pontoId]);

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

  return <DetalhePonto ponto={ponto} />;
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
});
