# Projeto Cinema - 3º Período

Este projeto é uma aplicação de cinema desenvolvida com frontend, backend, banco de dados MySQL e Nginx como proxy reverso. A aplicação roda em containers Docker, facilitando a configuração do ambiente de desenvolvimento.

## Tecnologias utilizadas

* React no frontend
* Node.js com TypeScript no backend
* MySQL como banco de dados
* Docker e Docker Compose
* Nginx como proxy reverso
* HTTPS local com certificado
* Variáveis de ambiente com arquivo `.env`

## Estrutura do projeto

```text
Projeto-3-periodo/
├── Projeto-back-end/
├── Projeto-front-end/
├── certs/
├── docker-compose.yml
├── nginx.conf
├── .env.example
└── README.md
```

## Configuração do ambiente

Antes de iniciar o projeto, é necessário criar o arquivo `.env` na raiz do projeto.

Use o arquivo `.env.example` como modelo:

```bash
copy .env.example .env
```

Depois, confira se as variáveis estão preenchidas corretamente no arquivo `.env`.

## Configuração do host local

O projeto utiliza o endereço:

```text
https://cinema.local
```

Para funcionar no Windows, é necessário editar o arquivo `hosts`.

Abra o Bloco de Notas como administrador e edite o arquivo:

```text
C:\Windows\System32\drivers\etc\hosts
```

Adicione a seguinte linha no final:

```text
127.0.0.1 cinema.local
```

Salve o arquivo.

## Como iniciar o projeto

Com o Docker Desktop aberto, rode o comando na raiz do projeto:

```bash
docker compose up --build
```

Depois acesse no navegador:

```text
https://cinema.local
```

Também é possível testar a API pelo endereço:

```text
https://cinema.local/api/
```

## Como parar o projeto

Para parar os containers, use:

```bash
docker compose down
```

## Segurança e organização

O projeto utiliza variáveis de ambiente para evitar senhas e dados sensíveis escritos diretamente no código.

O arquivo `.env` não deve ser enviado para o GitHub. Apenas o arquivo `.env.example` deve ficar no repositório como modelo.

Além disso, apenas o Nginx fica exposto externamente nas portas 80 e 443. O backend e o banco de dados ficam disponíveis apenas dentro da rede interna do Docker.

O Nginx também possui cabeçalhos básicos de segurança, como:

* X-Frame-Options
* X-Content-Type-Options
* Referrer-Policy
* Permissions-Policy
* Content-Security-Policy

## Observações

Caso apareça um aviso de certificado no navegador, clique em “Avançado” e depois em “Continuar para cinema.local”. Isso acontece porque o projeto utiliza certificado local para HTTPS.

## Testes end-to-end

O projeto possui testes end-to-end com Playwright para validar os principais fluxos da aplicação.

Os testes implementados cobrem:

* Login com sucesso
* Login com falha
* Cadastro de usuário com sucesso
* Cadastro de usuário com falha
* CRUD completo de filmes
* CRUD completo de salas

Para executar os testes, o Docker precisa estar rodando e a aplicação deve estar disponível em:

```text
https://cinema.local
```

Depois, entre na pasta do frontend:

```bash
cd Projeto-front-end
```

Execute:

```bash
npm run test:e2e
```

O resultado esperado é:

```text
6 passed
```

## Husky e validações automáticas

O projeto utiliza Husky para automatizar validações antes dos commits e pushs.

Foram configurados os seguintes hooks:

* `pre-commit`: executa os testes E2E antes de permitir um commit.
* `pre-push`: executa os testes E2E antes de enviar alterações para o GitHub.
* `commit-msg`: valida se a mensagem do commit segue o padrão Conventional Commits.

Exemplo de mensagem válida:

```bash
git commit -m "test(e2e): adiciona testes de login"
```

Isso ajuda a manter a qualidade do projeto e evita que alterações sejam enviadas sem passar pelos testes.
