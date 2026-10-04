import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mao_amiga:doacoes';

export const doacoesStorage = {
  async listarDoacoes() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      return json != null ? JSON.parse(json) : [];
    } catch (e) {
      console.error('Erro ao ler doações', e);
      return [];
    }
  },

  async salvarDoacao(novaDoacao) {
    try {
      const doacoes = await this.listarDoacoes();
      const itemComId = {
        id: String(Date.now()),
        criadoEm: new Date().toISOString(),
        ...novaDoacao,
      };
      const listaAtualizada = [itemComId, ...doacoes];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
      return itemComId;
    } catch (e) {
      console.error('Erro ao salvar doação', e);
    }
  },

  async atualizarDoacao(doacaoEditada) {
    try {
      const doacoes = await this.listarDoacoes();
      const listaAtualizada = doacoes.map((item) =>
        item.id === doacaoEditada.id ? { ...item, ...doacaoEditada } : item
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
    } catch (e) {
      console.error('Erro ao atualizar doação', e);
    }
  },

  async excluirDoacao(id) {
    try {
      const doacoes = await this.listarDoacoes();
      const listaAtualizada = doacoes.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
    } catch (e) {
      console.error('Erro ao excluir doação', e);
    }
  },
};