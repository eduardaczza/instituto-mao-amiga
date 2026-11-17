import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PontoCard from '../components/PontoCard';
import type { RootStackParamList } from '../navigation/types';
import { pontosFavoritosService } from '../services/pontosFavoritosService';
import { pontosService } from '../services/pontosService';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'MeusPontos'>;

function statusDoErro(error: unknown): number | undefined {
  if (error instanceof Error && 'status' in error) {
    return typeof error.status === 'number' ? error.status : undefined;
  }
  return undefined;
}

export default function TelaMeusPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [idDesfavoritando, setIdDesfavoritando] = useState<string | null>(null);
  const requisicao = useRef(0);

  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;
      const sequencia = ++requisicao.current;
      setCarregando(true);
      setErro('');
      setPontos([]);

      async function carregarFavoritos() {
        try {
          const ids = await pontosFavoritosService.listarIds();
          const idsInexistentes: string[] = [];
          const resultados = await Promise.all(
            ids.map(async (id) => {
              try {
                return await pontosService.buscarPorId(id);
              } catch (error) {
                if (statusDoErro(error) === 404) {
                  idsInexistentes.push(id);
                  return null;
                }
                throw error;
              }
            })
          );

          for (const id of idsInexistentes) {
            await pontosFavoritosService.remover(id);
          }

          if (telaAtiva && sequencia === requisicao.current) {
            setPontos(
              resultados.filter((ponto): ponto is Ponto => ponto !== null)
            );
          }
        } catch {
          if (telaAtiva && sequencia === requisicao.current) {
            setErro(
              'Não foi possível carregar seus pontos favoritos. Verifique a conexão com a API e tente novamente.'
            );
          }
        } finally {
          if (telaAtiva && sequencia === requisicao.current) {
            setCarregando(false);
          }
        }
      }

      void carregarFavoritos();
      return () => {
        telaAtiva = false;
      };
    }, [tentativa])
  );

  const desfavoritar = async (id: string) => {
    if (idDesfavoritando !== null) {
      return;
    }

    setIdDesfavoritando(id);
    try {
      await pontosFavoritosService.remover(id);
      setPontos((atuais) => atuais.filter((ponto) => ponto.id !== id));
    } catch {
      Alert.alert(
        'Não foi possível remover o favorito',
        'Os favoritos não foram alterados. Tente novamente.'
      );
    } finally {
      setIdDesfavoritando(null);
    }
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[
        styles.conteudo,
        pontos.length === 0 && styles.conteudoVazio,
      ]}
      data={pontos}
      keyExtractor={(ponto) => ponto.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.titulo}>Meus pontos</Text>
          <Text style={styles.subtitulo}>
            Seus pontos favoritos ficam salvos neste dispositivo.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <PontoCard
          ponto={item}
          favorito
          onPress={() => navigation.navigate('Detalhe', { id: item.id })}
          onToggleFavorito={() => void desfavoritar(item.id)}
          favoritoDesabilitado={idDesfavoritando !== null}
        />
      )}
      ListEmptyComponent={
        <View style={styles.estado}>
          {carregando ? (
            <>
              <ActivityIndicator size="large" color="#1A2B4C" />
              <Text style={styles.mensagem}>Carregando pontos favoritos...</Text>
            </>
          ) : erro ? (
            <>
              <Text style={styles.mensagemErro}>{erro}</Text>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => setTentativa((valor) => valor + 1)}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotao}>Tentar novamente</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.mensagem}>
              Você ainda não favoritou nenhum ponto.
            </Text>
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
    paddingHorizontal: 20,
    paddingTop: 18,
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
  estado: {
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
    fontSize: 15,
    color: '#B42318',
    lineHeight: 22,
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
