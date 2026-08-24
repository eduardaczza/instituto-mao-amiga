import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pontosMock, type Ponto } from './TelaListaPontos';

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
};

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
  const ponto = pontosMock.find((p) => p.id === pontoId);

  if (!ponto) {
    return (
      <View style={styles.containerError}>
        <Text style={styles.textoErro}>⚠️ Ponto não encontrado.</Text>
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
    backgroundColor: '#F5F7FA',
  },
  textoErro: {
    fontSize: 16,
    color: '#888888',
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
    shadowColor: '#1A2B4C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
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