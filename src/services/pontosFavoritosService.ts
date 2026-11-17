import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_FAVORITOS = '@instituto-mao-amiga/pontos-favoritos';
let filaAtualizacoes: Promise<void> = Promise.resolve();

async function lerIds(): Promise<string[]> {
  const armazenados = await AsyncStorage.getItem(CHAVE_FAVORITOS);
  if (armazenados === null) {
    return [];
  }

  const ids: unknown = JSON.parse(armazenados);
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) {
    throw new Error('A lista local de pontos favoritos está inválida.');
  }

  return [...new Set(ids)];
}

function atualizarIds(
  atualizar: (ids: string[]) => string[]
): Promise<string[]> {
  const atualizacao = filaAtualizacoes.then(async () => {
    const idsAtuais = await lerIds();
    const idsAtualizados = atualizar(idsAtuais);
    await AsyncStorage.setItem(
      CHAVE_FAVORITOS,
      JSON.stringify(idsAtualizados)
    );
    return idsAtualizados;
  });

  filaAtualizacoes = atualizacao.then(
    () => undefined,
    () => undefined
  );
  return atualizacao;
}

export const pontosFavoritosService = {
  async listarIds(): Promise<string[]> {
    await filaAtualizacoes;
    return lerIds();
  },

  adicionar(id: string): Promise<string[]> {
    return atualizarIds((ids) =>
      ids.includes(id) ? ids : [...ids, id]
    );
  },

  remover(id: string): Promise<string[]> {
    return atualizarIds((ids) => ids.filter((idAtual) => idAtual !== id));
  },
};
