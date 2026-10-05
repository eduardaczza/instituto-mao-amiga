import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doacoesStorage } from '../services/doacoesStorage';

type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
  criadoEm: string;
};

type TotalPorTipo = {
  tipoItem: string;
  quantidadeTotal: number;
  numeroDoacoes: number;
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
  const [buscaTipoItem, setBuscaTipoItem] = useState('');
  const [campoBuscaFocado, setCampoBuscaFocado] = useState(false);

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
  const termoBusca = buscaTipoItem.trim().toLocaleLowerCase('pt-BR');
  const doacoesFiltradas = doacoes.filter((doacao) =>
    doacao.tipoItem.toLocaleLowerCase('pt-BR').includes(termoBusca)
  );
  const totaisPorTipo = Object.values(
    doacoes.reduce<Record<string, TotalPorTipo>>((totais, doacao) => {
      const chave = doacao.tipoItem.trim().toLocaleLowerCase('pt-BR');
      const quantidade = Number(doacao.quantidade);
      const quantidadeValida = Number.isFinite(quantidade) ? quantidade : 0;

      if (!totais[chave]) {
        totais[chave] = {
          tipoItem: doacao.tipoItem.trim(),
          quantidadeTotal: 0,
          numeroDoacoes: 0,
        };
      }

      totais[chave].quantidadeTotal += quantidadeValida;
      totais[chave].numeroDoacoes += 1;
      return totais;
    }, {})
  ).sort((a, b) => b.quantidadeTotal - a.quantidadeTotal);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        style={styles.container}
        contentContainerStyle={[
          styles.conteudo,
          doacoesFiltradas.length === 0 && styles.conteudoVazio,
        ]}
        data={doacoesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoacaoItem
            doacao={item}
            onPress={() =>
              navigation.navigate('DetalheDoacao', { doacao: item })
            }
          />
        )}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.titulo}>Minhas doações</Text>
              <Text style={styles.subtitulo}>
                Consulte os registros feitos para os pontos de coleta.
              </Text>
            </View>
            <View style={styles.resumo}>
              <Text style={styles.tituloResumo}>Resumo das doações</Text>
              {carregando ? (
                <Text style={styles.textoResumo}>Carregando totais...</Text>
              ) : erro ? (
                <Text style={styles.textoResumoErro}>
                  Não foi possível carregar o resumo.
                </Text>
              ) : doacoes.length === 0 ? (
                <Text style={styles.textoResumo}>
                  Nenhuma doação registrada para resumir.
                </Text>
              ) : (
                <>
                  <Text style={styles.totalDoacoes}>
                    Total: {doacoes.length}{' '}
                    {doacoes.length === 1 ? 'doação' : 'doações'}
                  </Text>
                  {totaisPorTipo.map((total) => (
                    <Text
                      key={total.tipoItem.toLocaleLowerCase('pt-BR')}
                      style={styles.linhaResumo}
                    >
                      {total.tipoItem}: {total.quantidadeTotal}{' '}
                      {total.quantidadeTotal === 1 ? 'unidade' : 'unidades'} em{' '}
                      {total.numeroDoacoes}{' '}
                      {total.numeroDoacoes === 1 ? 'doação' : 'doações'}
                    </Text>
                  ))}
                </>
              )}
            </View>
            <View
              style={[
                styles.buscaContainer,
                campoBuscaFocado && styles.buscaContainerFocado,
              ]}
            >
              <TextInput
                style={styles.campoBusca}
                value={buscaTipoItem}
                onChangeText={setBuscaTipoItem}
                onFocus={() => setCampoBuscaFocado(true)}
                onBlur={() => setCampoBuscaFocado(false)}
                placeholder="Buscar por tipo de item"
                placeholderTextColor="#7A8798"
                returnKeyType="search"
                accessibilityLabel="Buscar doações por tipo de item"
              />
              {buscaTipoItem.length > 0 && (
                <TouchableOpacity
                  style={styles.botaoLimparBusca}
                  onPress={() => setBuscaTipoItem('')}
                  accessibilityRole="button"
                  accessibilityLabel="Limpar busca"
                >
                  <Text style={styles.textoLimparBusca}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>
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
            ) : termoBusca ? (
              <Text style={styles.mensagem}>
                Nenhuma doação encontrada para “{buscaTipoItem.trim()}”.
              </Text>
            ) : (
              <>
                <Text style={styles.mensagem}>
                  Você ainda não registrou doações.
                </Text>
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
    </KeyboardAvoidingView>
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
  resumo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E4EBF5',
  },
  tituloResumo: {
    color: '#1A2B4C',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  totalDoacoes: {
    color: '#40516A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  linhaResumo: {
    color: '#40516A',
    fontSize: 14,
    lineHeight: 21,
  },
  textoResumo: {
    color: '#5A6B82',
    fontSize: 14,
    lineHeight: 20,
  },
  textoResumoErro: {
    color: '#B42318',
    fontSize: 14,
    lineHeight: 20,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    paddingHorizontal: 14,
    minHeight: 48,
    marginBottom: 18,
  },
  buscaContainerFocado: {
    borderColor: '#6E82A8',
  },
  campoBusca: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 10,
    color: '#1A2B4C',
    fontSize: 15,
  },
  botaoLimparBusca: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  textoLimparBusca: {
    color: '#1A2B4C',
    fontSize: 14,
    fontWeight: '700',
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
