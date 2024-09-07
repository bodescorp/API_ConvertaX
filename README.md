# Projeto de API de Investimentos

## Descrição

Este é um projeto de API para gerenciamento de investimentos, permitindo a criação, visualização, e retirada de investimentos. A API foi desenvolvida utilizando o framework NestJS e oferece funcionalidades de autenticação, cache e cálculos financeiros.

## Funcionalidades

- **Gerenciamento de Investimentos:** Criação e visualização de investimentos.
- **Retiradas:** Realização de retiradas e cálculo de impostos.
- **Cache:** Utilização de cache para otimização de consultas.
- **Validação e Autenticação:** Proteção e validação de dados de entrada.

## Tecnologias Utilizadas

- **NestJS:** Framework para Node.js
- **TypeORM:** ORM para TypeScript e JavaScript
- **PostgreSQL:** Banco de dados relacional
- **Redis:** Sistema de cache (opcional, para melhorar a performance)
- **Docker:** Containerização (opcional, para ambientes de desenvolvimento e produção)

## Pré-requisitos

Certifique-se de que você tem as seguintes ferramentas instaladas:

- Node.js (versão 14 ou superior)
- PostgreSQL
- Redis (opcional, para cache)
- Docker (opcional, para containerização)

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/bodescorp/API_ConvertaX.git
   cd API_ConvertaX
   ```

2. **Instale as dependências:**

   ```bash
   yarn install
   ```

3. **Configure o banco de dados:**

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

   ```env
   JWT_SECRET=senha
   JWT_EXPIRATION_TIME=tempo de expiração do token
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=seu_usuario
   DATABASE_PASSWORD=sua_senha
   DATABASE_NAME=seu_banco_de_dados
   ```

4. **Execute as migrations para criar as tabelas:**

   ```bash
   npm run migration:run
   ```

5. **Inicie o servidor:**

   ```bash
   yarn start
   ```

   Se estiver usando Docker, você pode iniciar o servidor com:

   ```bash
   docker-compose up
   ```

## Endpoints

### Investimentos

- **Criar Investimento**

  - `POST /investment`
  - Corpo da solicitação:

    ```json
    {
      "initial_amount": 1000,
      "creation_date": "2024-09-07T00:00:00Z"
    }
    ```

- **Listar Investimentos**

  - `GET /investment`
  - Parâmetros de consulta (opcional):
    - `status`: Filtra investimentos por status
    - `page`: Número da página
    - `limit`: Número de itens por página

- **Detalhes do Investimento**

  - `GET /investment/:id`

### Retiradas

- **Criar Retirada**

  - `POST /withdrawal/:investmentId`
  - Corpo da solicitação:

    ```json
    {
      "amount": 100
    }
    ```

## Testes

Para rodar os testes, use:

```bash
yarn test
```

## Contribuição

1. **Faça um Fork do Repositório.**
2. **Crie uma Branch para a sua Feature ou Correção:**

   ```bash
   git checkout -b minha-feature
   ```

3. **Faça suas alterações e adicione testes se necessário.**
4. **Envie suas alterações para o Repositório:**

   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin minha-feature
   ```

5. **Crie um Pull Request.**

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

## Contato

Se você tiver alguma dúvida, entre em contato através do e-mail: glaymar2010@gmail.com