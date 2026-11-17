import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { pontosService } from '../services/pontosService';

type Props = NativeStackScreenProps<RootStackParamList, 'FormularioPonto'>;
type TipoPonto = 'coleta' | 'distribuição';

function statusDoErro(error: unknown): number | undefined {
  if (error instanceof Error && 'status' in error) {
    return typeof error.status === 'number' ? error.status : undefined;
  }
  return undefined;
}

function mensagemDeErro(error: unknown): string {
  if (statusDoErro(error) === 400) {
    return 'Confira os dados informados e tente novamente.';
  }
  if (statusDoErro(error) === 0) {
    return 'Não foi possível conectar à API. Verifique se ela está em execução e tente novamente.';
  }
  return 'Não foi possível salvar o ponto. Tente novamente.';
}

export default function TelaFormularioPonto({ navigation, route }: Props) {
  const id = route.params?.id;
  const editando = id !== undefined;
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [horario, setHorario] = useState('');
  const [tipo, setTipo] = useState<TipoPonto>('coleta');
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) {
      setCarregando(false);
      return;
    }

    const pontoId = id;
    let telaAtiva = true;
    setCarregando(true);

    async function carregarPonto() {
      try {
        const ponto = await pontosService.buscarParaEdicao(pontoId);
        if (telaAtiva) {
          setNome(ponto.nome);
          setEndereco(ponto.endereco);
          setBairro(ponto.bairro);
          setHorario(ponto.horario);
          setTipo(ponto.tipo === 'distribuição' ? 'distribuição' : 'coleta');
        }
      } catch {
        if (telaAtiva) {
          Alert.alert(
            'Não foi possível carregar o ponto',
            'Verifique se a API está em execução e tente novamente.'
          );
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
  }, [id]);

  const salvar = async () => {
    const ponto = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      horario: horario.trim(),
      tipo,
    };

    if (
      !ponto.nome ||
      !ponto.endereco ||
      !ponto.bairro ||
      !ponto.horario ||
      !ponto.tipo
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha nome, endereço, bairro e horário e selecione o tipo do ponto.'
      );
      return;
    }

    setSalvando(true);
    try {
      if (id) {
        await pontosService.editar(id, ponto);
      } else {
        await pontosService.cadastrar(ponto);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        editando ? 'Erro ao atualizar ponto' : 'Erro ao cadastrar ponto',
        mensagemDeErro(error)
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.titulo}>
            {editando ? 'Editar ponto' : 'Cadastrar ponto'}
          </Text>

          {carregando ? (
            <View style={styles.estadoCarregamento}>
              <ActivityIndicator size="large" color="#1A2B4C" />
              <Text style={styles.textoCarregamento}>
                Carregando dados do ponto...
              </Text>
            </View>
          ) : null}

          <Text style={styles.rotulo}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome do ponto"
            placeholderTextColor="#7A8798"
            editable={!carregando && !salvando}
            accessibilityLabel="Nome do ponto"
          />

          <Text style={styles.rotulo}>Endereço</Text>
          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Endereço completo"
            placeholderTextColor="#7A8798"
            editable={!carregando && !salvando}
            accessibilityLabel="Endereço"
          />

          <Text style={styles.rotulo}>Bairro</Text>
          <TextInput
            style={styles.input}
            value={bairro}
            onChangeText={setBairro}
            placeholder="Bairro"
            placeholderTextColor="#7A8798"
            editable={!carregando && !salvando}
            accessibilityLabel="Bairro"
          />

          <Text style={styles.rotulo}>Horário</Text>
          <TextInput
            style={styles.input}
            value={horario}
            onChangeText={setHorario}
            placeholder="Ex.: Segunda a sexta, 8h às 17h"
            placeholderTextColor="#7A8798"
            editable={!carregando && !salvando}
            accessibilityLabel="Horário"
          />

          <Text style={styles.rotulo}>Tipo</Text>
          <View style={styles.opcoesTipo}>
            <TouchableOpacity
              style={[
                styles.opcaoTipo,
                tipo === 'coleta' && styles.opcaoTipoSelecionada,
              ]}
              onPress={() => setTipo('coleta')}
              disabled={carregando || salvando}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: tipo === 'coleta' }}
            >
              <Text
                style={[
                  styles.textoOpcaoTipo,
                  tipo === 'coleta' && styles.textoOpcaoTipoSelecionada,
                ]}
              >
                Coleta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.opcaoTipo,
                tipo === 'distribuição' && styles.opcaoTipoSelecionada,
              ]}
              onPress={() => setTipo('distribuição')}
              disabled={carregando || salvando}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: tipo === 'distribuição' }}
            >
              <Text
                style={[
                  styles.textoOpcaoTipo,
                  tipo === 'distribuição' && styles.textoOpcaoTipoSelecionada,
                ]}
              >
                Distribuição
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.botaoSalvar,
              (carregando || salvando) && styles.botaoDesabilitado,
            ]}
            onPress={() => void salvar()}
            disabled={carregando || salvando}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBotaoSalvar}>
                {editando ? 'Salvar alterações' : 'Cadastrar ponto'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 36,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4EBF5',
    padding: 18,
  },
  titulo: {
    color: '#1A2B4C',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
  },
  rotulo: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    backgroundColor: '#F8FAFD',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 12,
    color: '#1A2B4C',
    fontSize: 15,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  opcoesTipo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  opcaoTipo: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    backgroundColor: '#F8FAFD',
  },
  opcaoTipoSelecionada: {
    borderColor: '#1F7A58',
    backgroundColor: '#E8F5EE',
  },
  textoOpcaoTipo: {
    color: '#5A6B82',
    fontSize: 14,
    fontWeight: '700',
  },
  textoOpcaoTipoSelecionada: {
    color: '#1F7A58',
  },
  botaoSalvar: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2B4C',
    borderRadius: 14,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  estadoCarregamento: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  textoCarregamento: {
    color: '#5A6B82',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
});
