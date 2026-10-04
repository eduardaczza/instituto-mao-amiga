import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Historico'>;

const DoacaoItem = React.memo(function DoacaoItem({
  doacao,
  onPress,
}: {
  doacao: Doacao;
  onPress: () => void;
}) {
  const dataFormatada = new Date(doacao.criadoEm).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes da doação de ${doacao.tipoItem}`}
    >
      <Text style={styles.tipoItem}>{doacao.tipoItem}</Text>
      <Text style={styles.informacao}>
        Quantidade: {doacao.quantidade}
      </Text>
      <Text style={styles.informacao}>
        Ponto de destino: {doacao.pontoDestino}
      </Text>
      <Text style={styles.data}>Registrada em {dataFormatada}</Text>
    </TouchableOpacity>
  );
});

export default function TelaHistoricoDoacoes({ navigation }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;

      async function carregarDoacoes() {
        setCarregando(true);
        setErro(false);

        try {
          const lista = await doacoesStorage.listarDoacoes();
          if (telaAtiva) {
            setDoacoes(lista);
          }
        } catch {
          if (telaAtiva) {
            setErro(true);
          }
        } finally {
          if (telaAtiva) {
            setCarregando(false);
          }
        }
      }

      carregarDoacoes();
      return () => {
        telaAtiva = false;
      };
    }, [tentativa])
  );

  const cadastrarDoacao = () => navigation.navigate('Cadastro');

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[
        styles.conteudo,
        doacoes.length === 0 && styles.conteudoVazio,
      ]}
      data={doacoes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DoacaoItem
          doacao={item}
          onPress={() => navigation.navigate('DetalheDoacao', { doacao: item })}
        />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.titulo}>Minhas doações</Text>
          <Text style={styles.subtitulo}>
            Consulte os registros feitos para os pontos de coleta.
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.estadoVazio}>
          {carregando ? (
            <>
              <ActivityIndicator size="large" color="#1A2B4C" />
              <Text style={styles.mensagem}>Carregando doações...</Text>
            </>
          ) : erro ? (
            <>
              <Text style={styles.mensagemErro}>
                Não foi possível carregar suas doações.
              </Text>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => setTentativa((atual) => atual + 1)}
                activeOpacity={0.9}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotao}>Tentar novamente</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.mensagem}>Você ainda não registrou doações.</Text>
              <TouchableOpacity
                style={styles.botao}
                onPress={cadastrarDoacao}
                activeOpacity={0.9}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotao}>Registrar doação</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      }
    />
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
  conteudoVazio: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E4EBF5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2B4C',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#5A6B82',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E4EBF5',
  },
  tipoItem: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2B4C',
    marginBottom: 8,
  },
  informacao: {
    fontSize: 14,
    color: '#40516A',
    lineHeight: 21,
  },
  data: {
    fontSize: 12,
    color: '#6E82A8',
    marginTop: 10,
  },
  estadoVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 48,
  },
  mensagem: {
    fontSize: 16,
    color: '#5A6B82',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 18,
  },
  mensagemErro: {
    fontSize: 16,
    color: '#5A6B82',
    textAlign: 'center',
    marginBottom: 18,
  },
  botao: {
    backgroundColor: '#1A2B4C',
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
