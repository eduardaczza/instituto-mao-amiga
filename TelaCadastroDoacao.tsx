import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doacoesStorage } from './src/services/doacoesStorage';
import { pontosMock } from './TelaListaPontos';

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  Cadastro: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

export default function TelaCadastroDoacao({ navigation }: Props) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erroQuantidade, setErroQuantidade] = useState('');
  const [seletorPontosVisivel, setSeletorPontosVisivel] = useState(false);

  const validarFormulario = () => {
    const tipoValido = tipoItem.trim().length > 0;
    const pontoValido = pontoDestino.trim().length > 0;
    const quantidadeValida = /^\d+$/.test(quantidade.trim());

    if (!tipoValido || !pontoValido || !quantidadeValida) {
      if (!quantidadeValida) {
        setErroQuantidade('Digite apenas números na quantidade.');
      } else {
        setErroQuantidade('');
      }
      return false;
    }

    setErroQuantidade('');
    return true;
  };

  const handleEnviar = async () => {
    if (!validarFormulario()) {
      return;
    }

    const doacao = {
      tipoItem: tipoItem.trim(),
      quantidade: quantidade.trim(),
      pontoDestino: pontoDestino.trim(),
    };

    try {
      await doacoesStorage.salvarDoacao(doacao);
    } catch {
      Alert.alert(
        'Erro ao cadastrar doação',
        'Não foi possível salvar a doação. Tente novamente.'
      );
      return;
    }

    navigation.goBack();
    Alert.alert(
      'Doação cadastrada',
      `Tipo: ${tipoItem}\nQuantidade: ${quantidade}\nPonto: ${pontoDestino}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerEyebrow}>Nova doação</Text>
          <Text style={styles.titulo}>Cadastro</Text>
          <Text style={styles.subtitulo}>
            Registre o item, a quantidade e o ponto de destino.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo do item</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: roupas, alimentos, brinquedos"
              value={tipoItem}
              onChangeText={setTipoItem}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={[styles.input, erroQuantidade ? styles.inputError : null]}
              placeholder="Ex.: 12"
              value={quantidade}
              onChangeText={(texto) => {
                setQuantidade(texto);
                if (texto.trim() && !/^\d+$/.test(texto.trim())) {
                  setErroQuantidade('Digite apenas números na quantidade.');
                } else {
                  setErroQuantidade('');
                }
              }}
              keyboardType="numeric"
              maxLength={6}
            />
            {erroQuantidade ? <Text style={styles.errorText}>{erroQuantidade}</Text> : null}
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
                  pontoDestino ? styles.textoPontoSelecionado : styles.placeholderPonto
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
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Enviar cadastro</Text>
        </TouchableOpacity>
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
              {pontosMock.map((ponto) => (
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
});