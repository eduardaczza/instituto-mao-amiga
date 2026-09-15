
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  Cadastro: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

export default function TelaFormularioDoacao({ navigation }: Props) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erroQuantidade, setErroQuantidade] = useState('');

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

  const handleEnviar = () => {
    if (!validarFormulario()) {
      return;
    }

    Alert.alert(
      'Doação cadastrada',
      `Tipo: ${tipoItem}\nQuantidade: ${quantidade}\nPonto: ${pontoDestino}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
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
            <TextInput
              style={styles.input}
              placeholder="Ex.: Ponto Centro"
              value={pontoDestino}
              onChangeText={setPontoDestino}
              autoCapitalize="words"
            />
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E4EBF5',
    shadowColor: '#1A2B4C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
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
    fontSize: 28,
    fontWeight: '800',
    color: '#1A2B4C',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#5A6B82',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#E4EBF5',
    shadowColor: '#1A2B4C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
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
  inputError: {
    borderColor: '#D13B3B',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    marginTop: 8,
    color: '#D13B3B',
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1A2B4C',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 48,
    shadowColor: '#1A2B4C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});