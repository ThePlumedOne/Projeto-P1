# IA utilizada: ChatGPT 5.0

* Foi utilizada principalmente para ajudar a implementar a autenticação tanto no código quanto nas requests protegidas por token JWT

### Prompt: Por onde começar a implementação de um middleware de autenticação JWT?

Autenticação JWT

Passos:

* Crie um middleware que verifica um header (Authorization ou x-api-key).

* Compare com um token definido no .env.

* Se bater, chama next(). Se não, retorna 401 Unauthorized.


* No arquivo .env: 

```env
JWT_SECRET=supersecreta123
JWT_EXPIRES=1h
```
* Para a autenticação: 

```js
const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // pega "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Token ausente' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });

        req.user = user; // guarda info do usuário autenticado
        next();
    });
};

module.exports = jwtAuth;

```

* Para a rota de login: 

```js
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Aqui seria um banco de dados, mas por enquanto fixo:
    if (username === 'admin' && password === '1234') {
        const token = jwt.sign(
            { user: username }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES }
        );

        return res.json({ token });
    }

    return res.status(401).json({ error: 'Credenciais inválidas' });
});

```

### Prompt: E quanto às RESTful requests? como incluir o token de autorização? 

Para uma RESTful request numa url protegida, deve-se enviar o token de autenticação no header de toda request:

```
POST /url.path HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer <SEU_TOKEN_AQUI>

{
  [seu JSON]
}
```

### Prompt: Certo. como guardar o token gerado no momento da autenticação numa variável acessivo no arquivo REST?

Você pode criar um request de login no mesmo ```.rest``` e salvar o token em uma variável:

```
# Faz login e salva token
POST http://localhost:3000/login
Content-Type: application/json

{
  "username": "admin",
  "password": "senha"
}

> {%
client.global.set("token", response.body.token);
%}
```
* E para incluí-lo nos headers:
```
POST http://localhost:3000/url.path
Content-Type: application/json
Authorization: Bearer {{token}}

{
  [Seu JSON]
}
```
## O resultado funcionou para você?

Sim. O resultado fornecido pela IA auxiliou no desenvolvimento da API, direcionando a pesquisa e fornecendo um código limpo e completo o suficiente para adicionar mais funcionalidades e adaptá-lo às necessidades desse projeto específico.



