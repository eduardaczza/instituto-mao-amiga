import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Ponto } from '../types/ponto';

type Props = {
  ponto: Ponto;
  favorito: boolean;
  onPress: () => void;
  onToggleFavorito: () => void;
  favoritoDesabilitado?: boolean;
};

export default function PontoCard({
  ponto,
  favorito,
  onPress,
  onToggleFavorito,
  favoritoDesabilitado = false,
}: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.conteudo}
        onPress={onPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${ponto.nome}`}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardBadge}>Ativo</Text>
        </View>
        <Text style={styles.nome}>{ponto.nome}</Text>
        <Text style={styles.endereco}>📍 {ponto.endereco}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botaoFavorito}
        onPress={onToggleFavorito}
        disabled={favoritoDesabilitado}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={
          favorito
            ? `Remover ${ponto.nome} dos favoritos`
            : `Adicionar ${ponto.nome} aos favoritos`
        }
        accessibilityState={{
          selected: favorito,
          disabled: favoritoDesabilitado,
        }}
      >
        <Text style={[styles.iconeFavorito, favorito && styles.iconeSelecionado]}>
          {favorito ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EDEFF3',
    boxShadow: '0px 4px 12px rgba(26, 43, 76, 0.08)',
    elevation: 3,
  },
  conteudo: {
    flex: 1,
    minHeight: 68,
    justifyContent: 'center',
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
  botaoFavorito: {
    minWidth: 44,
    minHeight: 44,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  iconeFavorito: {
    color: '#6E82A8',
    fontSize: 28,
    lineHeight: 34,
  },
  iconeSelecionado: {
    color: '#D99500',
  },
});
