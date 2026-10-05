
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  type ViewStyle,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

export const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Ponto Centro — Igreja São José',
    endereco: 'Rua das Flores, 120, Centro, São Luís - MA, CEP 65010-000',
    diasHorarios: 'Segunda a sexta, 9h–17h',
    recebeDistribui:
      'Recebe alimentos não perecíveis e roupas; distribui cestas básicas às terças.',
  },
  {
    id: '2',
    nome: 'Ponto Norte — Associação Bairro Alto',
    endereco: 'Av. Brasil, 890, Bairro Alto, São Luís - MA, CEP 65040-210',
    diasHorarios: 'Terça e quinta, 14h–19h',
    recebeDistribui:
      'Recebe hortifruti de feiras; distribui kits de higiene aos sábados.',
  },
  {
    id: '3',
    nome: 'Ponto Sul — Mercado Comunitário',
    endereco: 'Travessa do Sol, 45, Vila Nova, São Luís - MA, CEP 65060-120',
    diasHorarios: 'Sábado, 8h–12h',
    recebeDistribui:
      'Recebe doações de famílias e mercados; distribui refeições prontas no mesmo dia.',
  },
  {
    id: '4',
    nome: 'Ponto Leste — Escola Municipal Aurora',
    endereco: 'Rua Aurora, 310, Cohama, São Luís - MA, CEP 65074-180',
    diasHorarios: 'Quarta e sexta, 10h–16h',
    recebeDistribui:
      'Recebe material escolar e lanches; distribui kits infantis às sextas.',
  },
  {
    id: '5',
    nome: 'Ponto Oeste — Centro Comunitário Liberdade',
    endereco: 'Av. dos Holandeses, 1500, Calhau, São Luís - MA, CEP 65071-380',
    diasHorarios: 'Segunda, quarta e sábado, 8h–12h',
    recebeDistribui:
      'Recebe roupas e calçados; distribui enxovais para famílias cadastradas.',
  },
  {
    id: '6',
    nome: 'Ponto Anil — Paróquia Nossa Senhora',
    endereco: 'Rua do Anil, 78, Anil, São Luís - MA, CEP 65046-140',
    diasHorarios: 'Domingo, 7h–11h',
    recebeDistribui:
      'Recebe alimentos perecíveis da feira; distribui café da manhã comunitário.',
  },
  {
    id: '7',
    nome: 'Ponto João Paulo — Associação de Moradores',
    endereco: 'Rua das Palmeiras, 220, João Paulo, São Luís - MA, CEP 65050-000',
    diasHorarios: 'Terça a sábado, 13h–18h',
    recebeDistribui:
      'Recebe produtos de limpeza e higiene; distribui cestas às quintas.',
  },
  {
    id: '8',
    nome: 'Ponto Renascença — Espaço Cultural Coletivo',
    endereco: 'Rua do Giz, 400, Renascença, São Luís - MA, CEP 65075-230',
    diasHorarios: 'Segunda a sexta, 8h–18h',
    recebeDistribui:
      'Recebe livros, agasalhos e cobertores; distribui kits de inverno às segundas.',
  },
  {
    id: '9',
    nome: 'Ponto Turu — Centro de Apoio Social',
    endereco: 'Av. São Luís Rei de França, 55, Turu, São Luís - MA, CEP 65065-470',
    diasHorarios: 'Quarta, sexta e sábado, 9h–15h',
    recebeDistribui:
      'Recebe brinquedos e material didático; distribui kits de leitura e lanches.',
  },
  {
    id: '10',
    nome: 'Ponto Maracanã — Cooperativa Rural',
    endereco: 'Estrada da Maioba, 1020, Maracanã, São Luís - MA, CEP 65090-000',
    diasHorarios: 'Quinta a domingo, 7h–13h',
    recebeDistribui:
      'Recebe cestas de produtores locais; distribui alimentos frescos para famílias da região.',
  },
];

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  Cadastro: undefined;
  Historico: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lista'>;
};

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
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
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
  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.listContent}
        data={pontosMock}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerPanel}>
            <Text style={styles.headerEyebrow}>Instituto Mão Amiga</Text>
            <Text style={styles.titulo}>Pontos de coleta</Text>
            <Text style={styles.subtitulo}>
              {pontosMock.length} locais cadastrados
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            onPress={() =>
              navigation.navigate('Detalhe', { pontoId: item.id })
            }
          />
        )}
      />

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
  },
  headerPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
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
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2B4C',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#5A6B82',
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
    shadowColor: '#1A2B4C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
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
  buttonCadastro: {
    backgroundColor: '#1A2B4C',
    borderRadius: 14,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#1A2B4C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
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