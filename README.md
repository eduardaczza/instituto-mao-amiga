# instituto-mao-amiga

Aplicativo desenvolvido em React Native com TypeScript e Expo para o Instituto Mão Amiga (ONG de banco de alimentos e doações).

## Roteiro de demonstração (até 3 minutos)

1. Na tela inicial, toque em **+ Registrar doação**.
2. Cadastre o tipo e a quantidade, selecione um ponto de coleta e salve.
3. Toque em **Continuar** para voltar e abra **Minhas doações**; confira o novo registro e o resumo.
4. Digite parte do tipo no campo de busca, confira o filtro e limpe o texto.
5. Abra a doação, toque em **Editar doação**, altere um campo e salve.
6. Confirme a atualização no detalhe e volte ao histórico.
7. Abra novamente o detalhe, escolha **Excluir doação** e confirme.
8. Feche o app completamente, abra-o de novo e confira que a exclusão e os demais registros persistiram.

Para demonstrar no navegador, execute `npm run web`. No dispositivo, encerre o app pelo seletor de aplicativos antes de reabri-lo.

## Decisão técnica da semana

O histórico é lido e escrito por um único serviço (`src/services/doacoesStorage.js`), em vez de cada tela acessar o AsyncStorage diretamente. Isso concentra a persistência e evita que as telas implementem regras diferentes. O resumo por tipo é calculado a partir da lista carregada, em cada renderização, e não é salvo separadamente; assim, edição e exclusão não deixam totais armazenados desatualizados.

As telas do aplicativo ficam em `src/screens/`, e o acesso às doações permanece em `src/services/`.
