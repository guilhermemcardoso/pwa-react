# pwa-react
Trabalho desenvolvido para disciplina de pós graduação do IFSP


##
# pwa-react
Trabalho desenvolvido para disciplina de pós graduação do IFSP

## Como rodar localmente

### Configurando Firebase

Configurar projeto no [Console do Firebase](https://console.firebase.google.com/) e adicionar aplicação Web ao projeto criado.

Após adicionar a aplicação Web, será disponibilizado um trecho de código contendo uma estrutura similar a seguinte:

    const firebaseConfig = {
      apiKey: "xxxxxxxxxxxxxxxxx",
      authDomain: "xxxxxxxxxxxxxxxxx",
      projectId: "xxxxxxxxxxxxxxxxx",
      storageBucket: "xxxxxxxxxxxxxxxxx",
      messagingSenderId: "xxxxxxxxxxxxxxxxx",
      appId: "xxxxxxxxxxxxxxxxx",
      measurementId: "G-xxxxxxxxxx"
    };

Crie um arquivo `.env` na raíz do projeto seguindo o padrão disponibilizado no arquivo `.env.example`. Em seguida, adicione os valores do trecho de código disponibilizado pelo Firebase nas variáveis de ambientes criadas no arquivo `.env`.

Não esqueça de habilitar a autenticação email/senha no console do Firebase e criar um usuário por lá também, para que seja possível realizar o login no projeto.

### Buildando o projeto

Para conseguir instalar a aplicação PWA em um dispositivo desktop ou mobile, é preciso buildar o projeto e rodá-lo em um servidor (que pode ser local)

Abra um terminal e rode o comando `npm run build` ou `yarn build`. Isso irá gerar um novo build do projeto, que será armazenado na pasta `build` dentro do diretório raíz do projeto.

### Servidor local
Caso você ainda não tenha, instale o pacote [serve](https://github.com/vercel/serve), instale o pacote utilizando o comando `npm install --global serve`

### Rodando o projeto
Após ter o pacote `serve` instalado, rode o comando `npm run serve`. Isso irá rodar um servidor local com a build do projeto que foi gerada agora pouco.
