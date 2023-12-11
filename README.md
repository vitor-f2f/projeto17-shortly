# Shortly
Passar uma URL gigante de um meme, vídeo ou qualquer outra coisa na internet para um(a) amigo(a) é uma situação embaraçosa. Tudo piora quando a pessoa que recebe o link não tem como abri-lo diretamente e é obrigada a escrever o link caractere por caractere.<br>

## Sobre
Shortly é um sistema encurtador de URLs que vem solucionar esse problema. É uma API que permite ao usuário se cadastrar, autenticar, encurtar URLs, visualizar informações sobre as URLs encurtadas e até um ranking com usuários cujos links são mais visitados.

### Teste aqui
https://shortly-api-kyhi.onrender.com

## Como rodar localmente

1. Instale o Postgres seguindo a documentação oficial: <br>
https://www.postgresql.org/docs/current/tutorial-install.html

2. Crie o banco de dados com o seguinte comando: <br>
`psql -U nome_de_usuario -h localhost -c "CREATE DATABASE shortly;"`

3. Clone o repositório e abra o terminal na pasta raíz dele. Você pode baixar o arquivo .zip manualmente ou rodar o seguinte comando no terminal: <br>
`git clone https://github.com/vitor-f2f/projeto17-shortly.git`

4. Com o terminal aberto na raíz do projeto, rode o seguinte comando para gerar as tabelas do banco: <br>
`psql -U nome_de_usuario -h localhost -d shortly < dump.sql`

5. Ainda no mesmo terminal, rode o comando `npm i` para instalar as dependências;

6. Crie um arquivo .env e o configure conforme .env_example;

7. Execute o comando `npm start` para iniciar o projeto;

8. Agora você pode testar as rotas enviando requisições para `http://localhost:5000/`

## Como funciona

A API lida com 8 rotas:

1. POST `/signup`<br>
Cadastro de usuário. Recebe um corpo (body) no formato:
```
{
  "name": "João",
  "email": "joao@driven.com.br",
  "password": "driven",
  "confirmPassword": "driven"
}
```

2. POST `/signin`<br>
Autenticação de usuário. Recebe um corpo (body) no formato:
```
{
  "email": "joao@driven.com.br",
  "password": "driven"
}
```
Retorna um token de autenticação `{ "token": "MEUTOKEN" }`


3. POST `/urls/shorten`<br>
Encurta link enviado por usuário autenticado. Requer um header `Authorization` no formato `Bearer TOKEN`. Recebe um corpo (body) no formato:
```
{
  "url": "https://..."
}
```
Retorna o código encurtado:
```
{
  "id": 1,
  "shortUrl": "a8745bcf" // identificador gerado
}
```

4. GET `/urls/:id`<br>
Busca de detalhes de uma URL por id. Retorna um corpo (body) no formato:
```
{
  "id": 1,
  "shortUrl": "bd8235a0",
  "url": "https://..."
}
```

5. DELETE `/urls/:id`<br>
Exclui URL curta gerada pelo usuário autenticado. Requer um header `Authorization` no formato `Bearer TOKEN`.

6. GET `/urls/open/:shortUrl`<br>
Redireciona para URL a partir de código curto (shortUrl) gerado pelo Shortly. Também acrescenta 1 na contagem de visitas da URL.

7. GET `/users/me`<br>
Busca dados de URLs curtas criadas pelo usuário autenticado. Requer um header `Authorization` no formato `Bearer TOKEN`. Retorna um corpo (body) no formato:
```
{
  "id": id do usuário,
	"name": nome do usuário,
	"visitCount": soma da quantidade de visitas de todos os links do usuário,
	"shortenedUrls": [
		{
			"id": 1,
			"shortUrl": "...",
			"url": "https://...",
			"visitCount": soma da quantidade de visitas do link
		},
		{
			"id": 2,
			"shortUrl": "...",'
			"url": "https://...",
			"visitCount": soma da quantidade de visitas do link
		}
	]
}
```

8. GET `/ranking`<br>
Ranking de usuários ordenados pela soma de visitas em suas URLs curtas. Retorna um corpo (body) no formato:
```
[
	{
		"id": id do usuário,
		"name": nome do usuário,
		"linksCount": 5,
		"visitCount": 100000
	},
	{
		"id": id do usuário,
		"name": nome do usuário,
		"linksCount": 3,
		"visitCount": 85453
	},
	{
		"id": id do usuário,
		"name": nome do usuário,
		"linksCount": 10,
		"visitCount": 0
	},
	{
		"id": id do usuário,
		"name": nome do usuário,
		"linksCount": 0,
		"visitCount": 0
	}
]
```