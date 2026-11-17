import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { pontosService } from '../services/pontosService';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'Lista'>;

function PontoItem({
  ponto,
  onPress,
}: {
  ponto: Ponto;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardBadge}>Ativo</Text>
      </View>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.endereco}>📍 {ponto.endereco}</Text>
    </TouchableOpacity>
  );
}

export default function TelaListaPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState('');
  const [totalPontos, setTotalPontos] = useState(0);
  const [tentativa, setTentativa] = useState(0);
  const sequenciaRequisicao = useRef(0);
  const paginaAtual = useRef(-1);
  const totalPaginas = useRef(0);
  const filtroAplicado = useRef('');
  const carregandoRef = useRef(true);
  const paginaEmAndamento = useRef<{ sequencia: number; pagina: number } | null>(
    null
  );

  const carregarPrimeiraPagina = useCallback(async (filtro: string) => {
    const sequencia = ++sequenciaRequisicao.current;
    paginaAtual.current = -1;
    totalPaginas.current = 0;
    paginaEmAndamento.current = null;
    carregandoRef.current = true;
    setPontos([]);
    setCarregando(true);
    setCarregandoMais(false);
    setErro('');
    setTotalPontos(0);

    try {
      const resposta = filtro
        ? await pontosService.buscarPagina(filtro, 0)
        : await pontosService.listar(0);
      if (sequencia === sequenciaRequisicao.current) {
        setPontos(resposta.content);
        paginaAtual.current = resposta.page.number;
        totalPaginas.current = resposta.page.totalPages;
        setTotalPontos(resposta.page.totalElements);
      }
    } catch {
      if (sequencia === sequenciaRequisicao.current) {
        setErro(
          'Não foi possível carregar os pontos. Verifique se a API está em execução e tente novamente.'
        );
      }
    } finally {
      if (sequencia === sequenciaRequisicao.current) {
        carregandoRef.current = false;
        setCarregando(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregarPrimeiraPagina(filtroAplicado.current);
    }, [carregarPrimeiraPagina, tentativa])
  );

  useEffect(() => {
    const filtro = busca.trim();
    if (filtro === filtroAplicado.current) {
      return;
    }

    const temporizador = setTimeout(() => {
      filtroAplicado.current = filtro;
      void carregarPrimeiraPagina(filtro);
    }, 350);

    return () => clearTimeout(temporizador);
  }, [busca, carregarPrimeiraPagina]);

  const carregarProximaPagina = async (repetir = false) => {
    const sequencia = sequenciaRequisicao.current;
    const proximaPagina = paginaAtual.current + 1;
    const paginaSolicitada = paginaEmAndamento.current;
    if (
      carregandoRef.current ||
      (paginaSolicitada?.sequencia === sequencia &&
        paginaSolicitada.pagina === proximaPagina) ||
      (erro !== '' && !repetir) ||
      proximaPagina >= totalPaginas.current
    ) {
      return;
    }

    paginaEmAndamento.current = { sequencia, pagina: proximaPagina };
    setCarregandoMais(true);
    try {
      const filtro = filtroAplicado.current;
      const resposta = filtro
        ? await pontosService.buscarPagina(filtro, proximaPagina)
        : await pontosService.listar(proximaPagina);
      if (sequencia === sequenciaRequisicao.current) {
        setPontos((atuais) => {
          const idsExistentes = new Set(atuais.map((ponto) => ponto.id));
          return [
            ...atuais,
            ...resposta.content.filter((ponto) => !idsExistentes.has(ponto.id)),
          ];
        });
        paginaAtual.current = resposta.page.number;
        totalPaginas.current = resposta.page.totalPages;
        setTotalPontos(resposta.page.totalElements);
        setErro('');
      }
    } catch {
      if (sequencia === sequenciaRequisicao.current) {
        setErro('Não foi possível carregar mais pontos.');
      }
    } finally {
      if (sequencia === sequenciaRequisicao.current) {
        paginaEmAndamento.current = null;
        setCarregandoMais(false);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.listContent}
        data={pontos}
        keyExtractor={(item) => item.id}
        onEndReached={() => void carregarProximaPagina()}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View style={styles.headerPanel}>
            <Text style={styles.headerEyebrow}>Instituto Mão Amiga</Text>
            <Text style={styles.titulo}>Pontos de coleta</Text>
            <Text style={styles.subtitulo}>
              {totalPontos} locais cadastrados
            </Text>
            <TextInput
              style={styles.inputBusca}
              placeholder="Buscar por nome do ponto"
              placeholderTextColor="#7A8798"
              value={busca}
              onChangeText={setBusca}
              accessibilityLabel="Buscar pontos de coleta"
              returnKeyType="search"
            />
          </View>
        }
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            onPress={() =>
              navigation.navigate('Detalhe', { id: item.id })
            }
          />
        )}
        ListFooterComponent={
          carregandoMais ? (
            <ActivityIndicator
              style={styles.indicador}
              size="small"
              color="#1A2B4C"
            />
          ) : erro && pontos.length > 0 ? (
            <View style={styles.estado}>
              <Text style={styles.mensagemErro}>{erro}</Text>
              <TouchableOpacity
                style={styles.botaoTentarNovamente}
                onPress={() => void carregarProximaPagina(true)}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotaoTentarNovamente}>
                  Tentar novamente
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          carregando ? (
            <View style={styles.estado}>
              <ActivityIndicator size="large" color="#1A2B4C" />
              <Text style={styles.mensagemEstado}>Carregando pontos...</Text>
            </View>
          ) : erro ? (
            <View style={styles.estado}>
              <Text style={styles.mensagemErro}>{erro}</Text>
              <TouchableOpacity
                style={styles.botaoTentarNovamente}
                onPress={() => setTentativa((valor) => valor + 1)}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotaoTentarNovamente}>
                  Tentar novamente
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.estado}>
              <Text style={styles.mensagemEstado}>
                {filtroAplicado.current
                  ? 'Nenhum ponto corresponde à busca.'
                  : 'Nenhum ponto de coleta cadastrado.'}
              </Text>
            </View>
          )
        }
      />

      <TouchableOpacity
        style={styles.buttonNovoPonto}
        onPress={() => navigation.navigate('FormularioPonto')}
        activeOpacity={0.9}
        accessibilityRole="button"
      >
        <Text style={styles.buttonNovoPontoText}>+ Cadastrar ponto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonHistorico}
        onPress={() => navigation.navigate('Historico')}
        activeOpacity={0.9}
        accessibilityRole="button"
      >
        <Text style={styles.buttonHistoricoText}>Minhas doações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonCadastro}
        onPress={() => navigation.navigate('Cadastro')}
        activeOpacity={0.9}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>+ Registrar doação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  } as ViewStyle,
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    flexGrow: 1,
  },
  headerPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E4EBF5',
    boxShadow: '0px 4px 10px rgba(26, 43, 76, 0.08)',
    elevation: 2,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6E82A8',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 6,
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
  },
  inputBusca: {
    minHeight: 46,
    marginTop: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    backgroundColor: '#F8FAFD',
    color: '#1A2B4C',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDEFF3',
    boxShadow: '0px 4px 12px rgba(26, 43, 76, 0.08)',
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5EE',
    color: '#1F7A58',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2B4C',
    marginBottom: 6,
  },
  endereco: {
    fontSize: 13,
    color: '#5A6B82',
    lineHeight: 18,
  },
  estado: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  mensagemEstado: {
    color: '#5A6B82',
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
  },
  mensagemErro: {
    color: '#B42318',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
    textAlign: 'center',
  },
  botaoTentarNovamente: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#1A2B4C',
    borderRadius: 10,
  },
  textoBotaoTentarNovamente: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  indicador: {
    paddingVertical: 16,
  },
  buttonCadastro: {
    backgroundColor: '#1A2B4C',
    borderRadius: 14,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    boxShadow: '0px 6px 12px rgba(26, 43, 76, 0.12)',
    elevation: 4,
  },
  buttonHistorico: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#D9E2EC',
  },
  buttonNovoPonto: {
    backgroundColor: '#E8F5EE',
    borderRadius: 14,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#B9DEC9',
  },
  buttonNovoPontoText: {
    color: '#1F7A58',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonHistoricoText: {
    color: '#1A2B4C',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
