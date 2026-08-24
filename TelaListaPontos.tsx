import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.endereco}>📍 {ponto.endereco}</Text>
    </TouchableOpacity>
  );
}

export default function TelaListaPontos({ navigation }: Props) {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={pontosMock}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <Text style={styles.titulo}>Pontos de Coleta / Distribuição</Text>
      }
      renderItem={({ item }) => (
        <PontoItem
          ponto={item}
          onPress={() => navigation.navigate('Detalhe', { pontoId: item.id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContent: {
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2B4C',
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#1A2B4C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EFEFEF',
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
});