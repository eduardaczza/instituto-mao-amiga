import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doacoesService } from '../services/doacoesService';
import type { RootStackParamList } from '../navigation/types';
import { pontosService } from '../services/pontosService';
import type { PontoCrud } from '../services/pontosService';
import type { NovaDoacao } from '../types/doacao';

type Props =
  | NativeStackScreenProps<RootStackParamList, 'Cadastro'>
  | NativeStackScreenProps<RootStackParamList, 'EditarDoacao'>;

function statusDoErro(error: unknown): number | undefined {
  if (error instanceof Error && 'status' in error) {
    return typeof error.status === 'number' ? error.status : undefined;
  }
  return undefined;
}

export default function TelaCadastroDoacao({ navigation, route }: Props) {
  const doacaoId = route.name === 'EditarDoacao' ? route.params.id : undefined;
  const modoEdicao = doacaoId !== undefined;
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erroQuantidade, setErroQuantidade] = useState('');
  const [carregandoDoacao, setCarregandoDoacao] = useState(modoEdicao);
  const [edicaoCarregada, setEdicaoCarregada] = useState(!modoEdicao);
  const [erroCarregamentoEdicao, setErroCarregamentoEdicao] = useState(false);
  const [tentativaCarregamentoEdicao, setTentativaCarregamentoEdicao] =
    useState(0);
  const [seletorPontosVisivel, setSeletorPontosVisivel] = useState(false);
  const [feedbackVisivel, setFeedbackVisivel] = useState(false);
  const [cadastroSalvo, setCadastroSalvo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pontos, setPontos] = useState<PontoCrud[]>([]);
  const [carregandoPontos, setCarregandoPontos] = useState(false);
  const [erroPontos, setErroPontos] = useState('');
  const [tentativaPontos, setTentativaPontos] = useState(0);

  useEffect(() => {
    const id = doacaoId;
    if (id === undefined) {
      return;
    }

    let telaAtiva = true;
    setCarregandoDoacao(true);
    setEdicaoCarregada(false);
    setErroCarregamentoEdicao(false);

    async function carregarDoacao(idDoacao: string) {
      try {
        const doacao = await doacoesService.buscarPorId(idDoacao);
        if (telaAtiva) {
          setTipoItem(doacao.tipoItem);
          setQuantidade(String(doacao.quantidade));
          setPontoDestino(doacao.pontoDestino);
          setEdicaoCarregada(true);
        }
      } catch (error) {
        if (telaAtiva) {
          setEdicaoCarregada(false);
          setErroCarregamentoEdicao(true);
          const status = statusDoErro(error);
          Alert.alert(
            status === 0
              ? 'API indisponível'
              : status === 404
                ? 'Doação não encontrada'
                : 'Não foi possível carregar a doação',
            status === 0
              ? 'Não foi possível conectar à API. A edição não foi iniciada.'
              : status === 404
                ? 'Esta doação não está mais disponível para edição.'
                : 'Verifique a conexão e tente novamente.'
          );
        }
      } finally {
        if (telaAtiva) {
          setCarregandoDoacao(false);
        }
      }
    }

    void carregarDoacao(id);
    return () => {
      telaAtiva = false;
    };
  }, [doacaoId, tentativaCarregamentoEdicao]);

  useEffect(() => {
    if (!seletorPontosVisivel) {
      return;
    }

    let telaAtiva = true;
    setCarregandoPontos(true);
    setErroPontos('');

    async function carregarPontos() {
      try {
        const resposta = await pontosService.listarTodos();
        if (telaAtiva) {
          setPontos(resposta);
        }
      } catch {
        if (telaAtiva) {
          setErroPontos(
            'Não foi possível carregar os pontos. Verifique se a API está em execução.'
          );
        }
      } finally {
        if (telaAtiva) {
          setCarregandoPontos(false);
        }
      }
    }

    void carregarPontos();
    return () => {
      telaAtiva = false;
    };
  }, [seletorPontosVisivel, tentativaPontos]);

  const validarFormulario = () => {
    const tipoValido = tipoItem.trim().length > 0;
    const pontoValido = pontoDestino.trim().length > 0;
    const quantidadeValida =
      /^\d+$/.test(quantidade.trim()) && Number(quantidade.trim()) > 0;

    if (!tipoValido || !pontoValido) {
      Alert.alert(
        'Campos obrigatórios',
        'Informe o tipo do item e selecione um ponto de destino.'
      );
      return false;
    }

    if (!quantidadeValida) {
      setErroQuantidade('Digite uma quantidade inteira maior que zero.');
      return false;
    }

    setErroQuantidade('');
    return true;
  };

  const salvarDoacao = async () => {
    const doacao: NovaDoacao = {
      tipoItem: tipoItem.trim(),
      quantidade: Number(quantidade.trim()),
      pontoDestino: pontoDestino.trim(),
    };

    setSalvando(true);
    try {
      if (doacaoId) {
        await doacoesService.editar(doacaoId, doacao);
      } else {
        await doacoesService.cadastrar(doacao);
      }
    } catch (error) {
      const status = statusDoErro(error);
      Alert.alert(
        status === 400
          ? 'Dados inválidos'
          : status === 0
            ? 'API indisponível'
            : 'Não foi possível salvar',
        status === 400
          ? 'A API recusou os dados. Confira os campos e tente novamente.'
          : status === 0
            ? 'Não foi possível conectar à API. Verifique a conexão e tente novamente.'
            : 'Ocorreu um erro ao salvar a doação. Tente novamente.'
      );
      return;
    } finally {
      setSalvando(false);
    }

    setCadastroSalvo(true);
    setFeedbackVisivel(true);
  };

  const handleEnviar = () => {
    if (!validarFormulario()) {
      return;
    }

    void salvarDoacao();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerEyebrow}>
            {modoEdicao ? 'Atualização de doação' : 'Nova doação'}
          </Text>
          <Text style={styles.titulo}>
            {modoEdicao ? 'Editar doação' : 'Cadastro'}
          </Text>
          <Text style={styles.subtitulo}>
            {modoEdicao
              ? 'Atualize os dados da doação. O identificador e a data original serão mantidos.'
              : 'Registre o item, a quantidade e o ponto de destino.'}
          </Text>
        </View>

        {modoEdicao && !edicaoCarregada ? (
          <View style={styles.formCard}>
            {carregandoDoacao ? (
              <View style={styles.estadoEdicao}>
                <ActivityIndicator size="large" color="#1A2B4C" />
                <Text style={styles.textoEstadoEdicao}>
                  Carregando dados da doação...
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.erroEstadoEdicao}>
                  {erroCarregamentoEdicao
                    ? 'Não foi possível carregar os dados para edição.'
                    : 'Doação não encontrada.'}
                </Text>
                <TouchableOpacity
                  style={styles.botaoTentarEdicao}
                  onPress={() =>
                    setTentativaCarregamentoEdicao((tentativa) => tentativa + 1)
                  }
                  accessibilityRole="button"
                >
                  <Text style={styles.textoBotaoTentarEdicao}>
                    Tentar novamente
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <>
            <View style={styles.formCard}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tipo do item</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: roupas, alimentos, brinquedos"
                  placeholderTextColor="#5A6B82"
                  value={tipoItem}
                  onChangeText={setTipoItem}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Quantidade</Text>
                <TextInput
                  style={[
                    styles.input,
                    erroQuantidade ? styles.inputError : null,
                  ]}
                  placeholder="Ex.: 12"
                  placeholderTextColor="#5A6B82"
                  value={quantidade}
                  onChangeText={(texto) => {
                    setQuantidade(texto);
                    if (
                      texto.trim() &&
                      (!/^\d+$/.test(texto.trim()) ||
                        Number(texto.trim()) <= 0)
                    ) {
                      setErroQuantidade(
                        'Digite uma quantidade inteira maior que zero.'
                      );
                    } else {
                      setErroQuantidade('');
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                />
                {erroQuantidade ? (
                  <Text style={styles.errorText}>{erroQuantidade}</Text>
                ) : null}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Ponto de destino</Text>
                <TouchableOpacity
                  style={styles.seletorPonto}
                  onPress={() => setSeletorPontosVisivel(true)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={
                    pontoDestino || 'Selecionar ponto de coleta'
                  }
                >
                  <Text
                    style={
                      pontoDestino
                        ? styles.textoPontoSelecionado
                        : styles.placeholderPonto
                    }
                  >
                    {pontoDestino || 'Selecione um ponto de coleta'}
                  </Text>
                  <Text style={styles.setaSeletor}>⌄</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleEnviar}
              disabled={salvando || (modoEdicao && !edicaoCarregada)}
              activeOpacity={0.9}
            >
              {salvando ? (
                <Text style={styles.buttonText}>Salvando...</Text>
              ) : (
                <Text style={styles.buttonText}>
                  {modoEdicao ? 'Salvar alterações' : 'Enviar cadastro'}
                </Text>
              )}
            </TouchableOpacity>
            {modoEdicao && (
              <TouchableOpacity
                style={styles.buttonCancelar}
                onPress={() => navigation.goBack()}
                disabled={salvando}
                activeOpacity={0.9}
                accessibilityRole="button"
              >
                <Text style={styles.buttonCancelarText}>Cancelar edição</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
      <Modal
        visible={seletorPontosVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setSeletorPontosVisivel(false)}
      >
        <View style={styles.fundoModal}>
          <View style={styles.conteudoModal}>
            <View style={styles.cabecalhoModal}>
              <Text style={styles.tituloModal}>Pontos de coleta</Text>
              <TouchableOpacity
                style={styles.botaoFecharModal}
                onPress={() => setSeletorPontosVisivel(false)}
                accessibilityRole="button"
                accessibilityLabel="Fechar seleção de pontos"
              >
                <Text style={styles.textoFecharModal}>Fechar</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {carregandoPontos ? (
                <View style={styles.estadoPontos}>
                  <ActivityIndicator size="large" color="#1A2B4C" />
                  <Text style={styles.textoEstadoPontos}>
                    Carregando pontos...
                  </Text>
                </View>
              ) : erroPontos ? (
                <View style={styles.estadoPontos}>
                  <Text style={styles.erroPontos}>{erroPontos}</Text>
                  <TouchableOpacity
                    style={styles.botaoTentarPontos}
                    onPress={() =>
                      setTentativaPontos((tentativa) => tentativa + 1)
                    }
                    accessibilityRole="button"
                  >
                    <Text style={styles.textoBotaoTentarPontos}>
                      Tentar novamente
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : pontos.length === 0 ? (
                <Text style={styles.textoEstadoPontos}>
                  Nenhum ponto cadastrado na API.
                </Text>
              ) : pontos.map((ponto) => (
                <TouchableOpacity
                  key={ponto.id}
                  style={styles.opcaoPonto}
                  onPress={() => {
                    setPontoDestino(ponto.nome);
                    setSeletorPontosVisivel(false);
                  }}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                >
                  <Text style={styles.nomePonto}>{ponto.nome}</Text>
                  <Text style={styles.enderecoPonto}>{ponto.endereco}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        visible={feedbackVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setFeedbackVisivel(false)}
      >
        <View style={styles.fundoFeedback}>
          <View style={styles.caixaFeedback}>
            <Text
              style={[
                styles.tituloFeedback,
                !cadastroSalvo && styles.tituloErroFeedback,
              ]}
            >
              {cadastroSalvo
                ? modoEdicao
                  ? 'Doação atualizada com sucesso!'
                  : 'Doação criada com sucesso!'
                : modoEdicao
                  ? 'Erro ao atualizar doação'
                  : 'Erro ao cadastrar doação'}
            </Text>
            <Text style={styles.textoFeedback}>
              {cadastroSalvo
                ? `${tipoItem} — ${quantidade} unidade(s), destino: ${pontoDestino}.`
                : `Não foi possível ${modoEdicao ? 'atualizar' : 'salvar'} a doação. Tente novamente.`}
            </Text>
            <TouchableOpacity
              style={[
                styles.botaoFeedback,
                !cadastroSalvo && styles.botaoErroFeedback,
              ]}
              onPress={() => {
                setFeedbackVisivel(false);
                if (cadastroSalvo) {
                  navigation.goBack();
                }
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Text style={styles.textoBotaoFeedback}>
                {cadastroSalvo
                  ? 'Continuar'
                  : 'Voltar ao formulário'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F6FB' },
  content: { padding: 20, paddingBottom: 36 },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E4EBF5',
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
  titulo: { fontSize: 28, fontWeight: '800', color: '#1A2B4C', marginBottom: 4 },
  subtitulo: { fontSize: 14, color: '#5A6B82', lineHeight: 20 },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#E4EBF5',
    elevation: 2,
  },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  input: {
    backgroundColor: '#F8FAFD',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1A2B4C',
    minHeight: 48,
  },
  seletorPonto: {
    backgroundColor: '#F8FAFD',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textoPontoSelecionado: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 10,
    fontSize: 15,
    color: '#1A2B4C',
  },
  placeholderPonto: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 10,
    fontSize: 15,
    color: '#7A8798',
  },
  setaSeletor: {
    color: '#5A6B82',
    fontSize: 20,
    paddingHorizontal: 4,
  },
  fundoModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  fundoFeedback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  caixaFeedback: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
  },
  tituloFeedback: {
    color: '#1F7A58',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  tituloErroFeedback: {
    color: '#B42318',
  },
  textoFeedback: {
    color: '#40516A',
    fontSize: 15,
    lineHeight: 22,
  },
  botaoFeedback: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#1A2B4C',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  botaoErroFeedback: {
    backgroundColor: '#B42318',
  },
  textoBotaoFeedback: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  conteudoModal: {
    maxHeight: '80%',
    backgroundColor: '#F3F6FB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  cabecalhoModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tituloModal: {
    color: '#1A2B4C',
    fontSize: 20,
    fontWeight: '800',
  },
  botaoFecharModal: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  textoFecharModal: {
    color: '#1A2B4C',
    fontSize: 14,
    fontWeight: '700',
  },
  opcaoPonto: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4EBF5',
    padding: 14,
    minHeight: 64,
    justifyContent: 'center',
    marginBottom: 10,
  },
  nomePonto: {
    color: '#1A2B4C',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  enderecoPonto: {
    color: '#5A6B82',
    fontSize: 12,
    lineHeight: 18,
  },
  estadoPontos: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  textoEstadoPontos: {
    color: '#5A6B82',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 14,
  },
  erroPontos: {
    color: '#B42318',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
  },
  estadoEdicao: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  textoEstadoEdicao: {
    color: '#5A6B82',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  erroEstadoEdicao: {
    color: '#B42318',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 14,
  },
  botaoTentarEdicao: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A2B4C',
    borderRadius: 10,
  },
  textoBotaoTentarEdicao: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  botaoTentarPontos: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#1A2B4C',
    borderRadius: 10,
  },
  textoBotaoTentarPontos: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inputError: { borderColor: '#D13B3B', backgroundColor: '#FFF5F5' },
  errorText: { marginTop: 8, color: '#D13B3B', fontSize: 12, fontWeight: '600' },
  button: {
    backgroundColor: '#1A2B4C',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 48,
    elevation: 4,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  buttonCancelar: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonCancelarText: {
    color: '#40516A',
    fontSize: 16,
    fontWeight: '700',
  },
});