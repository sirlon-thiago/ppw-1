# 🛒 Documentação da API — E-commerce PPW I (TADS)

Esta API simula o back-end completo de uma loja virtual para uso didático na disciplina de **Programação para Web I** (HTML, CSS e JavaScript/AJAX com `fetch()`).

### 📌 Padrão de Resposta da API
Todos os endpoints retornam objetos **JSON** padronizados contendo o campo booleano `sucesso` (`true` ou `false`) e, quando aplicável, o campo `mensagem` (`string`):

```javascript
// Exemplo de consumo com fetch() e tratamento de erros HTTP:
async function fazerRequisicao(url, opcoes) {
  try {
    const resposta = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...opcoes
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      // Aqui você pode tratar códigos como 400, 401, 402, 404, 409, 410, 422
      console.error(`Erro HTTP ${resposta.status}:`, dados.mensagem);
      return;
    }

    console.log("Sucesso:", dados);
  } catch (erro) {
    console.error("Erro de rede/conexão:", erro);
  }
}
```

### 🗺️ Resumo dos Endpoints

| Método | Endpoint | Descrição | Status de Sucesso | Status de Erro Possíveis |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | [`/api/products`](#-get-apiproducts) | Lista produtos, filtra por categoria/busca ou busca por ID | `200` | `404`, `405` |
| `POST` | [`/api/login`](#-post-apilogin) | Autenticação simulada de usuário | `200` | `400`, `401`, `405` |
| `POST` | [`/api/register`](#-post-apiregister) | Cadastro de novo usuário | `201` | `400`, `405`, `409`, `422` |
| `PUT` / `PATCH` | [`/api/user`](#-put-apiuser-ou-patch-apiuser) | Atualização de dados do perfil do usuário | `200` | `400`, `405`, `409` |
| `POST` | [`/api/frete`](#-post-apifrete) | Cálculo de opções e prazos de frete por CEP | `200` | `400`, `404`, `405`, `422` |
| `POST` | [`/api/cupom`](#-post-apicupom) | Validação de cupom de desconto no carrinho | `200` | `400`, `404`, `405`, `410`, `422` |
| `POST` | [`/api/checkout`](#-post-apicheckout) | Finalização de compra (validação de estoque e pagamento) | `201` | `400`, `402`, `404`, `405`, `422` |
| `DELETE` | [`/api/pedido`](#-delete-apipedido) | Cancelamento de um pedido realizado | `200` | `400`, `404`, `405`, `422` |

---

## 📦 GET /api/products

Retorna a lista de **10 produtos fictícios** do catálogo, permite filtrar por categoria ou termo de busca, ou buscar um único produto pelo seu `id`.

> ⚠️ **Atenção:** O produto de **`id: 9` ("Cadeira Ergonômica Pro")** possui `stock: 0` propositalmente para que você possa testar a exibição de produto esgotado na vitrine e o tratamento de erro de estoque no checkout.

### 📌 URLs e Parâmetros de Consulta (Query Params)
```
GET https://ppw-1-tads.vercel.app/api/products
GET https://ppw-1-tads.vercel.app/api/products?id=1
GET https://ppw-1-tads.vercel.app/api/products?category=Eletronicos
GET https://ppw-1-tads.vercel.app/api/products?search=mouse
```

| Query Param | Obrigatório | Descrição |
| :--- | :--- | :--- |
| `id` | Não | Retorna apenas o produto correspondente ao ID informado (1 a 10). Se não existir, retorna erro `404`. |
| `category` (ou `categoria`) | Não | Filtra produtos pela categoria (`Vestuário`, `Eletrônicos`, `Calçados`, `Eletrodomésticos`, `Acessórios`, `Móveis`). Ignora acentos e maiúsculas/minúsculas. |
| `search` (ou `busca`) | Não | Filtra produtos cujo nome ou categoria contenha o texto pesquisado. |

### 🔹Formato dos Dados de Cada Produto

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | number | Identificador único do produto (1 a 10) |
| `name` | string | Nome do produto |
| `category` | string | Categoria do produto |
| `description` | string | Descrição do produto |
| `price` | number | Preço unitário (entre `79.90` e `4599.00`) |
| `stock` | number | Quantidade disponível em estoque (`0` a `20`) |
| `image` | string | URL da imagem do produto |

### 📤 Respostas

#### ✔️ **200 OK — Lista de produtos (`GET /api/products`)**
```json
{
  "sucesso": true,
  "total": 10,
  "products": [
    {
      "id": 1,
      "name": "Camiseta Premium",
      "category": "Vestuário",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet accumsan urna.",
      "price": 79.9,
      "stock": 15,
      "image": "https://ppw-1-tads.vercel.app/images/camiseta.png"
    },
    {
      "id": 2,
      "name": "Notebook XFast 15",
      "category": "Eletrônicos",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies nulla at nibh vehicula.",
      "price": 4599,
      "stock": 5,
      "image": "https://ppw-1-tads.vercel.app/images/notebook.jpg"
    }
  ]
}
```

#### ✔️ **200 OK — Produto único (`GET /api/products?id=1`)**
```json
{
  "sucesso": true,
  "product": {
    "id": 1,
    "name": "Camiseta Premium",
    "category": "Vestuário",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet accumsan urna.",
    "price": 79.9,
    "stock": 15,
    "image": "https://ppw-1-tads.vercel.app/images/camiseta.png"
  }
}
```

#### ❌ **404 Not Found — Produto não encontrado (`GET /api/products?id=99`)**
```json
{
  "sucesso": false,
  "mensagem": "Produto não encontrado."
}
```

---

## 🔐 POST /api/login

Endpoint utilizado para simular o processo de autenticação do usuário.

### 📌 URL
```
POST https://ppw-1-tads.vercel.app/api/login
```

### 📥 Requisição (Body JSON)

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `email` | string | ✔️ | E-mail do usuário |
| `senha` | string | ✔️ | Senha do usuário |

```json
{
  "email": "joao@example.com",
  "senha": "123456"
}
```

### 📤 Respostas

#### ✔️ **200 OK — Login efetuado**
Retorna quando o usuário envia qualquer combinação de e-mail e senha, **exceto** os casos de erro abaixo. O front-end pode salvar os dados do usuário no `localStorage` ou `sessionStorage`.

```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso.",
  "usuario": {
    "email": "joao@example.com",
    "nome": "joao"
  }
}
```

#### ❌ **400 Bad Request — Campos obrigatórios**
Retorna quando `email` ou `senha` não são enviados:
```json
{
  "sucesso": false,
  "mensagem": "E-mail e senha são obrigatórios."
}
```

#### ❌ **401 Unauthorized — Credenciais inválidas**
Retorna quando `email` = `"admin"` e `senha` = `"admin"`, ou quando `senha` = `"senhaerrada"`:
```json
{
  "sucesso": false,
  "mensagem": "Usuário ou senha inválidos."
}
```

---

## 📌 POST /api/register

Cria um novo usuário fictício realizando validações de campos, formato de e-mail, conflito de e-mail existente e força da senha.

### 📌 URL
```
POST https://ppw-1-tads.vercel.app/api/register
```

### 📥 Parâmetros esperados (Body JSON)

```json
{
  "nome": "Maria Oliveira",
  "email": "maria@example.com",
  "senha": "senha123",
  "confirmacaoSenha": "senha123"
}
```

### 📤 Respostas

#### ✔️ **201 Created — Usuário registrado**
```json
{
  "sucesso": true,
  "mensagem": "Usuário registrado com sucesso."
}
```

#### ❌ **400 Bad Request — Campos obrigatórios faltando**
```json
{
  "sucesso": false,
  "mensagem": "Todos os campos são obrigatórios."
}
```

#### ❌ **400 Bad Request — E-mail inválido**
```json
{
  "sucesso": false,
  "mensagem": "E-mail inválido."
}
```

#### ❌ **400 Bad Request — Senhas não conferem**
```json
{
  "sucesso": false,
  "mensagem": "As senhas não são idênticas."
}
```

#### ❌ **409 Conflict — E-mail já cadastrado**
Retorna quando o `email` enviado for `"admin@email.com"`, `"joao@example.com"` ou `"teste@email.com"`:
```json
{
  "sucesso": false,
  "mensagem": "Este e-mail já está cadastrado."
}
```

#### ❌ **422 Unprocessable Entity — Senha muito curta**
Retorna quando a `senha` tiver menos de 6 caracteres:
```json
{
  "sucesso": false,
  "mensagem": "A senha deve ter no mínimo 6 caracteres."
}
```

---

## 🧩 PUT /api/user ou PATCH /api/user

Atualiza informações básicas do usuário (`nome` e `email`).

### 📌 URL
```
PUT https://ppw-1-tads.vercel.app/api/user
PATCH https://ppw-1-tads.vercel.app/api/user
```

### 📥 Corpo da Requisição (Body JSON)

```json
{
  "nome": "João da Silva",
  "email": "joao.novo@example.com"
}
```

### 📤 Respostas

#### ✔️ **200 OK — Dados atualizados**
```json
{
  "sucesso": true,
  "mensagem": "Dados alterados com sucesso.",
  "dados": {
    "nome": "João da Silva",
    "email": "joao.novo@example.com"
  }
}
```

#### ❌ **400 Bad Request — Campos obrigatórios ou e-mail inválido**
```json
{
  "sucesso": false,
  "mensagem": "Nome e e-mail são obrigatórios."
}
```
ou
```json
{
  "sucesso": false,
  "mensagem": "E-mail inválido."
}
```

#### ❌ **409 Conflict — E-mail já em uso**
Retorna quando tentar alterar o `email` para `"admin@email.com"`:
```json
{
  "sucesso": false,
  "mensagem": "Este e-mail já está em uso por outro usuário."
}
```

---

## 🚚 POST /api/frete

Calcula opções de frete a partir de um CEP informado. Os valores retornados são fictícios e variam aleatoriamente entre **50.00** e **150.00**.

### 📌 URL
```
POST https://ppw-1-tads.vercel.app/api/frete
```

### 📥 Parâmetros (Body JSON)

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `cep` | string | ✔️ | CEP no formato `99999-999` |

```json
{
  "cep": "73800-000"
}
```

### 📤 Respostas

#### ✔️ **200 OK — Opções de frete calculadas**
```json
{
  "sucesso": true,
  "cep": "73800-000",
  "fretes": [
    {
      "servico": "Correios - PAC",
      "valor": 73.42,
      "prazo": "5 a 10 dias úteis"
    },
    {
      "servico": "Correios - Sedex",
      "valor": 128.99,
      "prazo": "2 a 4 dias úteis"
    },
    {
      "servico": "Transportadora XPTO",
      "valor": 91.10,
      "prazo": "3 a 7 dias úteis"
    }
  ]
}
```

#### ❌ **400 Bad Request — Formato de CEP inválido**
```json
{
  "sucesso": false,
  "mensagem": "CEP inválido. Formato esperado: 99999-999"
}
```

#### ❌ **404 Not Found — CEP inexistente**
Retorna quando for enviado o CEP `"00000-000"`:
```json
{
  "sucesso": false,
  "mensagem": "CEP não encontrado na base de dados."
}
```

#### ❌ **422 Unprocessable Entity — Região não atendida**
Retorna quando o CEP começar com `"99999-"` (ex.: `"99999-000"`):
```json
{
  "sucesso": false,
  "mensagem": "Não realizamos entregas para esta região."
}
```

---

## 🎟️ POST /api/cupom

Valida um código de cupom de desconto no carrinho de compras.

### 📌 URL
```
POST https://ppw-1-tads.vercel.app/api/cupom
```

### 📥 Parâmetros (Body JSON)

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `codigo` | string | ✔️ | Código do cupom (ex.: `TADS10`, `TADS20`, `FRETEGRATIS`, `VIP50`, `EXPIRADO`) |
| `subtotal` | number | Opcional (obrigatório para `VIP50`) | Valor subtotal atual do carrinho para validar regra de compra mínima |

```json
{
  "codigo": "TADS10",
  "subtotal": 250.00
}
```

### 🎟️ Tabela de Cupons para Teste

| Código | Comportamento | Status HTTP |
| :--- | :--- | :--- |
| `TADS10` | 10% de desconto (`tipo: "percentual"`, `desconto: 10`) | `200 OK` |
| `TADS20` | 20% de desconto (`tipo: "percentual"`, `desconto: 20`) | `200 OK` |
| `FRETEGRATIS` | 100% de desconto no frete (`tipo: "frete_gratis"`, `desconto: 100`) | `200 OK` |
| `VIP50` | R$ 50,00 de desconto fixo (`tipo: "fixo"`, `desconto: 50`), **exige `subtotal >= 500`** | `200 OK` ou `422` |
| `EXPIRADO` | Simula um cupom fora da validade | `410 Gone` |
| Qualquer outro | Simula cupom inexistente | `404 Not Found` |

### 📤 Respostas

#### ✔️ **200 OK — Cupom válido**
```json
{
  "sucesso": true,
  "mensagem": "Cupom de 10% de desconto aplicado com sucesso!",
  "cupom": {
    "codigo": "TADS10",
    "tipo": "percentual",
    "desconto": 10
  }
}
```

#### ❌ **400 Bad Request — Código não informado**
```json
{
  "sucesso": false,
  "mensagem": "O código do cupom é obrigatório."
}
```

#### ❌ **404 Not Found — Cupom inexistente**
```json
{
  "sucesso": false,
  "mensagem": "Cupom inválido ou não encontrado."
}
```

#### ❌ **410 Gone — Cupom expirado (`codigo: "EXPIRADO"`)**
```json
{
  "sucesso": false,
  "mensagem": "Este cupom já expirou."
}
```

#### ❌ **422 Unprocessable Entity — Valor mínimo não atingido (`codigo: "VIP50"` com `subtotal < 500`)**
```json
{
  "sucesso": false,
  "mensagem": "Este cupom exige compra mínima de R$ 500,00."
}
```

---

## 💳 POST /api/checkout

Finaliza o pedido validando os itens do carrinho, disponibilidade em estoque, CEP e forma de pagamento.

### 📌 URL
```
POST https://ppw-1-tads.vercel.app/api/checkout
```

### 📥 Parâmetros (Body JSON)

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `itens` | array | ✔️ | Lista de objetos `{ id: number, quantidade: number }` |
| `cep` | string | ✔️ | CEP de entrega no formato `99999-999` |
| `metodoPagamento` | string | ✔️ | Valores aceitos: `"pix"`, `"boleto"` ou `"cartao"` |
| `numeroCartao` | string | Se `metodoPagamento === "cartao"` | Número do cartão (cartões terminados em `0000` simulam recusa) |

```json
{
  "itens": [
    { "id": 1, "quantidade": 2 },
    { "id": 7, "quantidade": 1 }
  ],
  "cep": "73800-000",
  "metodoPagamento": "cartao",
  "numeroCartao": "4111222233334444"
}
```

### 📤 Respostas

#### ✔️ **201 Created — Pedido realizado com sucesso**
```json
{
  "sucesso": true,
  "mensagem": "Pedido realizado com sucesso!",
  "pedido": {
    "protocolo": "PED-2026-4812",
    "status": "Aprovado",
    "cep": "73800-000",
    "metodoPagamento": "cartao",
    "totalItens": 3,
    "valorProdutos": 349.7
  }
}
```

#### ❌ **400 Bad Request — Dados inválidos ou carrinho vazio**
Retorna quando `itens` está vazio, `cep` é inválido, `metodoPagamento` não é reconhecido ou falta `numeroCartao` no pagamento via cartão:
```json
{
  "sucesso": false,
  "mensagem": "O carrinho está vazio. Adicione pelo menos um item."
}
```

#### ❌ **402 Payment Required — Cartão recusado**
Retorna quando `metodoPagamento` é `"cartao"` e `numeroCartao` termina em `"0000"`:
```json
{
  "sucesso": false,
  "mensagem": "Pagamento recusado pela operadora do cartão."
}
```

#### ❌ **404 Not Found — Produto inexistente**
Retorna quando algum item do carrinho possui um `id` que não existe no catálogo (ex.: `id: 99`):
```json
{
  "sucesso": false,
  "mensagem": "Produto com ID 99 não encontrado."
}
```

#### ❌ **422 Unprocessable Entity — Estoque insuficiente**
Retorna quando a `quantidade` solicitada ultrapassa o `stock` do produto (por exemplo, comprar o produto de `id: 9` que possui `stock: 0`):
```json
{
  "sucesso": false,
  "mensagem": "Estoque insuficiente para \"Cadeira Ergonômica Pro\" (disponível: 0)."
}
```

---

## 🗑️ DELETE /api/pedido

Cancela um pedido realizado anteriormente. O `protocolo` pode ser enviado via Query Param (`?protocolo=...`) ou no corpo da requisição JSON.

### 📌 URL
```
DELETE https://ppw-1-tads.vercel.app/api/pedido?protocolo=PED-2026-4812
```

### 📥 Parâmetros (Query Param ou Body JSON)

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `protocolo` | string | ✔️ | Código do pedido gerado no checkout (ex.: `PED-2026-4812`) |

### 📤 Respostas

#### ✔️ **200 OK — Pedido cancelado**
Retorna para qualquer protocolo informado (exceto os protocolos especiais de erro abaixo):
```json
{
  "sucesso": true,
  "mensagem": "Pedido cancelado com sucesso.",
  "protocolo": "PED-2026-4812"
}
```

#### ❌ **400 Bad Request — Protocolo não informado**
```json
{
  "sucesso": false,
  "mensagem": "O protocolo do pedido é obrigatório."
}
```

#### ❌ **404 Not Found — Pedido inexistente (`protocolo=PED-0000`)**
```json
{
  "sucesso": false,
  "mensagem": "Pedido não encontrado."
}
```

#### ❌ **422 Unprocessable Entity — Pedido já enviado (`protocolo=PED-ENVIADO`)**
```json
{
  "sucesso": false,
  "mensagem": "Não é possível cancelar um pedido que já foi enviado para a transportadora."
}
```
