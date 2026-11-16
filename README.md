# Instituto Mão Amiga

Aplicativo em React Native, Expo e TypeScript para consultar pontos de coleta e registrar doações. A API Spring Boot deste repositório fornece os pontos; as doações permanecem salvas localmente no aparelho.

## Requisitos

- Node.js 20 ou superior e npm
- Java 21
- Maven 3.9 ou superior
- Expo Go ou um emulador, para executar o app em dispositivo

## API

Na raiz do repositório, inicie o servidor:

```bash
cd api
mvn spring-boot:run
```

O servidor fica disponível em `http://localhost:8080`. A primeira inicialização cria o banco H2 em arquivo e insere dez pontos de exemplo em Goiânia. Reinicializações preservam os dados e não repetem a carga inicial.

### Endpoints disponíveis

| Método | URL | Descrição |
| --- | --- | --- |
| `GET` | `/pontos` | Lista pontos paginados. Aceita `page`, `size` e `sort`; padrão de 20 itens, máximo de 50. |
| `GET` | `/pontos/{id}` | Consulta um ponto pelo UUID; responde 404 quando não existe. |

Exemplos:

```text
GET http://localhost:8080/pontos
GET http://localhost:8080/pontos?page=0&size=5&sort=nome,asc
GET http://localhost:8080/pontos/00000000-0000-0000-0000-000000000000
```

A resposta da lista usa `content` e metadados de paginação em `page`. A documentação interativa está em [Swagger UI](http://localhost:8080/swagger-ui/index.html). O console H2, destinado ao desenvolvimento local, fica em [H2 Console](http://localhost:8080/h2-console); use JDBC URL `jdbc:h2:file:./data/instituto-mao-amiga`, usuário `sa` e senha vazia.

As coordenadas dos exemplos correspondem a locais mapeados em Goiânia. Fonte cartográfica: OpenStreetMap, consultada pelo geocodificador Photon; © OpenStreetMap contributors.

## Aplicativo

Instale as dependências na raiz do repositório:

```bash
npm install
```

Inicie o Expo:

```bash
npm start
```

Atalhos para cada plataforma:

```bash
npm run android
npm run ios
npm run web
```

O app consulta a API pelo serviço `src/services/api.ts`. A URL padrão é `http://localhost:8080`, adequada para teste no navegador local. Para testar em um celular físico ou emulador Android, altere `API_BASE_URL` nesse arquivo para o endereço IPv4 do computador na rede Wi-Fi, por exemplo `http://192.168.1.25:8080`. O celular e o computador devem estar na mesma rede, e a porta 8080 precisa estar acessível pelo firewall.

## Estrutura

```text
.
├── api/                    # API Spring Boot, JPA e H2
├── src/
│   ├── navigation/         # Tipos das rotas
│   ├── screens/            # Telas do aplicativo
│   ├── services/           # Cliente HTTP e persistência das doações
│   └── types/              # Tipos compartilhados da aplicação
├── App.tsx                 # Configuração da navegação
└── package.json
```

## Verificações

```bash
npx tsc --noEmit
cd api
mvn test
```
