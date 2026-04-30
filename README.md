# FitTrack

FitTrack é um aplicativo mobile interno para registrar e acompanhar hábitos diários de saúde, como consumo de água, sono, humor e exercício realizado.

## Stack

- React Native com Expo
- TypeScript
- React Navigation
- Context API + `useReducer`
- AsyncStorage
- React Hook Form
- Zod
- StyleSheet nativo
- Lucide React Native

## Como Rodar

```bash
npm install
npm start
```

Depois, use o Expo Go ou um emulador para abrir o aplicativo.

Comandos úteis:

```bash
npm run android
npm run ios
npm run web
npx tsc --noEmit
```

## Estrutura de Pastas

```text
src/
  components/   Componentes reutilizáveis e tipados.
  screens/      Telas principais do aplicativo.
  context/      Estado global com Context API, actions e reducer.
  hooks/        Hooks de acesso a regras compartilhadas.
  services/     Serviços auxiliares sem dependência de UI.
  storage/      Persistência local com AsyncStorage.
  models/       Modelos e contratos TypeScript.
  utils/        Funções puras para regras de negócio.
  constants/    Tokens visuais e constantes de saúde.
  navigation/   Configuração de navegação e tipos de rotas.
```

## Decisões Técnicas

- `App.tsx` foi mantido simples, carregando apenas providers, navegação e status bar.
- A autenticação é local, com nome e senha validados no login. Apenas a sessão do usuário é persistida; a senha não é armazenada.
- O estado dos registros usa Context API + `useReducer`, separado em state, actions, reducer e provider.
- A persistência é feita em `src/storage`, isolando o AsyncStorage do restante da aplicação.
- As regras de negócio ficam em funções puras em `src/utils`, como cálculo de progresso, busca do registro do dia e ordenação do histórico.
- O formulário usa React Hook Form com Zod para validação centralizada e mensagens claras.
- A UI usa `StyleSheet` nativo, tokens compartilhados e componentes reutilizáveis para manter consistência visual.

## Funcionalidades

- Dashboard com resumo do dia e progresso da meta de água.
- Login local com sessão persistida e logout.
- Cadastro e edição do registro diário, incluindo edição individual de água, sono, humor e exercício pela Home.
- Histórico com cards clicáveis para editar registros anteriores.
- Persistência local automática ao salvar registros.
- Empty states, loading state e labels básicos de acessibilidade.
