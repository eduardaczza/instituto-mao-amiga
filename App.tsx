import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaPontos from './src/screens/TelaListaPontos';
import TelaDetalhePonto from './src/screens/TelaDetalhePonto';
import TelaFormularioDoacao from './src/screens/TelaCadastroDoacao';
import TelaHistoricoDoacoes from './src/screens/TelaHistoricoDoacoes';
import TelaDetalheDoacao from './src/screens/TelaDetalheDoacao';

type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
  criadoEm: string;
};

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  Cadastro: undefined;
  Historico: undefined;
  DetalheDoacao: { doacao: Doacao };
  EditarDoacao: { doacao: Doacao };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen
          name="Lista"
          component={TelaListaPontos}
          options={{ title: 'Instituto Mão Amiga' }}
        />
        <Stack.Screen
          name="Detalhe"
          component={TelaDetalhePonto}
          options={{ title: 'Detalhe do ponto' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={TelaFormularioDoacao}
          options={{ title: 'Cadastro de doação' }}
        />
        <Stack.Screen
          name="EditarDoacao"
          component={TelaFormularioDoacao}
          options={{ title: 'Editar doação' }}
        />
        <Stack.Screen
          name="Historico"
          component={TelaHistoricoDoacoes}
          options={{ title: 'Minhas doações' }}
        />
        <Stack.Screen
          name="DetalheDoacao"
          component={TelaDetalheDoacao}
          options={{ title: 'Detalhe da doação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}