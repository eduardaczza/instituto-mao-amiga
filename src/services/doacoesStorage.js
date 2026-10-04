import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mao_amiga:doacoes';

export const doacoesStorage = {
  async listarDoacoes() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      return json != null ? JSON.parse(json) : [];
    } catch (e) {
      console.error('Erro ao ler doações', e);
      throw e;
    }
  },

  async salvarDoacao(novaDoacao) {
    try {
      const doacoes = await doacoesStorage.listarDoacoes();
      const idBase = String(Date.now());
      let id = idBase;
      let sufixo = 1;

      while (doacoes.some((doacao) => doacao.id === id)) {
        id = `${idBase}-${sufixo}`;
        sufixo += 1;
      }

      const itemComId = {
        ...novaDoacao,
        id,
        criadoEm: new Date().toISOString(),
      };
      const listaAtualizada = [itemComId, ...doacoes];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
      return itemComId;
    } catch (e) {
      console.error('Erro ao salvar doação', e);
      throw e;
    }
  },

  async atualizarDoacao(doacaoEditada) {
    try {
      const doacoes = await doacoesStorage.listarDoacoes();
      const listaAtualizada = doacoes.map((item) =>
        item.id === doacaoEditada.id ? { ...item, ...doacaoEditada } : item
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
    } catch (e) {
      console.error('Erro ao atualizar doação', e);
      throw e;
    }
  },

  async excluirDoacao(id) {
    try {
      const doacoes = await doacoesStorage.listarDoacoes();
      const listaAtualizada = doacoes.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
    } catch (e) {
      console.error('Erro ao excluir doação', e);
      throw e;
    }
  },
};