# Fazendo deploy do seu projeto em node.js e mongo.bd com Heroku e Mongo Atlas

Escrito por: Ana Luiza Sampaio para {Reprograma}

Me encontre no instagram: [@analu.io](https://www.instagram.com/analu.io)

no twitter: [@analu_io](https://twitter.com/analu_io) 

no telegram: [@analuizasampaio](https://t.me/analuizasampaio)

ou me mande um e-mail: sampaioaanaluiza@gmail.com

## Criando contas

Para fazer esse tutorial você deve criar contas no heroku, mongo atlas e seu projeto tem que estar no github.

[Heroku | Sign up](https://signup.heroku.com/)

[Cloud: MongoDB Cloud](https://account.mongodb.com/account/register?n=%2Fv2%2F60e761723c050d4d39ab493d%23clusters)

[GitHub: Where the world builds software](https://github.com/)

## Conectando meu repositório com o Heroku

Crie uma conta gratuita no Heroku: [https://www.heroku.com](https://www.heroku.com) e crie o seu primeiro app clicando no botão "new":

![imagens_tutorial/Untitled%201.png](imagens_tutorial/Untitled%201.png)

Coloque o nome do seu projeto e escolha a região em que o seu projeto ficará, pode escolher os EUA ou Europa, realmente não faz diferença nesse caso

![imagens_tutorial/Untitled%202.png](imagens_tutorial/Untitled%202.png)

na area de deploy conecte-se à sua conta no Github como metodo de deployment 

![imagens_tutorial/Untitled%203.png](imagens_tutorial/Untitled%203.png)

e em seguida, encontre o github do projeto que você deseja dar deploy

![imagens_tutorial/Untitled%204.png](imagens_tutorial/Untitled%204.png)

escolha qual branch que deseja dar deploy

![imagens_tutorial/Untitled%205.png](imagens_tutorial/Untitled%205.png)

ative o deploy automatico para que toda vez que vc der push nessa branch as modificações automaticamente sejam atualizadas

![imagens_tutorial/Untitled%206.png](imagens_tutorial/Untitled%206.png)

Para fazer um primeiro teste, clique em Deploy Manual

![imagens_tutorial/Untitled%207.png](imagens_tutorial/Untitled%207.png)

Um terminalzinho assim aparecerá para você

![imagens_tutorial/Untitled%208.png](imagens_tutorial/Untitled%208.png)

Mas logo ele vai ficar todo verdinho assim e você pode clicar em View, para abrir sua linda api

![imagens_tutorial/Untitled%209.png](imagens_tutorial/Untitled%209.png)

Dor e sofrimento, você tomou um Erro!

![imagens_tutorial/Untitled%2010.png](imagens_tutorial/Untitled%2010.png)

Não é o primeiro e não será o ultimo, o importante é ver o logs para entender o que aconteceu, eles ficam no menu superior, clicando em more e dentro do submenu: view logs

![imagens_tutorial/Untitled%2011.png](imagens_tutorial/Untitled%2011.png)

Vamos manter os logs sempre abertos numa outra aba, mas primeiro, vamos terminar as configurações:

Na aba de settings verifique se o nodejs foi adicionado no seu buildpack, normalmente ele é adicionado automaticamente após o primeiro deploy. 

![imagens_tutorial/Untitled%2012.png](imagens_tutorial/Untitled%2012.png)

Se o seu não foi adicionado, click em add buildpack e selecione um dos buildbacks oficiais ou a URL, no caso do nodejs é só selecionar o icone dele e salvar em Save changes

![imagens_tutorial/Untitled%2013.png](imagens_tutorial/Untitled%2013.png)

## Ajustando o meu projeto

Após criar sua conta no heroku e no Mongo atlas, conectar seu repositório com o heroku, algumas mudanças devem ser feitas no seu projeto.

Estou usando a seguinte arquitetura, onde o na raiz do projeto ficam arquivos de configuração do node.js, a node_modules e  o server.js que tem a função de iniciar o projeto, na pasta src, source, fica todo o código, rotas, lógica, configuração de banco de dados.

![Untitled](imagens_tutorial/Untitled%2014.png)

### Procfile

Primeiramente, precisamos criar um arquivo chamado Procfile. O heroku espera que esse arquivo esteja na raiz do seu projeto, onde fica o server.js, package.json e package-lock.json. O Procfile é que vai guiar os primeiros comando para rodar seu projeto

Dentro desse arquivo vamos digitar:

```jsx
web: npm install && node server.js
```

### PORT

Agora precisamos configurar a porta, até agora o seu projeto usava uma porta no seu localhost, ou seja, no seu computador local, agora vamos usar uma porta dos servidores escolhidos pelo heroku! No seu server.js ele provavelmente deve estar mais ou menos assim:

```jsx
const app = require("./src/app")

const PORT = 8080

app.listen(PORT, ()=>{
    console.log(`Conectamos na porta ${PORT}`)
})
```

Agora, vamos adicionar a variável de ambiente que será colocada pelo próprio heroku, pra isso devemos colocar **process.env.PORT** no código vamos colocar **const PORT = process.env.PORT || 8080** para que ele aceite tanto a porta do heroku quanto a sua porta local, assim você pode testar na sua maquina, não precisando subir para o repositório toda vez que quiser testar.

```jsx
const app = require("./src/app")

**const PORT = process.env.PORT || 8080**

app.listen(PORT, ()=>{
    console.log(`Conectamos na porta ${PORT}`)
})
```

Se você não usou o banco de dados, provavelmente após subir essas duas modificações seu projeto já vai rodar no heroku, mas se você esta usando o mongoDB ainda temos que fazer algumas configurações.

### MONGODB_URI

Provavelmente você tem um arquivo de configuração e conexão com o banco de dados, e atualmente ele está direcionado para um banco local, talvez você tenha algo mais ou menos parecido com isso, ou talvez até tenha um arquivo .env com esse link do banco local numa variável

```jsx
require('dotenv').config()
const mongoose = require('mongoose')

const MONGO_URL = "mongodb://localhost:27017/reprograma"

const connect = () => {
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("Conectadas bb no MongoDb Atlas")
    })
    .catch((error)=>{
        console.log("Algo deu errado")
        console.error(error)
    })
}

module.exports = { connect }
```

Assim como a porta do seu servidor que estava batendo local e agora será no heroku, nós também devemos direcionar para o  Mongo Atlas, um banco de dados na nuvem. Devemos criar uma variável que vai receber a URI de conexão com o mango atlas, colocamos então **process.env.MONGODB_URI** , e assim como na porta vamos deixar que seu projeto atenda tanto o Atlas quando o local

```jsx
require('dotenv').config()
const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGODB_URI  || "mongodb://localhost:27017/reprograma"

const connect = () => {
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("Conectadas bb no MongoDb Atlas")
    })
    .catch((error)=>{
        console.log("Algo deu errado")
        console.error(error)
    })
}

module.exports = { connect }
```

Pode subir essas modificações para o github, não teremos mais configurações no seu código. 

Toda mudança no seu código só vai refletir no heroku após você subir as modificações para o repositório no github

## Configurando o Mongo Atlas

Após criar uma conta no Mongo Atlas você vai ter uma tela mais ou menos assim

![Untitled](imagens_tutorial/Untitled%2015.png)

### Criando o Cluster

Vamos criar o nosso primeiro Cluster! Só clicar em Build a **Database**

![criando-cluster-01.gif](imagens_tutorial/criando-cluster-01.gif)

Cluster significa integrar dois ou mais computadores para que trabalhem simultaneamente no processamento de uma determinada tarefa. Quando falamos de bancos de dados, estamos criando um cluster que possibilita vários de servidores a se conectarem com um único banco de dados. 
Você pode ler mais aqui:

[O que é cluster? Qual a função e objetivos?](https://www.zendesk.com.br/blog/cluster-o-que-e/)

E vamos escolher a opção gratuita! e clicar em Create

![criando-cluster-02.gif](imagens_tutorial/criando-cluster-02.gif)

Aqui vamos aceitar as configurações que já vem como padrão, usaremos a opção gratuita, mantemos o projeto no AWS e na virginia

 

![Untitled](imagens_tutorial/Untitled%2016.png)

suas opções devem ficar assim:

![Untitled](imagens_tutorial/Untitled%2017.png)

A única coisa que mudamos aqui é o nome, o nome escolhido para seu cluster, não pode ter espaços ou caracteres especiais e não poderá ser editado depois

![Untitled](imagens_tutorial/Untitled%2018.png)

Agora sim, clicamos em Create Cluster

![cluster-criado.gif](imagens_tutorial/cluster-criado.gif)

Agora seu Cluster esta sendo criado, ele pode demorar alguns minutos, ele vai ficar com esse tracejado se movimentando enquanto é criado

![criando-cluster-04.gif](imagens_tutorial/criando-cluster-04.gif)

Se tudo deu certo até agora, você deve estar com o seu cluster assim, ele foi criado mais ainda não foi conectado!

![Untitled](imagens_tutorial/Untitled%2019.png)

### Criando um administrador

Devemos criar um usuário administrador desse Cluster, para isso vamos em **Database Acces** no menu de Security

![cluster-add-admin.gif](imagens_tutorial/cluster-add-admin.gif)

Adicionamos aqui o novo nome e senha do nosso admin, o nome não deve ter espaço ou caracteres especiais. **Por favor, guarde esse usuário e essa senha eles vão ser muito importantes!**
Meu usuário é ADMIN e minha senha é senha123 (escolham senhas mais seguras rs)

![cluster-senha-admin.gif](imagens_tutorial/cluster-senha-admin.gif)

Admin criado, ele deve ficar mais ou menos assim:

![Untitled](imagens_tutorial/Untitled%2020.png)

### Liberando IP de acesso

Agora precisamos liberar quem tem acesso de se conectar com nosso cluster, clicamos na opção de **Network Access** e depois em Add IP Address. Nós vamos liberar para que qualquer IP tenha acesso, por isso clicamos na opção **allow access from anywhere** e depois em confirm

![cluster-ip-access.gif](imagens_tutorial/cluster-ip-access.gif)

Ele vai carregar por alguns minutos, repare que o IP de acesso ficara como 0.0.0.0/0 

![cluster-ip-access-done.gif](imagens_tutorial/cluster-ip-access-done.gif)

Ele ficou com o Status Active (ativo) e agora podemos conectar com nosso projeto no Heroku

![Untitled](imagens_tutorial/Untitled%2021.png)

Agora você tem dois bancos de dados, um na sua maquina pessoal e outro na nuvem! As informções do local não estão nesse da nuvem, você deverá popular ele novamente depois que conecta-lo com a aplicação

### Conectando o Cluster com o projeto no Heroku

Agora nós vamos na nossa pagina de administração do nosso app no heroku na aba de Settings, nós vamos adicionar as variáveis de ambiente necessárias para o projeto. Em Settings vamos para a área de Config Vars

![heroku-settings.gif](imagens_tutorial/heroku-settings.gif)

Vamos configurar a conexão do nosso banco de dados, para isso voltamos ao Mongo Atlas e vamos na pagina principal das nossas Databases, onde esta o nosso cluster-projeto e clicamos em connect

![cluster-connect.gif](imagens_tutorial/cluster-connect.gif)

Teremos essa tela aqui, no caso do nosso projeto iremos conectar direto na aplicação

![Untitled](imagens_tutorial/Untitled%2022.png)

Por isso selecionamos a segunda opção: Connect you application, que abrira uma tela com o link de conexão com do nosso banco de dados, vamos copiar esse codigo.

perceba que ele tem a seguinte estrutura:

> mongodb+srv://**SEU-USUARIO:SENHA-DO-SEU-USUARIO**@**SEU-CLUSTER**.8p2fi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

![cluster-connect-link.gif](imagens_tutorial/cluster-connect-link.gif)

Aqui você deve colocar o usuario e a senha de administrados criados anteriormente no tutorial que eu falei q era muuuito importante guardar, caso tenha perdido a senha, você pode voltar nessa etapa e criar um novo usuario ou criar uma nova senha pro usuario ja criado

Dessa forma o meu link ficou assim

> mongodb+srv://ADMIN:senha123@cluster-projeto.8p2fi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

Voltando para o heroku, vamos criar as variáveis de ambiente do projeto, em Config Vars clicamos em Reveal Config Vars. Teremos então o campo de KEY (chave) e o campo de VALUE (valor), nele colocaremos a chave e o valor criado por nós no arquivo de configuração do banco de dados do seu projeto a **MONGODB_URI**

```jsx
const MONGO_URL = process.env.MONGODB_URI  || "mongodb://localhost:27017/reprograma"
```

![heroku-settings-mongo-var.gif](imagens_tutorial/heroku-settings-mongo-var.gif)

Depois de adicionar o nome da variavel e o valor clicamos em add

![heroku-settings-mongo-var-ADD.gif](imagens_tutorial/heroku-settings-mongo-var-ADD.gif)

Se você tem outras variáveis de ambiente no seu .env, como o SECRET para trabalhar com jwt ou qualquer outra que seu projeto dependa pra funcionar você também deve fazer esse processo de adicionar nas config vars as chaves e os valores correspondentes.

![Heroku-secret.gif](imagens_tutorial/Heroku-secret.gif)

Agora se você fez tuuudo certinho e seu codigo não possui outros erros, se você entrar na sua rota ele deve estar funcionando perfeitamente, nos logs, tudo certo!

![Untitled](imagens_tutorial/Untitled%2023.png)

e nossa rota está no ar!

![Untitled](imagens_tutorial/Untitled%2024.png)

Agora podemos executar todas as rotas pensadas pelo Postman ou Insommia, e até disponibilizar para que seja consumido por um front end!
