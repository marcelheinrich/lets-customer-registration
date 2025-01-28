# Projeto CRUD Customers com Docker e Banco de Dados

Este projeto utiliza o Docker para rodar uma instância local de banco de dados e simular eventos para testar as funções. Abaixo estão os passos e explicações para rodar e interagir com o sistema.

## Pré-requisitos

- **Node.js** instalado na sua máquina. [Instalar Node.js](https://nodejs.org/)
- **Docker** instalado e configurado. [Instalar Docker]()
- **Docker Compose** para gerenciar containers. [Instalar Docker Compose]()

## Como usar

1. **Iniciar o Docker** : O primeiro passo é iniciar os containers do Docker, que irão rodar os serviços necessários para o banco de dados ou outras dependências. Use o script abaixo para iniciar o Docker.

```
	npm run docker:start

```

Este comando irá executar o `docker-compose` para iniciar os containers em segundo plano (`-d`).

1. **Escolher a função a ser executada** : Após iniciar o Docker, você pode escolher um dos seguintes métodos para rodar as funções de teste. Use um dos comandos abaixo dependendo do evento que você deseja simular:

- #A requisição para cada um dos itens abaixo é configurada na pasta events. Lá você pode ajustar os dados que deseja.

- **Criar um cliente** :

  ```
  npm run start:post

  ```

- **Listar os clientes** :

  ```
  npm run start:list

  ```

- **Obter um cliente por ID** :

  ```
  npm run start:get

  ```

- **Atualizar um cliente** :

  ```
  npm run start:update
  ```

  **Deletar um cliente** :

```
	npm run start:delete
```

Cada comando acima vai construir o projeto, definir a variável de ambiente `EVENT_TYPE` para o tipo de evento desejado e rodar o script `test-local.js` que irá simular a execução do evento correspondente.

# **Outros**

1. **Resetar o banco de dados** : Caso queira resetar o banco de dados (remover dados persistentes), você pode usar o seguinte comando:

   `npm run reset:db`

   Este comando irá parar os containers do Docker e remover volumes (`-v`), garantindo que o banco de dados seja completamente apagado.

1. **Rodar os testes** : Para rodar os testes automatizados do projeto, basta usar o comando abaixo:

   `   npm run test`

   Este comando executa os testes com o Jest, com a opção `--silent` para não exibir mensagens excessivas durante a execução dos testes.

1. **Setup do Banco de Dados Local** : Caso precise rodar um setup inicial do banco de dados, utilize o comando:

   `npm run setup:db `

   Esse comando irá rodar um script para configurar o banco de dados local antes de começar os testes.
