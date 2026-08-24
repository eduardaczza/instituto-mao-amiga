import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pontosMock, type Ponto } from './TelaListaPontos';

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

function DetalhePonto({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.rotulo}>Endereço</Text>
      <Text style={styles.texto}>{ponto.endereco}</Text>
      <Text style={styles.rotulo}>Dias e horários</Text>
      <Text style={styles.texto}>{ponto.diasHorarios}</Text>
      <Text style={styles.rotulo}>Recebe / distribui</Text>
      <Text style={styles.texto}>{ponto.recebeDistribui}</Text>
    </View>
  );
}

export default function TelaDetalhePonto({ route }: Props) {
  const { pontoId } = route.params;
  const ponto = pontosMock.find((p) => p.id === pontoId);

  if (!ponto) {
    return (
      <View style={styles.container}>
        <Text>Ponto não encontrado.</Text>
      </View>
    );
  }

  return <DetalhePonto ponto={ponto} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    marginTop: 12,
  },
  texto: {
    fontSize: 16,
    color: '#333333',
    marginTop: 4,
  },
});
